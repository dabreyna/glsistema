import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idContrato = searchParams.get("idContrato");
    const fecha = searchParams.get("fecha");
    const diasGracia = 9;
    const tipoFiltro = Number(searchParams.get("tipo"));
    const where = tipoFiltro == 1 ? "" : tipoFiltro == 2 ? " where aa.movimiento='MENSUALIDAD'" : " where aa.movimiento='SERVICIO'";
    const query = `select aa.* from (
        SELECT NO_PAGO,to_char(fecha_movimiento,'dd/MM/yyyy') AS FECHA_MOVIMIENTO,B.MOVIMIENTO,a.MONTO_SALDO
                    ,case when extract(day from('${fecha}'::date - fecha_movimiento))<= ${diasGracia} then 0
                    else ((a.MONTO_SALDO*C.TASA_INTERES_DIARIO)/100)*(extract(day from('${fecha}'::date - fecha_movimiento)))-coalesce(DIAS_INTERES_PAGADOS,0) end as INTERES
                    ,a.id_tipo_movimiento as TIPO_MOVIMIENTO,(extract(day from('${fecha}'::date - fecha_movimiento))) AS DIAS_DE_VENCIMIENTO,a.ID_SERVICIO,a.id_carga,a.no_medidor
                     FROM MOVIMIENTOS_DETALLE A
                     INNER JOIN CAT_TIPOS_MOVIMIENTO B ON A.ID_TIPO_MOVIMIENTO = B.ID_TIPO_MOVIMIENTO
                     INNER JOIN MOVIMIENTOS_CABECERA C ON A.ID_MOVIMIENTO_CABECERA = C.ID_MOVIMIENTO_CABECERA
                     WHERE A.ID_CONTRATO =${idContrato}
                    AND A.ID_TIPO_MOVIMIENTO in (2,10)
                        and a.bnd_activo=true
                    AND coalesce(BND_PAGADO,false) <> true
                     AND FECHA_MOVIMIENTO <= '${fecha}'::date   -- - 0
                    union all
                    SELECT no_pago,to_char(fecha_movimiento,'dd/MM/yyyy') AS FECHA_MOVIMIENTO,B.MOVIMIENTO,a.monto_saldo
                    ,0 as interes,a.id_tipo_movimiento as tipo_movimiento,0 AS DIAS_DE_VENCIMIENTO,a.id_servicio,a.id_carga,a.no_medidor
                     FROM MOVIMIENTOS_DETALLE A
                    INNER JOIN CAT_TIPOS_MOVIMIENTO B ON A.ID_TIPO_MOVIMIENTO = B.ID_TIPO_MOVIMIENTO
                    WHERE A.ID_CONTRATO =${idContrato}
                    AND A.ID_TIPO_MOVIMIENTO in (1)
                    and a.bnd_activo=true
                    AND coalesce(BND_PAGADO,false) <> true)aa
                   ${where}
                   order by aa.fecha_movimiento asc,aa.no_pago asc
                   `;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
