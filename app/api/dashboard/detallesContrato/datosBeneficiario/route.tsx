import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    if (!idContrato) {
        return NextResponse.json({ error: 'El parámetro "idContrato" es requerido.' }, { status: 400 });
    }
    let query = `SELECT ID_BENEFICIARIO,ABREVIATURA,NOMBRE,AP_PATERNO,AP_MATERNO, TO_CHAR(FECHA_NACIMIENTO,'DD/MM/YYYY') AS FECHA_NACIMIENTO,LUGAR_NACIMIENTO,OCUPACION,CALLE,NUMERO,ENTRE,CIUDAD,CP,COLONIA,
                      ESTADO,PAIS,TEL_COD_CASA,TEL_CASA,TEL_COD_CEL,TEL_CEL,TEL_COD_TRABAJO,TEL_TRABAJO,EMAIL,LUGAR_TRABAJO,CONYUGE,
                      CASE WHEN ESTADO_CIVIL=1 then 'SOLTERO'  
                           WHEN ESTADO_CIVIL=2 THEN 'CASADO'
                           WHEN ESTADO_CIVIL=3 THEN 'DIVORCIADO' 
                           WHEN ESTADO_CIVIL=4 THEN 'VIUDO'ELSE 'OTRO' END AS ESTADO_CIVIL,
                      NACIONALIDAD,PARENTESCO
               FROM BENEFICIARIOS
               WHERE ID_CONTRATO =${idContrato}
             `;
    let tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
