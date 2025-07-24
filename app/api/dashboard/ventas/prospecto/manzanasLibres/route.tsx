import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

/*TODO:

*/
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idFraccionamiento = searchParams.get("idFraccionamiento");
    let query = `select b.id_manzana,b.no_manzana from cat_terrenos a
inner join cat_manzanas b on a.id_manzana =b.id_manzana
inner join cat_fraccionamientos c on b.id_fraccionamiento=c.id_fraccionamiento
where a.estatus=1 and c.id_fraccionamiento=${idFraccionamiento}
group by b.id_manzana,b.no_manzana
order by b.no_manzana asc`;
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
