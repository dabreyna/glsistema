import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select c.id_cliente,concat(c.NOMBRE,' ',c.AP_PATERNO,' ',coalesce(c.AP_MATERNO,'')) as nombre,
                    to_char(a.fecha_alta,'dd/MM/yyyy hh:mm AM') as fecha_alta
                    ,to_char(a.fecha_compromiso,'dd/MM/yyyy hh:mm AM') as fecha_compromiso
                    ,a.COMENTARIO,e.CLASIFICACION,g.tipo
                    ,concat(d.NOMBRE,' ',d.AP_PATERNO,' ',coalesce(d.AP_MATERNO,'')) as nombre_asesor
                    --,a.id_contrato
                      from agenda_cobranza a
                      inner join contratos_terrenos f on f.id_contrato = a.id_contrato
                      inner join clientes c on f.id_cliente = c.ID_CLIENTE
                      inner join cat_USUARIOS d on a.ID_USUARIO = d.id_USUARIO
                      left join CAT_COBRANZA_CLASIFICACION e on a.ID_CLASIFICACION = e.ID_CLASIFICACION
                      left join cat_COBRANZA_TIPOS_COMENTARIO g on g.id_tipo = a.id_tipo_comentario
                      where a.id_contrato = ${idContrato}
                      and a.fecha_alta is not null
                      order by a.fecha_alta desc`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
