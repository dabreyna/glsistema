import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idEmpresa = searchParams.get("idEmpresa");

    let query = `SELECT ID_FRACCIONAMIENTO,FRACCIONAMIENTO FROM CAT_FRACCIONAMIENTOS WHERE BND_ACTIVO = TRUE AND ID_EMPRESA=${idEmpresa} ORDER BY FRACCIONAMIENTO ASC`;
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
