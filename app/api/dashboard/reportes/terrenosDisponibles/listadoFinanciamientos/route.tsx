import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";

export async function GET(request: NextRequest) {
    let query = `SELECT FINANCIAMIENTO,PORCENTAJE,ID_FINANCIAMIENTO,NO_PAGOS
               FROM CAT_FINANCIAMIENTOS
               WHERE BND_ACTIVO = TRUE
             `;
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
