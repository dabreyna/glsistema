import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const dias_gracia = 9;

    const query = `select *,monto_vencido+interes as saldo_total
                  ,extract (day from (select now()-fecha_movimiento from MOVIMIENTOS_DETALLE 
                    where ID_TIPO_MOVIMIENTO in (2)
                    and ID_CONTRATO=${idContrato} 
                    and bnd_pagado=false
                    and fecha_movimiento<= (now()- interval '${dias_gracia} days') 
                    order by fecha_movimiento asc limit 1)) as dias_vencimiento
                  from (select count(*) as mensualidades,coalesce(sum(MONTO_SALDO),0) as monto_vencido
                  ,coalesce(sum(interes),0) as interes
                  from (
                  SELECT no_pago,to_char(fecha_movimiento,'dd/MM/yyyy') AS FECHA_MOVIMIENTO,B.MOVIMIENTO,a.monto_saldo
                  ,((a.MONTO_SALDO*C.TASA_INTERES_DIARIO)/100)*(extract(day from now()-fecha_movimiento) -coalesce(DIAS_INTERES_PAGADOS,0)) as interes
                  ,a.id_tipo_movimiento as tipo_movimiento

                  FROM movimientos_detalle A
                  INNER JOIN CAT_TIPOS_MOVIMIENTO B ON A.ID_TIPO_MOVIMIENTO = B.ID_TIPO_MOVIMIENTO
                  INNER JOIN MOVIMIENTOS_CABECERA C ON A.ID_MOVIMIENTO_CABECERA = C.ID_MOVIMIENTO_CABECERA
                  WHERE A.ID_CONTRATO = ${idContrato}
                  and a.bnd_contrato_cancelado=false
                  AND A.ID_TIPO_MOVIMIENTO in (2)
                  and a.bnd_activo=true
                  AND coalesce(BND_PAGADO,false) <> true
                  AND FECHA_MOVIMIENTO <= (now() - interval '${dias_gracia} days'))
                  )`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
