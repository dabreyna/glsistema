import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idPoliza = searchParams.get("id");
    if (!idPoliza) {
        return NextResponse.json({ error: "Falta el parametro id de Poliza" }, { status: 400 });
    }

    let query = `select id_poliza,id_empresa,to_char(fecha_inicio,'dd/MM/yyyy') as fInicio,to_char(fecha_fin,'dd/MM/yyyy') as fFin,concepto_poliza,concepto_movimiento,tipo_cambio,folio from contabilidad_polizas where id_poliza=${idPoliza};`;
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
