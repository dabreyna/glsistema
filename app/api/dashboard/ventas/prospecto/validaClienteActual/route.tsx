import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

/*TODO:

*/
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idCliente = searchParams.get("idCliente");
    let query = `select count(*) as cont from contratos_terrenos where id_cliente=${idCliente} and id_estatus_contrato in (1,4,5,6,7,3)`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
