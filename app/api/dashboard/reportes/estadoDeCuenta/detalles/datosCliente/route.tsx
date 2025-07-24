import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    let query = `SELECT CONCAT(B.NOMBRE,' ',B.AP_PATERNO,' ',COALESCE(B.AP_MATERNO,'')) AS NOMBRE,B.CALLE,B.NUMERO
                ,TO_CHAR(A.FECHA_CONTRATO,'DD/MM/YYYY') AS FECHA_CONTRATO,B.COLONIA,B.TEL_COD_CEL,B.TEL_CEL,B.CIUDAD,B.CP
                ,F.NOMBRE AS EMPRESA,G.MONEDA,D.NO_MANZANA,C.NO_TERRENO,E.FRACCIONAMIENTO,B.TEL_COD_CASA,B.TEL_CASA
                FROM CONTRATOS_TERRENOS A
                INNER JOIN CLIENTES B ON B.ID_CLIENTE=A.ID_CLIENTE
                INNER JOIN CAT_TERRENOS C ON C.ID_TERRENO=A.ID_TERRENO
                INNER JOIN CAT_MANZANAS D ON D.ID_MANZANA=C.ID_MANZANA
                INNER JOIN CAT_FRACCIONAMIENTOS E ON E.ID_FRACCIONAMIENTO=D.ID_FRACCIONAMIENTO
                INNER JOIN CAT_EMPRESAS F ON F.ID_EMPRESA=E.ID_EMPRESA
                INNER JOIN MOVIMIENTOS_CABECERA G ON G.ID_CONTRATO=A.ID_CONTRATO
                WHERE A.ID_CONTRATO=${idContrato}
               `;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
