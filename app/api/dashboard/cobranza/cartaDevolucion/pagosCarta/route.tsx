import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { id } from "date-fns/locale";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select concat(no_pago,'/',(select no_pagos from cobranza_cartas_devolucion where id_contrato=a.id_contrato)) as nopago_texto
                ,no_pago,to_char(fecha_pago,'dd/MM/yyyy') as fecha,monto,comentarios
                from cobranza_cartas_pagos a
                where id_contrato=${idContrato}`;
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
