import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");

    let where = "";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and c.id_fraccionamiento=${idFraccionamiento}`;
    }

    let query = `SELECT row_number() over() as consecutivo,CASE WHEN A.ESTATUS=4 THEN CONCAT('* ' ,C.NOMENCLATURA) ELSE C.NOMENCLATURA END AS NOMENCLATURA
              ,C.FRACCIONAMIENTO,B.NO_MANZANA,A.NO_TERRENO,A.SUPERFICIE,A.PRECIO_M2,A.TOTAL_TERRENO AS TOTAL_TERRENO,COALESCE(A.DEPOSITO,0) AS DEPOSITO
              ,A.ESTATUS,(A.SUPERFICIE*A.PRECIO_M2) AS VALOR_TOTAL,a.id_terreno
              FROM CAT_TERRENOS A
              INNER JOIN CAT_MANZANAS B ON B.ID_MANZANA = A.ID_MANZANA
              INNER JOIN CAT_FRACCIONAMIENTOS C ON C.ID_FRACCIONAMIENTO = B.ID_FRACCIONAMIENTO
              WHERE 1=1
              AND A.BND_ACTIVO = TRUE
                ${where}  
              ORDER BY FRACCIONAMIENTO,NO_MANZANA,NO_TERRENO`;

    if (idFraccionamiento === "0" || idFraccionamiento === "") {
        query = `SELECT 'POR FAVOR SELECCIONA UN FRACCIONAMIENTO'`;
        const tempData = await dbQuery(query);
        return NextResponse.json(tempData.rows, { status: 200 });
    }

    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "no_manzana");

    const formattedData = Object.keys(groupedData).map((manzana) => ({
        manzana,
        terrenos: groupedData[manzana],
    }));

    return NextResponse.json(formattedData, { status: 200 });
}
