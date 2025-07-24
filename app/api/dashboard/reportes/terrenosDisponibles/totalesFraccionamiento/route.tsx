import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idFraccionamiento = searchParams.get("idFraccionamiento");

    let query = `SELECT SUM(SUPERFICIE) AS TOTAL_SUPERFICIE,SUM(TOTAL_TERRENO) AS TOTAL_VALOR
               FROM CAT_TERRENOS A
               INNER JOIN CAT_MANZANAS B ON A.ID_MANZANA = B.ID_MANZANA
               INNER JOIN CAT_FRACCIONAMIENTOS C ON B.ID_FRACCIONAMIENTO = C.ID_FRACCIONAMIENTO
               WHERE
	                C.ID_FRACCIONAMIENTO = ${idFraccionamiento}
	                AND A.ESTATUS = 1
                    AND A.BND_ACTIVO = TRUE
             `;
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
