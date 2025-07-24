import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";


/*TODO:

*/
export async function GET(request: NextRequest) {
  
  let query = `SELECT ID_ESTATUS,ESTATUS FROM CAT_ESTATUS_CONTRATO WHERE BND_ACTIVO = TRUE`;
  const tempData = await dbQuery(query);


  return NextResponse.json(tempData.rows, { status: 200 });
}
