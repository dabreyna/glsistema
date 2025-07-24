import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select to_char(fecha_comentario,'dd/MM/yyyy')as fecha,
                  comentario,concat(b.NOMBRE,' ',b.AP_PATERNO,' ',coalesce(b.AP_MATERNO,'')) as nombre_asesor 
                  from COMENTARIOS_CAJA a
                  inner join cat_USUARIOS b on a.ID_USUARIO=b.id_USUARIO
                  where ID_CONTRATO=${idContrato} 
                  order by FECHA_COMENTARIO desc`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
