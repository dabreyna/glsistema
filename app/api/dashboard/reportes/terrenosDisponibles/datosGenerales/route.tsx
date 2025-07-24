import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";


/*TODO:

*/
export async function GET(request: NextRequest) {
  
  let query = `SELECT TO_CHAR(COUNT(ID_TERRENO),'99,999') AS TOTAL_TERRENOS,TO_CHAR(SUM(TOTAL_TERRENO),'$ 999,999,999,999.99') AS TOTAL_VALOR,
                      TO_CHAR(SUM(SUPERFICIE),'999,999,999,999,999.99 m2') AS TOTAL_SUPERFICIE
               FROM (SELECT ID_TERRENO,SUPERFICIE,TOTAL_TERRENO FROM CAT_TERRENOS WHERE BND_ACTIVO = TRUE AND ESTATUS = 1 )
             `;
  const tempData = await dbQuery(query);


  return NextResponse.json(tempData.rows, { status: 200 });
}
