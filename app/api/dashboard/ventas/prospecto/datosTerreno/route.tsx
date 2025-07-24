import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idTerreno = searchParams.get("id");
    const query = `select a.no_terreno,b.no_manzana,c.fraccionamiento,a.superficie from cat_terrenos a
                  inner join cat_manzanas b on a.id_manzana =b.id_manzana
                  inner join cat_fraccionamientos c on b.id_fraccionamiento=c.id_fraccionamiento
                  where a.id_terreno=${idTerreno};`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
