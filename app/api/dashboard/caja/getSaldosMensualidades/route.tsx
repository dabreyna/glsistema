import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `SELECT monto_saldo as monto
                    FROM MOVIMIENTOS_DETALLE A
                    WHERE ID_CONTRATO = ${idContrato}
                    AND ID_TIPO_MOVIMIENTO = 2
                    AND coalesce(BND_PAGADO,false)is not true and a.bnd_activo=true
                    order by NO_PAGO`;

    const tempData = await dbQuery(query);
    db.$disconnect();
    return NextResponse.json(tempData.rows, { status: 200 });
}
