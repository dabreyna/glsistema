import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    if (!idContrato) {
        return NextResponse.json({ error: 'El parámetro "idContrato" es requerido.' }, { status: 400 });
    }
    let query = `select id_terreno from contratos_terrenos where id_contrato=${idContrato}
             `;
    let tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
