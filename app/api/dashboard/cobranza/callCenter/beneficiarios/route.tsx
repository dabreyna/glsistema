import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select concat(NOMBRE,' ',AP_PATERNO,' ',coalesce(AP_MATERNO,'')) as nombre,calle
                  ,concat(COLONIA,' ',NUMERO,' ',CIUDAD,',',ESTADO,' CP. ',CP) as domicilio
                  ,concat(TEL_COD_CASA,'-',TEL_CASA) as tel_casa,concat(TEL_COD_CEL,'-',TEL_CEL) as tel_cel,concat(tel_cod_trabajo,'-',tel_trabajo) as tel_oficina
                  ,parentesco
                  from BENEFICIARIOS 
                  where ID_CONTRATO=${idContrato}`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
