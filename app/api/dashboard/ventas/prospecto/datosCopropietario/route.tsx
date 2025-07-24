import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const query = `SELECT * FROM COPROPIETARIOS WHERE ID_CONTRATO=${idContrato} AND BND_ACTIVO=true ORDER BY FECHA_ALTA ASC LIMIT 1;`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
