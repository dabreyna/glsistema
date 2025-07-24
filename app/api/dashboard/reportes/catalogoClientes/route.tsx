import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

/*TODO:


*/
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");
    const idEstatus = searchParams.get("idEstatus");

    let where = " ";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and e.id_fraccionamiento=${idFraccionamiento}`;
    }
    if (idManzana != "" && idManzana != "0") {
        where += ` and d.id_manzana=${idManzana}`;
    }
    if (idTerreno != "" && idTerreno != "0") {
        where += ` and c.id_terreno=${idTerreno}`;
    }
    if (idEstatus != "" && idEstatus != "0") {
        where += ` and a.id_estatus_contrato=${idEstatus}`;
    }

    let query = `SELECT ROW_NUMBER() OVER(ORDER BY CONCAT(COALESCE(B.NOMBRE,''),' ',COALESCE(B.AP_PATERNO,''),' ',COALESCE(B.AP_MATERNO,''))) AS consecutivo,
                CONCAT(E.NOMENCLATURA,'-',D.NO_MANZANA,'-',C.NO_TERRENO) AS terreno,CONCAT(COALESCE(B.NOMBRE,''),' ',COALESCE(B.AP_PATERNO,''),' ',COALESCE(B.AP_MATERNO,'')) AS nombreCliente
                ,B.CALLE,B.NUMERO,B.ENTRE,B.COLONIA,CONCAT(B.TEL_COD_CEL,'-',B.TEL_CEL) AS TEL_CEL,B.EMAIL,B.CIUDAD,B.ESTADO,B.CP, 
                TO_CHAR(B.FECHA_NACIMIENTO,'DD/MM/YYYY') AS FECHA_NACIMIENTO
                ,EXTRACT(DAY FROM F.FECHA_INICIO) AS DIA_VENCIMIENTO
                ,(SELECT COUNT(*) FROM MOVIMIENTOS_DETALLE 
                  WHERE ID_CONTRATO=A.ID_CONTRATO 
                  AND BND_ACTIVO=TRUE 
                  AND COALESCE(BND_PAGADO,FALSE)=FALSE 
                  AND ID_TIPO_MOVIMIENTO=2 
                  AND FECHA_MOVIMIENTO <= CURRENT_DATE) AS MESES_ATRASO
                ,(SELECT COUNT(*) 
                  FROM MOVIMIENTOS_DETALLE 
                  WHERE ID_CONTRATO=A.ID_CONTRATO 
                  AND BND_ACTIVO=TRUE 
                  AND BND_PAGADO=TRUE 
                  AND ID_TIPO_MOVIMIENTO=2) AS MENS_PAGADAS
                FROM CONTRATOS_TERRENOS A
                INNER JOIN CLIENTES B ON B.ID_CLIENTE=A.ID_CLIENTE
                INNER JOIN CAT_TERRENOS C ON C.ID_TERRENO=A.ID_TERRENO
                INNER JOIN CAT_MANZANAS D ON D.ID_MANZANA=C.ID_MANZANA
                INNER JOIN CAT_FRACCIONAMIENTOS E ON E.ID_FRACCIONAMIENTO=D.ID_FRACCIONAMIENTO
                INNER JOIN MOVIMIENTOS_CABECERA F ON F.ID_CONTRATO=A.ID_CONTRATO
                WHERE 1=1   ${where} 
                ORDER BY nombreCliente`;

    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
