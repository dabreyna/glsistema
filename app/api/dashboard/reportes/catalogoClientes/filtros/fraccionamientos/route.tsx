import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";


/*TODO:

*/
export async function GET(request: NextRequest) {
  
  let query = `SELECT ID_FRACCIONAMIENTO,FRACCIONAMIENTO FROM CAT_FRACCIONAMIENTOS WHERE BND_ACTIVO = TRUE ORDER BY FRACCIONAMIENTO ASC`;
  const tempData = await dbQuery(query);


  return NextResponse.json(tempData.rows, { status: 200 });
}
