import { NextRequest, NextResponse } from "next/server";
import dbQueryParams from "@/lib/dbQueryParams";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";
import moment from "moment";
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from "@react-pdf/renderer";
import { promises as fs } from "fs";
import path from "path";

const logoGL = path.join(process.cwd(), "public", "logo.png");

interface tPago {
    id_contrato: number;
    id_cabecera: number;
    monto_cobrar: number;
    monto_total: number;
    terreno: string;
    manzana: string;
    fraccionamiento: string;
    moneda: string;
    dinteres: number;
    dmensualidad: number;
    justificacion_descuento: string;
    tipo_pago: number;
    referencia: string;
    pagoPesos: number;
    pagoDolares: number;
    pagoCheque: number;
    pago_inicial: number;
}

interface tPagos {
    tPagos: tPago[];
    soloServicios: boolean;
    fecha_pago: string;
    tipoCambio: number;
    gcompromiso_pago: number;
    justificacionNota: string;
    id_usuario: string;
    nombre_usuario: string;
}
interface ReceiptData {
    idContrato: number;
    idRecibo: number;
    data_recibo: tPago;
}

async function obtenFolio(id_contrato: number, id_tipo_pago: number) {
    let folio: string = "";
    const query = `select e.folio_recibo,e.folio_notas_credito
                from CONTRATOS_TERRENOS a
                inner join CAT_TERRENOS b on a.ID_TERRENO = b.ID_TERRENO
                inner join CAT_MANZANAS c on c.ID_MANZANA = b.ID_MANZANA
                inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO = c.ID_FRACCIONAMIENTO
                inner join CAT_EMPRESAS e on e.ID_EMPRESA = d.id_EMPRESA
                where ID_CONTRATO = ${id_contrato}`;
    const result = await dbQuery(query);

    if (id_tipo_pago === 5) {
        folio = `NOTA_${result.rows[0].folio_notas_credito}`;
    } else {
        folio = `RECIBO_${result.rows[0].folio_recibo}`;
    }
    db.$disconnect();
    return folio;
}
async function cobraServicio(
    fecha_actual: string,
    monto_cobrar: number,
    id_recibo: number,
    usuario: string,
    id_tipo_pago: number,
    id_cabecera: number,
    id_contrato: number
) {
    let bnd = false;
    const query = `select monto_saldo,id_movimiento_detalle from movimientos_detalle where id_contrato=${id_contrato}
    and bnd_activo=true and id_tipo_movimiento=10 and coalesce(bnd_pagado,false)=false and bnd_contrato_cancelado=false order by fecha_movimiento`;
    const result = await dbQuery(query);
    try {
        for (let y = 0; y < result.rows.length; y++) {
            if (parseFloat(monto_cobrar.toFixed(2)) >= parseFloat(result.rows[y].monto_saldo)) {
                const query2 = `update movimientos_detalle set bnd_pagado=true,monto_saldo=0,no_recibo=${id_recibo} where id_movimiento_detalle=${result.rows[y].id_movimiento_detalle}`;
                await dbQuery(query2);
                const query3 = `insert into movimientos_detalle(id_movimiento_cabecera,id_tipo_movimiento,monto
                              ,fecha_movimiento,bnd_activo,usuario,id_contrato,no_recibo,no_pago,id_tipo_pago) values(${id_cabecera},11,${result.rows[y].monto_saldo},now(),true
                              ,${usuario},${id_contrato},${id_recibo},${result.rows[y].id_movimiento_detalle},${id_tipo_pago})`;
                await dbQuery(query3);
                monto_cobrar = monto_cobrar - result.rows[y].monto_saldo;
                bnd = true;
                if (monto_cobrar === 0) {
                    break;
                }
            } else {
                if (parseFloat(monto_cobrar.toFixed(2)) > 0) {
                    let saldo = parseFloat(result.rows[y].monto_saldo);
                    let total_servicio = saldo - monto_cobrar;
                    const query2 = `update movimientos_detalle set monto_saldo=${total_servicio} where id_movimiento_detalle=${result.rows[y].id_movimiento_detalle}`;
                    await dbQuery(query2);
                    const query3 = `insert into movimientos_detalle(id_movimiento_cabecera,id_tipo_movimiento,monto
                                ,fecha_movimiento,bnd_activo,usuario,id_contrato,no_recibo,no_pago,id_tipo_pago) values
                                (${id_cabecera},11,${monto_cobrar},now(),true,${usuario},${id_contrato},${id_recibo},${result.rows[y].id_movimiento_detalle},${id_tipo_pago})`;
                    await dbQuery(query3);
                    monto_cobrar = 0;
                    bnd = true;
                    break;
                }
            }
        }
    } catch (error) {
        console.error(error);
        bnd = false;
    }
    return bnd;
}

