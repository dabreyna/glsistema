import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idFraccionamiento = searchParams.get("id");
    const query = `SELECT fraccionamiento FROM CAT_FRACCIONAMIENTOS WHERE BND_ACTIVO=TRUE AND ID_FRACCIONAMIENTO=${idFraccionamiento}`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
