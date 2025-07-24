import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idMovimiento = searchParams.get("idM");
    const idCarga = searchParams.get("idC");
    let query = `select count(1)`;

    if (idMovimiento != "0" && idMovimiento != "") {
        query = `DELETE FROM MOVIMIENTOS_DETALLE WHERE ID_MOVIMIENTO_DETALLE=${idMovimiento} returning *`;
    }

    const query2 = `DELETE FROM CONSUMO_AGUA_LECTURAS WHERE ID_CARGA=${idCarga} returning *`;

    console.log(query);
    console.log(query2);

    const tempData = await dbQuery(query);
    if (tempData?.rows.length > 0) {
        const tempData2 = await dbQuery(query2);
        if (tempData2.rows.length > 0) {
            return NextResponse.json(tempData.rows, { status: 200 });
        } else {
            return NextResponse.json("No hay registros de consumo de agua.", { status: 500 });
        }
    } else {
        return NextResponse.json("No hay registros de consumo de agua.", { status: 500 });
    }
    return NextResponse.json("No hay registros de consumo de agua.", { status: 500 });
}
