import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const diasGracia = 9;

    const query = `SELECT sum(a.monto_saldo) as monto
                     FROM MOVIMIENTOS_DETALLE A
                    INNER JOIN CAT_TIPOS_MOVIMIENTO B ON A.ID_TIPO_MOVIMIENTO = B.ID_TIPO_MOVIMIENTO
                    WHERE A.ID_CONTRATO = ${idContrato}  
                    AND A.ID_TIPO_MOVIMIENTO in (1)
                    and a.bnd_activo=true
                    and a.bnd_contrato_cancelado = false
                    AND coalesce(BND_PAGADO,false) is not true;`;

    const tempData = await dbQuery(query);
    db.$disconnect();
    return NextResponse.json(tempData.rows[0].monto, { status: 200 });
}
