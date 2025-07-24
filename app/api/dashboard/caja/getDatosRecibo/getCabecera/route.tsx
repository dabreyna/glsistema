import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
type MovimientoDetalle = {
    id_movimiento_detalle: number;
    no_pago: number | null;
    id_tipo_movimiento: number;
    monto: number;
    no_recibo: number | null;
    servicio?: string;
    id_servicio?: number;
    fecha_mov_reverse: string;
    fecha_mov_final: string;
    fecha_movimiento_formato: string;
    fecha_movimiento?: string | Date; // 👈 agrégala aquí
    marca?: boolean;
};

function generarTablaConceptos(tDatosRecibo: MovimientoDetalle[], idRecibo: number, gno_pagos: number): string[][] {
    const headers: string[] = ["# pago", "Fecha vencimiento"];
    const rows: string[][] = [];

    const intereses = tDatosRecibo.filter((r) => r.id_tipo_movimiento === 8 && r.no_recibo === idRecibo);
    const mensualidades = tDatosRecibo.filter((r) => r.id_tipo_movimiento === 3 && r.no_recibo === idRecibo);
    const serviciosOriginal = tDatosRecibo.filter((r) => r.id_tipo_movimiento === 10 && r.no_recibo === idRecibo);

    // Mapear fechas de vencimiento por no_pago
    const vencimientos = new Map<number, string>();
    const vencimientosDate = new Map<number, Date>();

    for (const r of tDatosRecibo) {
        if (r.id_tipo_movimiento === 2 && r.no_pago != null) {
            vencimientos.set(r.no_pago, r.fecha_movimiento_formato);
            const fechaRaw = (r as any).fecha_movimiento ?? "1970-01-01";
            vencimientosDate.set(r.no_pago, new Date(fechaRaw));
        }
    }

    const servicios = serviciosOriginal.map((s) => {
        if (s.no_pago != null) return s;

        const fechaRaw = (s as any).fecha_movimiento ?? "1970-01-01";
        const fechaServicio = new Date(fechaRaw);
        let pagoAsignado: number | null = null;

        vencimientosDate.forEach((fecha, no_pago) => {
            if (fechaServicio <= fecha) {
                if (pagoAsignado === null || fecha < vencimientosDate.get(pagoAsignado)!) {
                    pagoAsignado = no_pago;
                }
            }
        });

        return { ...s, no_pago: pagoAsignado };
    });

    if (intereses.length > 0) headers.push("Intereses");

    const serviciosUnicos: string[] = Array.from(new Set(servicios.map((s) => s.servicio).filter(Boolean) as string[]));
    headers.push(...serviciosUnicos);

    if (mensualidades.length > 0) headers.push("Depósito");

    tDatosRecibo.forEach((r) => (r.marca = false));

    const pagosUnicos = Array.from(new Set(mensualidades.map((r) => r.no_pago).filter((p) => p != null))).sort((a, b) => a! - b!);

    for (const no_pago of pagosUnicos) {
        const fila: string[] = [];

        const periodo = tDatosRecibo.find((r) => r.no_pago === no_pago && r.id_tipo_movimiento === 2);
        if (!periodo) continue;

        fila.push(`${no_pago}`);
        fila.push(periodo.fecha_movimiento_formato);

        if (headers.includes("Intereses")) {
            const inter = intereses.find((i) => i.no_pago === no_pago && !i.marca);
            fila.push(inter ? formatoMoneda(inter.monto) : "");
            if (inter) inter.marca = true;
        }

        for (const servicioNombre of serviciosUnicos) {
            const servi = servicios.find((s) => s.servicio === servicioNombre && s.no_pago === no_pago && !s.marca);
            fila.push(servi ? formatoMoneda(servi.monto) : "");
            if (servi) servi.marca = true;
        }

        if (headers.includes("Depósito")) {
            const mensual = mensualidades.find((m) => m.no_pago === no_pago && !m.marca);
            fila.push(mensual ? formatoMoneda(mensual.monto) : "");
            if (mensual) mensual.marca = true;
        }

        rows.push(fila);
    }

    return [headers, ...rows];
}

