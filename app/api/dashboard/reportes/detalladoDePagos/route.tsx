import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();

    let where = " ";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and d.id_fraccionamiento=${idFraccionamiento}`;
    }

    if (idManzana != "" && idManzana != "0") {
        where += ` and c.id_manzana=${idManzana}`;
    }
    if (idTerreno != "" && idTerreno != "0") {
        where += ` and b.id_terreno=${idTerreno}`;
    }

    if (nombreCliente) {
        const words = nombreCliente.split(" ");
        // let whereClause = '';

        words.forEach((word) => {
            where += ` AND CONCAT(e.NOMBRE,' ',e.AP_PATERNO,' ',COALESCE(e.AP_MATERNO, '')) ILIKE '%${word}%'`;
        });

        console.log(where);
    }

    let query = `SELECT CONCAT(E.NOMBRE,' ',E.AP_PATERNO,' ',COALESCE(E.AP_MATERNO,'')) AS NOMBRE_CLIENTE
                ,D.NOMENCLATURA,C.NO_MANZANA,B.NO_TERRENO,A.ID_CONTRATO
                FROM CONTRATOS_TERRENOS A
                INNER JOIN CAT_TERRENOS B ON B.ID_TERRENO=A.ID_TERRENO
                INNER JOIN CAT_MANZANAS C ON C.ID_MANZANA=B.ID_MANZANA
                INNER JOIN CAT_FRACCIONAMIENTOS D ON D.ID_FRACCIONAMIENTO=C.ID_FRACCIONAMIENTO
                INNER JOIN CLIENTES E ON E.ID_CLIENTE=A.ID_CLIENTE
                WHERE A.ID_ESTATUS_CONTRATO IN (1,4,5) 
                ${where}  
                ORDER BY NOMBRE_CLIENTE ASC
               `;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
