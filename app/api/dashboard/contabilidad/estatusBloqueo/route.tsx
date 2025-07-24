import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idPoliza = searchParams.get("id");
    const bndContabilizado = searchParams.get("bndContabilizado");
    if (!idPoliza) {
        return NextResponse.json({ error: "Falta el parametro id de Poliza" }, { status: 400 });
    }

    if (bndContabilizado === "false") {
        let query = `update contabilidad_polizas set bnd_contabilizado=true where id_poliza=${idPoliza} RETURNING *;`;
        const tempData = await dbQuery(query);

        if (tempData.rows.length >= 1) {
            console.info(`Se bloqueo poliza con id: ${idPoliza}`);
            return NextResponse.json({ status: "OK" }, { status: 200 });
        } else {
            console.error(`No se pudo bloquear poliza con id: ${idPoliza}`);
            return NextResponse.json({ status: "ERROR" }, { status: 400 });
        }
    } else {
        let query = `update contabilidad_polizas set bnd_contabilizado=false where id_poliza=${idPoliza} RETURNING *;`;
        const tempData = await dbQuery(query);

        if (tempData.rows.length >= 1) {
            console.info(`Se desbloqueo poliza con id: ${idPoliza}`);
            return NextResponse.json({ status: "OK" }, { status: 200 });
        } else {
            console.error(`No se pudo desbloqueo poliza con id: ${idPoliza}`);
            return NextResponse.json({ status: "ERROR" }, { status: 400 });
        }
    }
}
