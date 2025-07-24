import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select mensualidad_anterior,mensualidad_actual
                  from AJUSTE_ANUAL_DETALLE a
                  where ID_CONTRATO=${idContrato}
                  and ID_AJUSTE=(select max(ID_AJUSTE) from AJUSTE_ANUAL_DETALLE where ID_CONTRATO=a.ID_CONTRATO)`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
