import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    let query = `SELECT 
                    A.FECHA_CONTRATO,CONCAT(D.FRACCIONAMIENTO,'-',C.NO_MANZANA,'-',B.NO_TERRENO) AS TERRENO,
                    SUBSTRING(D.NOMENCLATURA,1,3) AS NOMENCLATURA,CONCAT(E.NOMBRE,' ',E.AP_PATERNO) AS VENDEDOR,
                    CONCAT(F.NOMBRE,' ',F.AP_PATERNO) AS VENDEDOR_SECUNDARIO
                FROM CONTRATOS_TERRENOS A
                INNER JOIN CAT_TERRENOS B ON A.ID_TERRENO=B.ID_TERRENO
                INNER JOIN CAT_MANZANAS C ON B.ID_MANZANA=C.ID_MANZANA
                INNER JOIN CAT_FRACCIONAMIENTOS D ON C.ID_FRACCIONAMIENTO=D.ID_FRACCIONAMIENTO
                LEFT JOIN CAT_USUARIOS E ON A.VENDEDOR=E.ID_USUARIO
                LEFT JOIN CAT_USUARIOS F ON A.VENDEDOR_COMPARTIDO=F.ID_USUARIO
                WHERE 
                    A.FECHA_CONTRATO IS NOT NULL 
                    AND A.ID_ESTATUS_CONTRATO=1 
                    AND A.BND_ACTIVO=TRUE 
                ORDER BY A.FECHA_CONTRATO DESC 
                LIMIT 10;
             `;
    let tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
