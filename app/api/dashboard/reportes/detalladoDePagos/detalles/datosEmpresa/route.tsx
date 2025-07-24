import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";


/*TODO:


*/

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idContrato = searchParams.get("idContrato"); 
  
  let query = `SELECT E.NOMBRE,E.DIRECCION AS CALLE,E.CIUDAD,E.ESTADO,E.CP,E.TELEFONO_PRINCIPAL
                FROM CONTRATOS_TERRENOS A
                INNER JOIN CAT_TERRENOS B ON B.ID_TERRENO=A.ID_TERRENO
                INNER JOIN CAT_MANZANAS C ON C.ID_MANZANA=B.ID_MANZANA
                INNER JOIN CAT_FRACCIONAMIENTOS D ON D.ID_FRACCIONAMIENTO=C.ID_FRACCIONAMIENTO
                INNER JOIN CAT_EMPRESAS E ON E.ID_EMPRESA=D.ID_EMPRESA 
                WHERE ID_CONTRATO=${idContrato}
               `;

 const tempData = await dbQuery(query);
  return NextResponse.json(tempData.rows, { status: 200 });
}
