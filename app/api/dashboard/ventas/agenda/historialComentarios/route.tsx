import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idCliente = searchParams.get("idCliente");

    const query = `select concat(c.NOMBRE,' ',c.AP_PATERNO,' ',coalesce(c.AP_MATERNO,'')) as nombre,
                    to_char(a.fecha_alta,'dd/MM/yyyy hh:mm AM') as fecha_alta,
                    a.COMENTARIO,concat(d.NOMBRE,' ',d.AP_PATERNO,' ',coalesce(d.AP_MATERNO,'')) as nombre_asesor
                      ,to_char(a.fecha_compromiso,'dd/MM/yyyy hh:mm AM') as fecha_compromiso
                      ,concat(f.nombre,' ',f.ap_paterno,' ',coalesce(f.ap_materno,'')) as Nombre_comentario
                      ,e.CLASIFICACION,a.id_cliente
                      from AGENDA a
                      inner join clientes c on a.id_cliente = c.ID_CLIENTE
                      inner join cat_USUARIOS d on a.ID_USUARIO = d.id_USUARIO
                      inner join CAT_VENTAS_CLASIFICACION e on a.ID_CLASIFICACION = e.ID_CLASIFICACION
                      inner join cat_USUARIOS f on f.id_USUARIO = a.id_USUARIO_comentario
                      where a.ID_cliente = ${idCliente}
                      order by a.fecha_alta desc`;
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