async function InsertaPagosMensuales(
    id_contrato: number,
    fecha_pago: string,
    monto_cobrar: number, //VIENE DE monto_total
    usuario: string,
    id_cabecera: number,
    dias_gracia: number,
    id_recibo: number,
    descuento_interes: number,
    descuento_mensualidad: number,
    justificacion_descuento: string | null,
    id_tipo_pago: number,
    referencia: string | null,
    gpago_inicial: number,
    gultimas_mensualidades: boolean
) {
    const datosrecibidos = {
        id_contrato: id_contrato,
        fecha_pago: fecha_pago,
        monto_cobrar: monto_cobrar,
        usuario: usuario,
        id_cabecera: id_cabecera,
        dias_gracia: dias_gracia,
        id_recibo: id_recibo,
        descuento_interes: descuento_interes,
        descuento_mensualidad: descuento_mensualidad,
        justificacion_descuento: justificacion_descuento,
        id_tipo_pago: id_tipo_pago,
        referencia: referencia,
        gpago_inicial: gpago_inicial,
        gultimas_mensualidades: gultimas_mensualidades,
    };
    let bnd = false;
    let bnd_break = false;
    let _referencia = referencia;
    let order = "";
    let query = ``;

    if (gpago_inicial > 0) {
        try {
            let pini = 0;
            let pini_saldo = 0;
            let pini_pagado = false;

            if (monto_cobrar >= gpago_inicial) {
                pini = gpago_inicial;
                monto_cobrar = monto_cobrar - gpago_inicial;
                pini_saldo = 0;
                pini_pagado = true;
            } else {
                pini = monto_cobrar;
                monto_cobrar = -1;
                pini_pagado = false;
                pini_saldo = gpago_inicial - pini;
            }

            const query = `insert into movimientos_detalle(id_movimiento_cabecera,id_tipo_movimiento,monto,
            fecha_movimiento,bnd_activo,usuario,bnd_pagado,no_recibo,monto_saldo,id_tipo_pago,id_contrato) values(
            ${id_cabecera},12,${pini},now(),true,${usuario},${pini_pagado},${id_recibo},${pini_saldo},${id_tipo_pago},${id_contrato})`;
            await dbQuery(query);
            const query2 = `update movimientos_detalle set bnd_pagado=${pini_pagado},monto_saldo=${pini_saldo} where id_contrato=${id_contrato} and id_tipo_movimiento=1`;
            await dbQuery(query2);
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    if (gultimas_mensualidades) {
        order = ` desc`;
    }

    query = `select b.monto_saldo,b.id_movimiento_detalle
            from MOVIMIENTOS_DETALLE a
            inner join MOVIMIENTOS_DETALLE b on a.ID_CONTRATO=b.ID_CONTRATO and b.ID_TIPO_MOVIMIENTO=10 and b.BND_ACTIVO=true 
			AND b.FECHA_MOVIMIENTO >= DATE_TRUNC('month', a.FECHA_MOVIMIENTO)
			AND b.FECHA_MOVIMIENTO < (DATE_TRUNC('month', a.FECHA_MOVIMIENTO) + INTERVAL '1 month')
            and coalesce(b.BND_PAGADO,false)=false
            where a.ID_CONTRATO=${id_contrato} and a.id_tipo_movimiento=2
            and a.bnd_pagado=true
            and a.bnd_activo=true`;

    let tServiciosAnteriores = (await dbQuery(query)).rows;
    for (let y = 0; y < tServiciosAnteriores.length; y++) {
        if (monto_cobrar >= parseFloat(tServiciosAnteriores[y].monto_saldo)) {
            query = `update movimientos_detalle set bnd_pagado=true,monto_saldo=0,no_recibo=${id_recibo} where id_movimiento_detalle=${tServiciosAnteriores[y].id_movimiento_detalle}`;
            await dbQuery(query);
            query = `insert into movimientos_detalle(id_movimiento_cabecera,id_tipo_movimiento,monto
                ,fecha_movimiento,bnd_activo,usuario,id_contrato,no_recibo,no_pago,id_tipo_pago) values(
                ${id_cabecera},11,${tServiciosAnteriores[y].monto_saldo},now(),true,${usuario},${id_contrato},${id_recibo},${tServiciosAnteriores[y].id_movimiento_detalle},${id_tipo_pago})`;
            await dbQuery(query);
            monto_cobrar = monto_cobrar - parseFloat(tServiciosAnteriores[y].monto_saldo.toFixed(2));
            if (monto_cobrar === 0) {
                bnd_break = true;
            }
        } else {
            if (monto_cobrar > 0) {
                let saldo = parseFloat(tServiciosAnteriores[y].monto_saldo.toFixed(2));
                let total_servicio = parseFloat(saldo.toFixed(2)) - parseFloat(monto_cobrar.toFixed(2));
                query = `update movimientos_detalle set monto_saldo=${total_servicio} where id_movimiento_detalle=${tServiciosAnteriores[y].id_movimiento_detalle}`;
                await dbQuery(query);
                query = `insert into movimientos_detalle(id_movimiento_cabecera,id_tipo_movimiento,monto
                    ,fecha_movimiento,bnd_activo,usuario,id_contrato,no_recibo,no_pago,id_tipo_pago) values
                    (${id_cabecera},11,${monto_cobrar},now(),true,${usuario},${id_contrato},${id_recibo},${tServiciosAnteriores[y].id_movimiento_detalle},${id_tipo_pago})`;
                await dbQuery(query);
                monto_cobrar = 0;
                bnd_break = true;
            }
        }
    }
    query = `select a.id_movimiento_detalle,a.monto_saldo,a.no_pago,a.monto,
                case when FECHA_MOVIMIENTO <= ('${fecha_pago}'::date - INTERVAL '${dias_gracia} days') 
                then cast(((a.MONTO_SALDO*b.TASA_INTERES_DIARIO)/100)*(EXTRACT(DAY FROM ('${fecha_pago}'::date - a.FECHA_MOVIMIENTO))-coalesce(a.DIAS_INTERES_PAGADOS,0)) as numeric(19,2))
                else 0
                end as interes,
                extract(day from ('${fecha_pago}'::date - a.FECHA_MOVIMIENTO)) as DIAS_DE_VENCIMIENTO,
                --to_char(a.fecha_movimiento,'dd/MM/yyyy') as fecha_movimiento,
                to_char(a.fecha_movimiento,'YYYY-MM-DD') as fecha_movimiento,
                fecha_movimiento as fecha_movimiento_date
                from movimientos_detalle a
                inner join movimientos_cabecera b on a.id_movimiento_cabecera=b.id_movimiento_cabecera
                where a.id_contrato=${id_contrato}
                and a.bnd_activo=true
                and coalesce(a.bnd_pagado,false)=false
                and a.id_movimiento_cabecera=${id_cabecera}
                and a.id_tipo_movimiento=2
                order by no_pago ${order}`;
    try {
        const tMensualidades = (await dbQuery(query)).rows;

        let ffecha_pago = moment(fecha_pago, "YYYY-MM-DD");

        for (let x = 0; x < tMensualidades.length; x++) {
            if (monto_cobrar <= 0) {
                break;
            }
            let ffecha_movimiento = moment(tMensualidades[x].fecha_movimiento, "YYYY-MM-DD");
            if (parseFloat(tMensualidades[x].interes) > 0) {
                let intereses: number = parseFloat(tMensualidades[x].interes);
                let monto_descuento_interes: number = 0;
                let dias_vencimiento: number = 0;
                let saldo_interes: number = 0;
                if (monto_cobrar >= intereses) {
                    monto_cobrar = monto_cobrar - intereses;
                    monto_descuento_interes = (intereses * descuento_interes) / 100;
                    dias_vencimiento = parseFloat(tMensualidades[x].dias_de_vencimiento);
                    if (monto_cobrar == 0) {
                        bnd_break = true;
                    }
                } else {
                    intereses = monto_cobrar;
                    monto_descuento_interes = (intereses * descuento_interes) / 100;
                    dias_vencimiento =
                        (parseFloat(tMensualidades[x].dias_de_vencimiento) * monto_cobrar) / parseFloat(tMensualidades[x].interes);
                    monto_cobrar = 0;
                    bnd_break = true;
                }
                query = `insert into movimientos_detalle( id_movimiento_cabecera, no_pago, id_tipo_movimiento, monto, fecha_movimiento, bnd_activo
                      ,usuario,id_contrato,bnd_pagado,no_recibo,monto_saldo,dias_interes_pagados,id_tipo_pago) values(
                      ${id_cabecera},${tMensualidades[x].no_pago},8,${intereses},now(),true,${usuario},${id_contrato},true,${id_recibo},${saldo_interes},${dias_vencimiento},${id_tipo_pago})`;
                await dbQuery(query);
                query = `update movimientos_detalle set dias_interes_pagados=${dias_vencimiento} where id_movimiento_detalle=${tMensualidades[x].id_movimiento_detalle}`;
                await dbQuery(query);

                if (descuento_interes > 0) {
                    query = `insert into movimientos_detalle(id_movimiento_cabecera, id_tipo_movimiento, monto, fecha_movimiento, bnd_activo
                    ,usuario,id_contrato,bnd_pagado,no_recibo,no_pago,justificacion_descuento,id_tipo_pago) values(
                    ${id_cabecera},6,${monto_descuento_interes},now(),true,${usuario},${id_contrato},true,${id_recibo},${tMensualidades[x].no_pago},'${justificacion_descuento}'
                    ,${id_tipo_pago})`;
                    await dbQuery(query);
                }
                if (bnd_break) {
                    break;
                }
            }
            query = `select monto_saldo,id_movimiento_detalle from movimientos_detalle where id_contrato=${id_contrato} and id_tipo_movimiento=10 and bnd_activo=true 
            and coalesce(bnd_pagado,false)=false and fecha_movimiento <= '${tMensualidades[x].fecha_movimiento}'::date`;
            const tServicios = (await dbQuery(query)).rows;
            for (let y = 0; y < tServicios.length; y++) {
                if (parseFloat(monto_cobrar.toFixed(2)) >= parseFloat(tServicios[y].monto_saldo)) {
                    query = `update movimientos_detalle set bnd_pagado=true,monto_saldo=0,no_recibo=${id_recibo} where id_movimiento_detalle=${tServicios[y].id_movimiento_detalle}`;
                    await dbQuery(query);

                    query = `insert into movimientos_detalle(id_movimiento_cabecera,id_tipo_movimiento,monto
                    ,fecha_movimiento,bnd_activo,usuario,id_contrato,no_recibo,no_pago,id_tipo_pago) values(
                    ${id_cabecera},11,${tServicios[y].monto_saldo},now(),true,${usuario},${id_contrato},${id_recibo},${tServicios[y].id_movimiento_detalle},${id_tipo_pago})`;
                    await dbQuery(query);
                    monto_cobrar = monto_cobrar - tServicios[y].monto_saldo;
                    if (monto_cobrar === 0) {
                        break;
                    }
                } else {
                    if (parseFloat(monto_cobrar.toFixed(2)) > 0) {
                        let saldo = parseFloat(tServicios[y].monto_saldo);
                        let total_servicio = saldo - monto_cobrar;
                        query = `update movimientos_detalle set monto_saldo=${total_servicio} where id_movimiento_detalle=${tServicios[y].id_movimiento_detalle}`;
                        await dbQuery(query);

                        query = `insert into movimientos_detalle(id_movimiento_cabecera,id_tipo_movimiento,monto
                        ,fecha_movimiento,bnd_activo,usuario,id_contrato,no_recibo,no_pago,id_tipo_pago) values(
                        ${id_cabecera},11,${monto_cobrar},now(),true,${usuario},${id_contrato},${id_recibo},${tServicios[y].id_movimiento_detalle},${id_tipo_pago})`;
                        await dbQuery(query);
                        monto_cobrar = 0;
                        bnd_break = true;
                    }
                }
            }
            let mensualidad: number = parseFloat(tMensualidades[x].monto_saldo);

            let bnd_toca_descuento =
                parseFloat(tMensualidades[x].monto_saldo) >= parseFloat(tMensualidades[x].monto) && monto_cobrar >= mensualidad
                    ? true
                    : false;

            let saldo_mensualidad: number = 0;
            let monto_descuento_mensualidad: number = 0;
            let pagado = false;
            if (monto_cobrar >= mensualidad) {
                monto_cobrar = monto_cobrar - mensualidad;
                monto_descuento_mensualidad = (mensualidad * descuento_mensualidad) / 100;
                pagado = true;
                if (monto_cobrar === 0) {
                    bnd_break = true;
                }
            } else {
                saldo_mensualidad = mensualidad - monto_cobrar;
                mensualidad = monto_cobrar;
                monto_descuento_mensualidad = (mensualidad * descuento_mensualidad) / 100;
                monto_cobrar = 0;
                bnd_break = true;
            }
            query = `insert into movimientos_detalle(id_movimiento_cabecera, no_pago, id_tipo_movimiento, monto, fecha_movimiento, bnd_activo
                    ,usuario,id_contrato,bnd_pagado,no_recibo,id_tipo_pago,referencia) values(
                    ${id_cabecera},${tMensualidades[x].no_pago},3,${mensualidad},now(),true,${usuario},${id_contrato},true,${id_recibo},${id_tipo_pago},'${_referencia}')`;
            await dbQuery(query);
            query = `update movimientos_detalle set bnd_pagado=${pagado},monto_saldo=${saldo_mensualidad} where id_movimiento_detalle=${tMensualidades[x].id_movimiento_detalle}`;
            await dbQuery(query);
            query = `update movimientos_cabecera set saldo=saldo-${mensualidad} where id_movimiento_cabecera=${id_cabecera}`;
            await dbQuery(query);

            if (pagado === true) {
                query = `update comisiones set bnd_mensualidad_pagada=true where id_contrato=${id_contrato} and no_comision=${tMensualidades[x].no_pago}`;
                await dbQuery(query);
            }

            let ffecha_pago = moment(fecha_pago, "YYYY-MM-DD");

            if (descuento_mensualidad > 0 && ffecha_movimiento.isSameOrAfter(ffecha_pago.add(30, "days")) && bnd_toca_descuento) {
                query = `insert into movimientos_detalle(id_movimiento_cabecera, id_tipo_movimiento, monto, fecha_movimiento, bnd_activo
                        ,usuario,id_contrato,bnd_pagado,no_recibo,justificacion_descuento,no_pago,id_tipo_pago) values(
                        ${id_cabecera},5,${monto_descuento_mensualidad},now(),true,${usuario},${id_contrato},true,${id_recibo},'${justificacion_descuento}'
                        ,${tMensualidades[x].no_pago},${id_tipo_pago})`;
                await dbQuery(query);
            }
            if (bnd_break) {
                break;
            }
        }
        bnd = true;
    } catch (error) {
        console.error(error);
        bnd = false;
    }
    return bnd;
}

async function actualizaSaldoRecibo(id_cabecera: number, id_recibo: number) {
    let bnd = false;

    let query = `update MOVIMIENTOS_DETALLE set saldo_recibo =(
    select saldo from movimientos_cabecera where id_movimiento_cabecera= movimientos_detalle.id_movimiento_cabecera)
    where ID_TIPO_MOVIMIENTO = 4
    and ID_MOVIMIENTO_CABECERA = ${id_cabecera}
    and NO_RECIBO=${id_recibo}
    and bnd_activo=true`;

    try {
        await dbQuery(query);
        bnd = true;
    } catch (error) {
        console.error(error);
        await dbQuery("ROLLBACK;");
        bnd = false;
    }
    return bnd;
}
async function actualizaContratoPostVenta(id_contrato: number) {
    let bnd = false;

    return bnd;
}
function numeroAleatorio() {
    const base = 50000;
    let num = base + Math.floor(Math.random() * 10000);
    return num;
}

export async function POST(request: NextRequest) {
    let dias_gracia = 9;
    let recibos: any = [];
    let reciboFinal: any = [];
    try {
        await dbQuery("BEGIN;");
        const data: tPagos = await request.json();
        let bnd_error = false;
        let pago_inicial = 0;

        for (let x = 0; x < data.tPagos.length; x++) {
            let gid_recibo = 0;
            let fecha_actual = data.fecha_pago;
            let monto_total = data.tPagos[x].monto_total;
            let id_contrato = data.tPagos[x].id_contrato;
            let gpago_inicial = data.tPagos[x].pago_inicial;
            let gultimas_mensualidades = false; // TODO: REVISAR SI SE SEGUIRAN USANDO ULTIMAS MENSUALIDADES
            let tipo_cambio = data.tipoCambio;

            const inserta_pago_general = async () => {
                let bnd = false;
                const folio = await obtenFolio(Number(data.tPagos[x].id_contrato), Number(data.tPagos[x].tipo_pago));
                const id_recibo = numeroAleatorio();
                gid_recibo = id_recibo;

                const query = `select id_estatus_contrato from contratos_terrenos where id_contrato=${data.tPagos[x].id_contrato}`;
                let id_estatus_contrato = (await dbQuery(query)).rows[0].id_estatus_contrato;
                let usuario = data.id_usuario;
                let id_tipo_pago = data.tPagos[x].tipo_pago;
                let id_cabecera = data.tPagos[x].id_cabecera;
                let pagoDolares = data.tPagos[x].pagoDolares === 0 ? 0 : data.tPagos[x].pagoDolares;
                let pagoPesos = data.tPagos[x].pagoPesos === 0 ? 0 : data.tPagos[x].pagoPesos;
                let pagoCheque = data.tPagos[x].pagoCheque === 0 ? 0 : data.tPagos[x].pagoCheque;
                let descuento_interes = data.tPagos[x].dinteres === 0 ? 0 : data.tPagos[x].dinteres;
                let descuento_mensualidad = data.tPagos[x].dmensualidad === 0 ? 0 : data.tPagos[x].dmensualidad;
                let justificacion_descuento = data.tPagos[x].justificacion_descuento === "" ? null : data.tPagos[x].justificacion_descuento;
                let referencia = data.tPagos[x].referencia === "" ? null : data.tPagos[x].referencia;

                const query2 = `insert into movimientos_detalle 
                (id_movimiento_cabecera,id_tipo_movimiento,monto,fecha_movimiento,usuario,id_contrato,no_recibo,bnd_activo,tipo_cambio,descuento_mensualidad,descuento_interes,monto_efectivo,
                monto_dlls,referencia,id_tipo_pago,monto_cheque) values (
                ${id_cabecera},4,${monto_total},now(),${usuario},${id_contrato},${id_recibo},true,${tipo_cambio},${descuento_mensualidad},
                ${descuento_interes},${pagoPesos},${pagoDolares},'${referencia}',${id_tipo_pago},${pagoCheque}) returning id_movimiento_detalle`;
                try {
                    const result = await dbQuery(query2);
                    if (data.soloServicios === true) {
                        bnd = await cobraServicio(fecha_actual, monto_total, id_recibo, usuario, id_tipo_pago, id_cabecera, id_contrato);
                    } else if (id_estatus_contrato !== 5) {
                        bnd = await InsertaPagosMensuales(
                            id_contrato,
                            fecha_actual,
                            monto_total,
                            usuario,
                            id_cabecera,
                            dias_gracia,
                            id_recibo,
                            descuento_interes,
                            descuento_mensualidad,
                            justificacion_descuento,
                            id_tipo_pago,
                            referencia,
                            gpago_inicial,
                            gultimas_mensualidades
                        );
                        if (!bnd) {
                            return bnd;
                        }
                        bnd = await actualizaSaldoRecibo(id_cabecera, id_recibo);
                        if (!bnd) {
                            return bnd;
                        }
                        const reciboPagado = { idRecibo: gid_recibo, idContrato: id_contrato, data_recibo: data.tPagos[0] };
                        recibos.push(reciboPagado);

                        bnd = await actualizaContratoPostVenta(id_contrato);
                        if (!bnd) {
                            return bnd;
                        }
                    } else {
                        bnd = await cobraServicio(fecha_actual, monto_total, id_recibo, usuario, id_tipo_pago, id_cabecera, id_contrato);
                        const reciboPagado = { id_recibo: gid_recibo, id_contrato: id_contrato, data_recibo: data.tPagos[0] };
                        recibos.push(reciboPagado);
                    }
                } catch (error) {
                    console.error(error);
                    bnd = false;
                }

                return bnd;
            };

            let pago_general = await inserta_pago_general();
            let compromiso_pago = true;
            let justificacion_nota = true;
        }
    } catch (error) {
        await dbQuery("ROLLBACK;");
        console.error("Error en la API:", error);
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    }
    if (recibos.length > 0) {
        await dbQuery("COMMIT;");
        return NextResponse.json(recibos, { status: 200 });
    }
    return NextResponse.json(recibos, { status: 200 });
}
