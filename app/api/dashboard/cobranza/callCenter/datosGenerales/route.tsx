import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select  concat(b.NOMBRE,' ',b.ap_paterno,' ',coalesce(b.AP_MATERNO,'')) as nombre_cliente,to_char(a.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato
      ,concat(b.TEL_COD_CASA,'-',b.TEL_CASA) as tel_casa,concat(b.TEL_COD_TRABAJO,'-',b.TEL_TRABAJO) as tel_trabajo
      ,concat(b.TEL_COD_CEL,'-',b.TEL_CEL) as tel_cel,b.EMAIL,to_char(b.FECHA_NACIMIENTO,'dd/MM/yyyy') as fecha_nacimiento,f.ESTADO as estado_civil
      ,coalesce(b.CONYUGE,'') as conyuge,g.ESTATUS as estatus_contrato,h.MEDIO,concat(k.nomenclatura,'-',j.NO_MANZANA,'-',i.NO_TERRENO) as terreno
      from CONTRATOS_TERRENOS a
      inner join CLIENTES b on a.ID_CLIENTE=b.ID_CLIENTE
			left join CAT_ESTADO_CIVIL f on f.ID_ESTADO=b.ESTADO_CIVIL
			left join CAT_ESTATUS_CONTRATO g on g.ID_ESTATUS=a.ID_ESTATUS_CONTRATO
			left join CAT_MEDIOS_PUBLICITARIOS h on h.ID_MEDIO=b.ID_MEDIO_PUBLICITARIO
			left join CAT_TERRENOS i on i.ID_TERRENO=a.ID_TERRENO
			left join CAT_MANZANAS j on j.ID_MANZANA=i.ID_MANZANA
			left join CAT_FRACCIONAMIENTOS k on k.ID_FRACCIONAMIENTO=j.ID_FRACCIONAMIENTO
      where a.ID_CONTRATO=${idContrato}`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
