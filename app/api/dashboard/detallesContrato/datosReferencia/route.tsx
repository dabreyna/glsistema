import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    if (!idContrato) {
        return NextResponse.json({ error: 'El parámetro "idContrato" es requerido.' }, { status: 400 });
    }
    let query = `SELECT ID_REFERENCIA,ABREVIATURA,NOMBRE,AP_PATERNO,AP_MATERNO,CALLE,NUMERO,ENTRE,CIUDAD,CP,COLONIA,
                      ESTADO,PAIS,TEL_COD_CASA,TEL_CASA,TEL_COD_CEL,TEL_CEL,PARENTESCO,OBSERVACIONES
               FROM REFERENCIAS_PERSONALES
               WHERE ID_CONTRATO =${idContrato}
             `;
    let tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
