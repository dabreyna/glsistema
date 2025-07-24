import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idEmpresa = searchParams.get("id_empresa");
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const folio = searchParams.get("folio");
    const tipo_cambio = searchParams.get("tipo_cambio");
    const concepto_poliza = searchParams.get("concepto_poliza");
    const concepto_movimiento = searchParams.get("concepto_movimiento");

    let query = `
    insert into contabilidad_polizas(fecha_inicio,fecha_fin,id_empresa,folio,tipo_cambio,concepto_poliza
    ,concepto_movimiento,bnd_activo) values 
    ('${fInicio}' ,'${fFin}',${idEmpresa},'${folio}','${tipo_cambio}','${concepto_poliza}','${concepto_movimiento}',true)
    RETURNING *;`;
    console.log(query);

    const tempData = await dbQuery(query);

    if (tempData.rows.length >= 1) {
        console.info(`Se guardo poliza con id: ${tempData.rows[0].id_poliza}`);
        return NextResponse.json({ status: "OK" }, { status: 200 });
    } else {
        console.error(`No se pudo guardar poliza.`);
        return NextResponse.json({ status: "ERROR" }, { status: 400 });
    }
}
