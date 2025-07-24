import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { id } from "date-fns/locale";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select coalesce(notas1,'N/A') as notas1,coalesce(notas2,'N/A') as notas2 from COBRANZA_CARTAS_DEVOLUCION where id_contrato=${idContrato}`;
    const tempData = await dbQuery(query);

    console.log(tempData.rows);
    return NextResponse.json(tempData.rows, { status: 200 });
}
