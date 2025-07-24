import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import moment from "moment";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idPoliza = searchParams.get("id");
    const fInicio = moment(searchParams.get("fInicio"), "DD/MM/YYYY").format("YYYY-MM-DD");
    const fFin = moment(searchParams.get("fFin"), "DD/MM/YYYY").format("YYYY-MM-DD");
    const concepto_poliza = searchParams.get("concepto_poliza");
    const concepto_movimiento = searchParams.get("concepto_movimiento");
    const tipo_cambio = searchParams.get("tipo_cambio");
    const folio = searchParams.get("folio");
    const id_empresa = searchParams.get("id_empresa");

    if (!idPoliza) {
        return NextResponse.json({ error: "Falta el parametro id de Poliza" }, { status: 400 });
    }

    let query = `update contabilidad_polizas set fecha_inicio='${fInicio}',fecha_fin='${fFin}',concepto_poliza='${concepto_poliza}',concepto_movimiento='${concepto_movimiento}',tipo_cambio='${tipo_cambio}',folio='${folio}',id_empresa='${id_empresa}' where id_poliza=${idPoliza} RETURNING *;`;
    const tempData = await dbQuery(query);
    console.log(query);

    if (tempData.rows.length >= 1) {
        return NextResponse.json({ status: "OK" }, { status: 200 });
    } else {
        console.error(`No se pudo actualizar poliza con id: ${idPoliza}`);
        return NextResponse.json({ status: "ERROR" }, { status: 400 });
    }
}