function formatoMoneda(monto: number | string | undefined): string {
    const num = Number(monto ?? 0);
    return `$${num.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const idRecibo = searchParams.get("idRecibo");
    const tipoPago = searchParams.get("tipoPago");
    let datosRecibo = null;

    let prefolio = "";

    const getDatosRecibo = async () => {
        let sql = "";
        let datosCabecera = null;
        let datosConceptos = null;
        let datosResumen = null;
        //----
        let descuento_interes = 0;
        let descuento_mensualidad = 0;
        let total_recibo = 0;
        let saldo = 0;
        let total = 0;
        //----
        sql = `select bnd_cancelado from CONTRATOS_TERRENOS where ID_CONTRATO=${idContrato} and BND_CANCELADO=true`;
        const estatusContrato = (await dbQuery(sql)).rowCount;

        sql = `select id_contrato,monto,id_tipo_movimiento,saldo_recibo,no_pago,descuento_interes,descuento_mensualidad,usuario
          ,fecha_movimiento,tipo_cambio,monto_efectivo,monto_dlls,monto_cheque,referencia,no_recibo,to_char(fecha_movimiento,'dd/MM/yyyy') as fecha_movimiento_format
          from movimientos_detalle where no_recibo=${idRecibo} and id_contrato=${idContrato} and id_tipo_pago=${tipoPago} and coalesce(bnd_contrato_cancelado,false)=false order by id_tipo_movimiento`;

        if (estatusContrato != null && estatusContrato > 0) {
            sql = `select id_contrato,monto,id_tipo_movimiento,saldo_recibo,no_pago,descuento_interes,descuento_mensualidad,usuario
            ,fecha_movimiento,tipo_cambio,monto_efectivo,monto_dlls,monto_cheque,referencia,no_recibo,to_char(fecha_movimiento,'dd/MM/yyyy') as fecha_movimiento_format
            from movimientos_detalle where no_recibo=${idRecibo} and id_contrato=${idContrato} and id_tipo_pago=${tipoPago} and bnd_contrato_cancelado=true order by id_tipo_movimiento`;
        }
        const datosMovimientos = await dbQuery(sql);

        sql = `select e.RAZON_SOCIAL,d.FRACCIONAMIENTO,d.NOMENCLATURA,c.NO_MANZANA,b.NO_TERRENO,e.DIRECCION,e.rfc,e.CIUDAD,e.estado,e.CP,e.TELEFONO_principal
            ,concat(f.nombre,' ',f.ap_paterno,' ',coalesce(f.ap_materno,'')) as nombre_cliente,to_char(a.fecha_contrato,'dd/MM/yyyy') as fecha_contrato,coalesce(g.moneda,0) as moneda
            ,g.no_pagos,a.id_estatus_contrato,e.folio_notas_credito
            from CONTRATOS_TERRENOS a
            inner join CAT_TERRENOS b on b.ID_TERRENO=a.ID_TERRENO
            inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
            inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
            inner join CAT_EMPRESAS e on e.ID_EMPRESA=d.id_EMPRESA
            inner join clientes f on f.id_cliente=a.id_cliente
            inner join movimientos_cabecera g on a.id_contrato=g.id_contrato
            where a.ID_CONTRATO=${idContrato}`;

        const datosEmpresa = await dbQuery(sql);

        if (datosMovimientos && datosEmpresa) {
            const rMensualidades = datosMovimientos.rows.filter((m) => m.id_tipo_movimiento === 3);
            const rServicios = datosMovimientos.rows.filter((m) => m.id_tipo_movimiento === 11);

            descuento_interes = datosMovimientos.rows.reduce((acum, movimiento) => {
                if (movimiento.id_tipo_movimiento === 6) {
                    return acum + parseFloat(movimiento.monto);
                }
                return acum;
            }, 0);
            descuento_mensualidad = datosMovimientos.rows.reduce((acum, movimiento) => {
                if (movimiento.id_tipo_movimiento === 5) {
                    return acum + parseFloat(movimiento.monto);
                }
                return acum;
            }, 0);

            total_recibo = datosMovimientos.rows.reduce((acum, movimiento) => {
                if (movimiento.id_tipo_movimiento === 4) {
                    return acum + parseFloat(movimiento.monto);
                }
                return acum;
            }, 0);
            saldo = datosMovimientos.rows.reduce((acum, movimiento) => {
                if (movimiento.id_tipo_movimiento === 4) {
                    return acum + parseFloat(movimiento.saldo_recibo);
                }
                return acum;
            }, 0);
            total = total_recibo - descuento_interes - descuento_mensualidad;

            if (rMensualidades.length > 5 || rServicios.length > 5) {
                datosResumen = await getDatosResumen();
            }

            datosCabecera = {
                datosMovimientos: datosMovimientos.rows,
                datosEmpresa: datosEmpresa.rows,
                saldosRecibo: {
                    descuento_interes: descuento_interes,
                    descuento_mensualidad: descuento_mensualidad,
                    total_recibo: total_recibo,
                    saldo: saldo,
                    total: total,
                },
            };
            sql = `select a.*,b.*,to_char(a.fecha_movimiento,'yyyyMMdd') as fecha_mov_reverse,TO_CHAR(a.fecha_movimiento + INTERVAL '1 month' - INTERVAL '1 day', 'YYYYMMDD') AS fecha_mov_final
                ,to_char(a.fecha_movimiento,'dd/MM/yyyy') as fecha_movimiento_formato
                from movimientos_detalle a 
                left join cat_servicios b on a.id_servicio=b.id_servicio
                where a.id_contrato=${idContrato} 
                and coalesce(a.bnd_contrato_cancelado,false)=false
                order by a.fecha_movimiento`;
            if (estatusContrato != null && estatusContrato > 0) {
                sql = `select a.*,b.*,to_char(a.fecha_movimiento,'yyyyMMdd') as fecha_mov_reverse,TO_CHAR(a.fecha_movimiento + INTERVAL '1 month' - INTERVAL '1 day', 'YYYYMMDD') AS fecha_mov_final
                    ,to_char(a.fecha_movimiento,'dd/MM/yyyy') as fecha_movimiento_formato
                    from movimientos_detalle a 
                    left join cat_servicios b on a.id_servicio=b.id_servicio
                    where a.id_contrato=${idContrato} 
                    and a.bnd_contrato_cancelado=true
                    order by a.fecha_movimiento`;
            }

            const tDatosRecibo = await dbQuery(sql);
            const gno_pagos = datosCabecera.datosEmpresa[0].no_pagos;
            const tablaConceptos = generarTablaConceptos(tDatosRecibo.rows, Number(idRecibo), gno_pagos);
            const datosDescuentos = await getDescuentos(idContrato, idRecibo, tipoPago);

            const intereses = datosCabecera.datosMovimientos.filter((r) => r.id_tipo_movimiento === 4 || r.id_tipo_movimiento === 9);
            sql = `select concat(nombre,' ',ap_paterno,' ',coalesce(ap_materno,'')) as nombre_cajero from cat_usuarios where id_usuario=${intereses[0].usuario}`;
            const cajero = await dbQuery(sql);
            if (tipoPago === "5") {
                prefolio = `Folio: ${datosCabecera.datosEmpresa[0].folio_notas_credito}-${idRecibo}`;
            } else {
                prefolio = `Folio: ${idRecibo}`;
            }

            let datosRetorno = {
                datosCabecera: datosCabecera,
                datosResumen: datosResumen,
                tablaConceptos: tablaConceptos,
                datosDescuentos: datosDescuentos,
                cajero: cajero.rows[0].nombre_cajero,
                prefolio: prefolio,
            };
            return datosRetorno;
        }
        return null;
    };

    const getDatosResumen = async () => {
        let sql = "";
        let resumen: any = {
            rMensualidades: [],
            rIntereses: [],
            rServicios: [],
        };

        sql = `select sum(monto) as monto,count(monto) as mensualidades,to_char(max(fecha_movimiento),'dd/MM/yy') as fec_fin
            ,to_char(min(fecha_movimiento),'dd/MM/yy') as fec_inicio from (
            select a.MONTo,b.FECHA_MOVIMIENTO
            from MOVIMIENTOS_DETALLE a
            inner join MOVIMIENTOS_DETALLE b on a.ID_CONTRATO=b.ID_CONTRATO and b.BND_ACTIVO=true and a.NO_PAGO=b.NO_PAGO and b.ID_TIPO_MOVIMIENTO=2
            where a.NO_RECIBO=${idRecibo} and a.id_contrato=${idContrato} and a.id_tipo_pago=${tipoPago} and a.ID_TIPO_MOVIMIENTO=3 
            and coalesce(a.bnd_contrato_cancelado,false)=false
            )aa`;

        const rMensualidades = await dbQuery(sql);

        if (rMensualidades.rows.length > 0 && rMensualidades.rows[0].mensualidades !== 0) {
            resumen.rMensualidades = rMensualidades.rows;
        }

        sql = `select sum(monto) as monto,count(monto) as mensualidades,to_char(max(fecha_movimiento),'dd/MM/yy') as fec_fin
                ,to_char(min(fecha_movimiento),'dd/MM/yy') as fec_inicio from (
                select a.MONTo,b.FECHA_MOVIMIENTO
                from MOVIMIENTOS_DETALLE a
                inner join MOVIMIENTOS_DETALLE b on a.ID_CONTRATO=b.ID_CONTRATO and b.BND_ACTIVO=true and a.NO_PAGO=b.NO_PAGO and b.ID_TIPO_MOVIMIENTO=2
                where a.NO_RECIBO=${idRecibo} and a.id_contrato=${idContrato} and a.id_tipo_pago=${tipoPago} and a.ID_TIPO_MOVIMIENTO=8
                and coalesce(a.bnd_contrato_cancelado,false)=false
                )aa`;

        const rIntereses = await dbQuery(sql);

        if (rIntereses.rows.length > 0 && rIntereses.rows[0].mensualidades !== 0) {
            resumen.rIntereses = rIntereses.rows;
        }
        sql = `select sum(monto) as monto,count(monto) as mensualidades,to_char(max(fecha_movimiento),'dd/MM/yy') as fec_fin
            ,to_char(min(fecha_movimiento),'dd/MM/yy') as fec_inicio from (
            select a.MONTo,b.FECHA_MOVIMIENTO
            from MOVIMIENTOS_DETALLE a
            inner join MOVIMIENTOS_DETALLE b on a.ID_CONTRATO=b.ID_CONTRATO and b.BND_ACTIVO=true and a.NO_PAGO=b.id_movimiento_detalle and b.ID_TIPO_MOVIMIENTO=10
            where a.NO_RECIBO=${idRecibo} and a.id_contrato=${idContrato} and a.id_tipo_pago=${tipoPago} and a.ID_TIPO_MOVIMIENTO=11
            and coalesce(a.bnd_contrato_cancelado,false)=false
            )aa`;
        const rServicios = await dbQuery(sql);

        if (rServicios.rows.length > 0 && rServicios.rows[0].mensualidades !== 0) {
            resumen.rServicios = rServicios.rows;
        }

        return resumen;
    };
    const getDescuentos = async (idContrato: any, idRecibo: any, idTipoPago: any) => {
        let descuentoInteres = null;
        let descuentoMensualidad = null;
        let pagoInicial = null;

        let sql = `select sum(coalesce(a.MONTO,0)) as interes,sum(coalesce(b.MONTO,0)) as descuento_interes
                from MOVIMIENTOS_DETALLE a
                inner join MOVIMIENTOS_DETALLE b on b.ID_CONTRATO=a.ID_CONTRATO and a.NO_PAGO=b.NO_PAGO and b.ID_TIPO_MOVIMIENTO=6
                where a.NO_RECIBO=${idRecibo} and a.id_contrato=${idContrato} and a.id_tipo_pago=${idTipoPago}
                and a.BND_ACTIVO=true and b.bnd_activo=true and coalesce(a.bnd_contrato_cancelado,false)=false
                and a.ID_TIPO_MOVIMIENTO in (8)`;
        descuentoInteres = await dbQuery(sql);

        sql = `select sum(coalesce(a.MONTO,0)) as mensualidad,sum(coalesce(b.MONTO,0)) as descuento_mensualidad
            from MOVIMIENTOS_DETALLE a
            inner join MOVIMIENTOS_DETALLE b on b.ID_CONTRATO=a.ID_CONTRATO and a.NO_PAGO=b.NO_PAGO and b.ID_TIPO_MOVIMIENTO=5
            where a.NO_RECIBO=${idRecibo} and a.id_contrato=${idContrato} and a.id_tipo_pago=${idTipoPago}
            and a.BND_ACTIVO=true and b.bnd_activo=true and coalesce(a.bnd_contrato_cancelado,false)=false
            and a.ID_TIPO_MOVIMIENTO in (3)`;
        descuentoMensualidad = await dbQuery(sql);

        sql = `select sum(coalesce(a.MONTO,0)) as mensualidad
            from MOVIMIENTOS_DETALLE a
            inner join MOVIMIENTOS_DETALLE b on b.ID_CONTRATO=a.ID_CONTRATO and b.ID_TIPO_MOVIMIENTO=1
            where a.NO_RECIBO=${idRecibo} and a.id_contrato=${idContrato} and a.id_tipo_pago=${idTipoPago} 
            and a.BND_ACTIVO=true and b.bnd_activo=true and coalesce(a.bnd_contrato_cancelado,false)=false
            and a.ID_TIPO_MOVIMIENTO in (12)`;
        pagoInicial = await dbQuery(sql);

        const datosDescuentos = {
            descuentoInteres: descuentoInteres.rows[0].interes,
            descuentoMensualidad: descuentoMensualidad.rows[0].mensualidad,
            pagoInicial: pagoInicial.rows[0].mensualidad,
        };
        return datosDescuentos;
    };

    //---
    datosRecibo = await getDatosRecibo();
    if (datosRecibo !== undefined || datosRecibo !== null) {
        return NextResponse.json(datosRecibo, { status: 200 }); //
    }

    return NextResponse.json("ERROR", { status: 500 });
}
