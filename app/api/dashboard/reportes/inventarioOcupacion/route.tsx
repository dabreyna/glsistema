import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");

    let where = " ";
    if (idManzana != "" && idManzana != "0") {
        where += ` and d.id_manzana=${idManzana}`;
    }
    if (idTerreno != "" && idTerreno != "0") {
        where += ` and a.id_terreno=${idTerreno}`;
    }

    let query = `SELECT A.NO_TERRENO,E.NOMENCLATURA,D.NO_MANZANA,A.SUPERFICIE,A.PRECIO_M2,PRECIO_FINANCIAR
                ,CONCAT(C.NOMBRE,' ',C.AP_PATERNO,' ',COALESCE(C.AP_MATERNO,'')) AS NOMBRE_CLIENTE,C.ID_CLIENTE,B.ID_CONTRATO
                ,E.FRACCIONAMIENTO
                FROM CAT_TERRENOS A
                LEFT JOIN CONTRATOS_TERRENOS B ON B.ID_TERRENO=A.ID_TERRENO AND ID_ESTATUS_CONTRATO IN (1,4,5)
                LEFT JOIN CLIENTES C ON C.ID_CLIENTE=B.ID_CLIENTE
                INNER JOIN CAT_MANZANAS D ON D.ID_MANZANA=A.ID_MANZANA
                INNER JOIN CAT_FRACCIONAMIENTOS E ON E.ID_FRACCIONAMIENTO=D.ID_FRACCIONAMIENTO
                WHERE A.BND_ACTIVO=TRUE 
                 and e.id_fraccionamiento=${idFraccionamiento}
                ${where}  
                ORDER BY E.NOMENCLATURA,D.NO_MANZANA,A.NO_TERRENO
               `;

    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "no_manzana");
    const formattedData = Object.keys(groupedData).map((manzana) => ({
        manzana,
        terrenos: groupedData[manzana],
    }));

    return NextResponse.json(formattedData, { status: 200 });
}
