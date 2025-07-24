import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select to_char(fecha_compromiso,'dd/MM/yyyy HH:mm:ss') as fecha_compromiso,monto,case when coalesce(bnd_pagado,false)=true then 'PAGADO' ELSE 'PENDIENTE' END AS pagado
                  ,to_char(fecha_pago,'dd/MM/yyyy') as fecha_pago,no_recibo,comentarios,case when bnd_activo=true then 'ACTIVO' ELSE 'CANCELADO' END as estatus
                  ,bnd_activo
                  from cobranza_compromisos_pago
                  where id_contrato=${idContrato} order by fecha_movimiento desc`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
