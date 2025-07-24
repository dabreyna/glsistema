import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

/*TODO:

*/
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idFraccionamiento = searchParams.get("idFraccionamiento");

  let query = `SELECT ID_MANZANA,NO_MANZANA FROM CAT_MANZANAS WHERE BND_ACTIVO = TRUE AND ID_FRACCIONAMIENTO= ${idFraccionamiento} ORDER BY NO_MANZANA ASC`;
  const tempData = await dbQuery(query);

  return NextResponse.json(tempData.rows, { status: 200 });
}
