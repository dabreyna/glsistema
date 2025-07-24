import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idUsuario = searchParams.get("idUsuario");
    const fecha = searchParams.get("fecha");
    let where = " ";

    const query = `select aa.*,concat(bb.nombre,' ',bb.ap_paterno,' ',coalesce(bb.ap_materno,'')) as nombre_asesor from (
                    select a.id_contrato,c.ID_CLIENTE,concat(c.nombre,' ',c.ap_paterno,' ',coalesce(c.ap_materno,'')) as nombre_cliente,a.FECHA_COMPROMISO,COMENTARIO
                    ,c.id_asesor_cobranza as asesor
                    from AGENDA_COBRANZA a
                    inner join CONTRATOS_TERRENOS b on b.ID_CONTRATO=a.ID_CONTRATO
                    inner join CLIENTES c on c.ID_CLIENTE=b.ID_CLIENTE
                    where ID_TIPO_COMENTARIO=2
                    and FECHA_COMPROMISO=(select max(fecha_compromiso) from AGENDA_COBRANZA where ID_CONTRATO=a.id_contrato)
                    ) aa
                    inner join cat_usuarios bb on aa.asesor=bb.id_usuario
                    where to_char(FECHA_COMPROMISO,'dd/MM/yyyy')='${fecha}' and asesor=${idUsuario}`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
