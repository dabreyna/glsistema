import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idCliente = searchParams.get("idCliente");
    const query = `SELECT * FROM CLIENTES WHERE ID_CLIENTE=${idCliente};`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
