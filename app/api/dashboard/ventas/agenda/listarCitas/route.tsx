import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";
import { id } from "date-fns/locale";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idUsuario = searchParams.get("idUsuario");
    const idPerfil = searchParams.get("perfil");
    const fecha = searchParams.get("fecha");
    let where = " ";
    if (idPerfil != "3") {
        where += `and a.ID_USUARIO=${idUsuario}`;
        where += ` or (a.ID_USUARIO =${idUsuario} and a.ID_CLASIFICACION=99 and a.ID_CLIENTE=b.ID_CLIENTE and to_char(FECHA_COMPROMISO,'dd/MM/yyyy')='${fecha}')`;
    }
    console.log(where);

    const query = `select b.NOMBRE||' '||b.AP_PATERNO||' '||coalesce(b.AP_MATERNO,'') as cliente,a.COMENTARIO
                  ,d.nombre||' '||d.ap_paterno||' '||coalesce(d.ap_materno,'') as nombre_comentario
                  ,to_char(FECHA_COMPROMISO,'HH:mm') as hora_compromiso,a.id_cliente,to_char(fecha_compromiso,'yyyy-MM-dd') as fecha_compromiso
                  --,format(convert(numeric,b.tel_cod_casa+b.tel_casa),'###-###-##-##') as tel_casa
                  ,b.tel_cod_casa||b.tel_casa as tel_casa
                  ,b.tel_usa_casa,b.email
                  ,fecha_compromiso as fecha_compromiso_original,c.nombre||' '||c.ap_paterno||' '||coalesce(c.ap_materno) as Asesor_de_ventas
                  ,b.tel_cod_cel||b.tel_cel as tel_cel,b.tel_usa_cel
                  ,b.tel_cod_trabajo||b.tel_trabajo as tel_oficina,b.tel_usa_oficina
                  --,b.id_cliente
                  ,a.id_agenda as id_agenda
                  ,case when b.TEL_USA_CEL=true then '+1'||b.TEL_COD_CEL||b.TEL_CEL
                  when b.TEL_USA_CEL=false then '+52'||b.TEL_COD_CEL||b.TEL_CEL
                  when b.TEL_USA_CEL is null then '+52'||b.TEL_COD_CEL||b.TEL_CEL
                  end as whats
                  from AGENDA a
                  inner join CLIENTES b on a.ID_CLIENTE=b.ID_CLIENTE
                  inner join cat_usuarios c on c.id_usuario=b.id_usuario
                  inner join cat_usuarios d on d.id_usuario=a.id_usuario_comentario
                  where a.FECHA_COMPROMISO=(select max(fecha_compromiso) from agenda where ID_CLIENTE=b.ID_CLIENTE) 
                  and to_char(FECHA_COMPROMISO,'dd/MM/yyyy')='${fecha}'
                  ${where}
                  order by fecha_compromiso_original`;
    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "asesor_de_ventas");
    const formattedData = Object.keys(groupedData).map((asesor_de_ventas) => ({
        asesor_de_ventas,
        citas: groupedData[asesor_de_ventas],
    }));

    return NextResponse.json(formattedData, { status: 200 });
}
