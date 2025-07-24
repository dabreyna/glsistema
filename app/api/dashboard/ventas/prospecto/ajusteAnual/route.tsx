import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idTerreno = searchParams.get("id");
    const query = `select bnd_ajuste_anual,porcentaje_ajuste_anual from cat_financiamientos where id_financiamiento=${idTerreno};`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
