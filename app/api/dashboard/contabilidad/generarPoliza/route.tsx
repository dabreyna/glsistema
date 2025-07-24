import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idPoliza = searchParams.get("id");
    if (!idPoliza) {
        return NextResponse.json({ error: "Falta el parametro id de Poliza" }, { status: 400 });
    }

    let query = `delete from contabilidad_polizas where id_poliza=${idPoliza} RETURNING *;`;
    const tempData = await dbQuery(query);

    if (tempData.rows.length >= 1) {
        return NextResponse.json({ status: "OK" }, { status: 200 });
    } else {
        console.error(`No se pudo eliminar poliza con id: ${idPoliza}`);
        return NextResponse.json({ status: "ERROR" }, { status: 400 });
    }
}
