import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import moment from "moment";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const usuarioActivo = searchParams.get("idUsuarioActivo");
    const usuarioInactivo = searchParams.get("idUsuarioInactivo");
    const clasificacion = searchParams.get("clasificacion");
    let fInicio = searchParams.get("fInicio");
    let fFin = searchParams.get("fFin");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();

    let where = "";

    if (nombreCliente) {
        const words = nombreCliente.split(" ");

        words.forEach((word) => {
            where += ` AND CONCAT(bb.NOMBRE,' ',bb.AP_PATERNO,' ',COALESCE(bb.AP_MATERNO, '')) ILIKE '%${word}%'`;
        });
    }

    if (usuarioActivo != "" && usuarioActivo != "0") {
        where += ` and aa.id_usuario='${usuarioActivo}'`;
    }

    if (usuarioInactivo != "" && usuarioInactivo != "0") {
        where += ` and aa.id_usuario='${usuarioInactivo}'`;
    }

    if (!fInicio || !fFin) {
        const now = moment();
        fInicio = now.startOf("month").format("YYYY-MM-DD");
        fFin = now.endOf("month").format("YYYY-MM-DD");
    }

    if (clasificacion != "" && clasificacion != "0") {
        where += ` and donde='${clasificacion}'`;
    }

    where += ` and aa.fecha_comentario between '${fInicio}' AND '${fFin} 23:59:59'`;

    let query = "";
    if (fInicio != "" && fFin != "") {
        query = `SELECT row_number() over() as consecutivo, to_char(fecha_comentario,'dd/MM/yyyy') as fecha_comentario 
            ,comentario,donde,responsable as asesor,aa.id_usuario
            ,concat(bb.NOMBRE,' ',bb.AP_PATERNO,' ',coalesce(bb.AP_MATERNO,'')) as nombre_cliente
            ,atendido
            FROM (
            select a.FECHA_ALTA as fecha_comentario,COMENTARIO,'VENTAS' AS donde,concat(b.NOMBRE,' ',b.AP_PATERNO,' ',coalesce(b.AP_MATERNO,'')) as responsable,a.ID_CLIENTE
            ,b.id_usuario,'NA' as atendido
            from AGENDA a
            inner join cat_USUARIOS b on b.id_USUARIO=a.ID_USUARIO
            union
            select a.FECHA_COMENTARIO as fecha_comentario,COMENTARIO,'CAJA' AS donde,concat(b.NOMBRE,' ',b.AP_PATERNO,' ',coalesce(b.AP_MATERNO,'')) as responsable,c.ID_CLIENTE
            ,b.id_usuario,'NA' as atendido
            from COMENTARIOS_CAJA a
            inner join cat_USUARIOS b on b.id_USUARIO=a.ID_USUARIO
            inner join CONTRATOS_TERRENOS c on c.ID_CONTRATO=a.ID_CONTRATO
            UNION
            select a.FECHA_ALTA as fecha_comentario,COMENTARIO,'COBRANZA' AS donde,concat(b.NOMBRE,' ',b.AP_PATERNO,' ',coalesce(b.AP_MATERNO,'')) as responsable,c.ID_CLIENTE
            ,b.id_usuario
            ,case when a.bnd_mostrar_caja=true and a.bnd_atendido=true then 'ATENDIDO'
                  WHEN a.bnd_mostrar_caja=true AND coalesce(a.bnd_atendido,false)=false THEN 'SIN ATENDER'
                ELSE 'NA' END AS ATENDIDO
            from AGENDA_COBRANZA a
            inner join cat_USUARIOS b on b.id_USUARIO=a.ID_USUARIO
            inner join CONTRATOS_TERRENOS c on c.ID_CONTRATO=a.ID_CONTRATO
            )AA 
            inner join CLIENTES bb on bb.ID_CLIENTE=aa.ID_CLIENTE
            where 1=1 
            ${where}
            order by aa.fecha_comentario DESC`;
    } else {
        query = `SELECT 'NO HAY DATOS'`;
    }
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
