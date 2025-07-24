import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";
import moment from "moment";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idAsesor = searchParams.get("idAsesor");
    const idClasificacion = searchParams.get("tipoDeClasificacion");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const idUsuario = searchParams.get("idUsuario");
    const perfilUsuario = searchParams.get("perfilUsuario");

    let where = " ";

    if (fInicio != "" && fFin != "") {
        where = " and fecha_alta between '" + fInicio + "' and '" + fFin + " 23:59:59'";
    } else if (fInicio != "" && fFin == "") {
        where = " and fecha_alta >= '" + fInicio + "'";
    } else if (fInicio == "" && fFin != "") {
        where = " and fecha_alta <= '" + fFin + "'";
    } else if (fInicio == "" && fFin == "" && nombreCliente == "") {
        const inicio = moment().subtract(6, "months").startOf("month").format("YYYY-MM-DD");

        const fin = moment().endOf("month").format("YYYY-MM-DD 23:59:59");
        where = ` and fecha_alta between '${inicio}' and '${fin}'`;
    }

    if (idAsesor != "" && idAsesor != "0") {
        where += ` and id_usuario=${idAsesor}`;
    }
    if (perfilUsuario === "2") {
        where += ` and id_usuario='${idUsuario}'`;
    }

    if (idClasificacion != "" && idClasificacion != "0") {
        where += ` and clasificacion=${idClasificacion}`;
    }

    if (nombreCliente) {
        const words = nombreCliente.split(" ");

        words.forEach((word) => {
            where += ` AND nombre_cliente ILIKE '%${word}%'`;
        });
    }

    let query = `select * from( 
                                select b.id_usuario,b.id_cliente as id_cliente,
                                case when b.ID_ESTATUS_prospecto = 2 then 'azul' 
                                when B.BND_INTERESADO_PROSPECTO = false then 'rojo-tache' 
                                when(select max(fecha_compromiso) from agenda where ID_CLIENTE = B.ID_CLIENTE) < now() then 'rojo' 
                                when(select max(fecha_compromiso) from agenda where ID_CLIENTE = B.ID_CLIENTE) >= now() then 'verde' 
                                when(select count(*) from agenda where ID_CLIENTE = B.ID_CLIENTE) = 0 then 'amarillo' 
                                end as semaforo 
                                ,b.NOMBRE || ' ' || b.AP_PATERNO || ' ' || coalesce(b.AP_MATERNO, '') as nombre_cliente 
                                ,c.NOMBRE || ' ' || c.AP_PATERNO || ' ' || c.AP_MATERNO as nombre_asesor
                                --,to_char(B.FECHA_ALTA, 'dd/MM/yyyy') as fecha_alta 
                                ,b.fecha_alta
                                ,(select to_char(max(fecha_compromiso),'dd/MM/yyyy HH:MI AM') from AGENDA where ID_CLIENTE = B.ID_CLIENTE) as fecha_prox_llamada 
                                ,case when B.BND_INTERESADO_PROSPECTO then 'Interesado' 
                                  when not B.BND_INTERESADO_PROSPECTO then 'No interesado' 
                                  else 'No especificado' 
                                end as interesado 
                                ,d.MEDIO as medio
                                ,b.TEL_COD_CASA || '-' || b.TEL_CASA as tel_casa
                                ,b.TEL_COD_cel || '-' || b.TEL_cel as tel_cel
                                ,b.TEL_COD_TRABAJO || '-' || b.TEL_TRABAJO as tel_trabajo 
                                ,b.EMAIL as mail 
                                ,(select comentario 
                                  from AGENDA where id_CLIENTE = B.id_CLIENTE 
                                  and fecha_alta = (select max(fecha_alta) 
                                            from agenda where ID_CLIENTE = B.id_CLIENTE )limit 1) as ultimo_comentario 
                                ,(select id_clasificacion 
                                  from AGENDA where id_CLIENTE = B.id_CLIENTE 
                                  and fecha_alta = (select max(fecha_alta) from agenda where ID_CLIENTE = B.id_CLIENTE) limit 1 ) as clasificacion 
                                ,b.notas as notas from 
                                
                                clientes b 
                                
                              inner join cat_usuarios c on B.ID_USUARIO = c.id_USUARIO 
                              left join CAT_MEDIOS_PUBLICITARIOS d on B.ID_MEDIO_PUBLICITARIO = d.ID_MEDIO 

                              where b.bnd_activo=true)aa 
                              where 1=1 
                                ${where} 
                                    order by nombre_asesor,case semaforo when 'amarillo' then 1
                                                         when 'rojo' then 2
                                                         when 'verde' then 3
                                                         when 'azul' then 4
                                                         when 'rojo-tache' then 5 end,fecha_prox_llamada;`;

    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "nombre_asesor");
    const formattedData = Object.keys(groupedData).map((nombre_asesor) => ({
        nombre_asesor,
        clientes: groupedData[nombre_asesor],
    }));
    return NextResponse.json(formattedData, { status: 200 });
}
