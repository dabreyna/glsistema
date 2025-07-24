import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const query = `select id_terreno,id_contrato from contratos_terrenos where id_contrato=${idContrato}`;
    if (idContrato) {
        const tempData = await dbQuery(query);
        return NextResponse.json(tempData.rows, { status: 200 });
    } else {
        return NextResponse.json("Error", { status: 400 });
    }
}
