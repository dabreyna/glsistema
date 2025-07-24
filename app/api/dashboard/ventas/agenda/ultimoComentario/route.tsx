import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idUsuario = searchParams.get("idUsuario");
    const idCliente = searchParams.get("idCliente");
    const idPerfil = searchParams.get("perfil");

    const query = `select  concat(b.NOMBRE,' ',b.AP_PATERNO,' ',coalesce(b.AP_MATERNO,'')) as nombre_cliente
                  ,(select comentario from agenda where fecha_alta=(select max(fecha_alta) from agenda where id_cliente=b.id_cliente) and id_cliente=b.id_cliente) as ultimo_comentario
                  ,(select concat(bb.NOMBRE,' ',bb.AP_PATERNO,' ',coalesce(bb.AP_MATERNO,'')) as nombre from agenda aa,cat_USUARIOS bb where aa.ID_USUARIO=bb.id_USUARIO and aa.fecha_alta=(select max(fecha_alta) 
                  from agenda where id_cliente=b.id_cliente) and id_cliente=b.id_cliente) as asesor_comentario
                  ,b.bnd_interesado_prospecto as interesado
                  from CLIENTES b
                  where b.ID_cliente =${idCliente}`;
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
