import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idUsuario = searchParams.get("idUsuario");
    const perfil = searchParams.get("perfil");
    const fecha_inicio = searchParams.get("fInicio");
    const fecha_fin = searchParams.get("fFin");
    const idEmpresa = searchParams.get("idEmpresa");
    const usuarioActivo = searchParams.get("usuarioActivo");
    const usuarioInactivo = searchParams.get("usuarioInactivo");
    const estatus = searchParams.get("estatus");
    const chkReubicacion = searchParams.get("chkReubicacion");
    const chkCancelacion = searchParams.get("chkCancelacion");
    let where = ` and fecha_contrato between '${fecha_inicio}' and '${fecha_fin}'`;

    if (idEmpresa != "0" && idEmpresa != "") {
        where += ` and f.id_empresa='${idEmpresa}'`;
    }
    if (estatus != "0" && estatus != "") {
        where += ` and a.id_estatus_contrato='${estatus}'`;
    }
    if (usuarioInactivo != "0" && usuarioInactivo != "") {
        where += ` and b.id_usuario='${usuarioInactivo}'`;
    }

    if (usuarioActivo != "0" && usuarioActivo != "") {
        where += ` and b.id_usuario='${usuarioActivo}'`;
    }

    if (chkReubicacion != "true" && chkCancelacion != "true") {
        where += ` and coalesce(g.id_estatus,0)=0`;
    } else if (chkReubicacion != "false" && chkCancelacion == "true") {
        where += ` and coalesce(g.id_estatus,0) in (0,1)`;
    } else if (chkReubicacion != "true" && chkCancelacion != "false") {
        where += ` and coalesce(g.id_estatus,0) in (0,2)`;
    } else if (chkReubicacion != "false" && chkCancelacion != "false") {
        where += ` and coalesce(g.id_estatus,0) in (0,1,2)`;
    }

    const query = `select f.RAZON_SOCIAL,e.FRACCIONAMIENTO,count(*) as ventas,f.id_empresa,e.id_fraccionamiento
                    ,to_char('${fecha_inicio}'::date,'dd/MM/yyyy') as fecha_inicio,to_char('${fecha_fin}'::date,'dd/MM/yyyy') as fecha_fin ,${estatus} as fil_estatus,${idEmpresa} as fil_empresa, ${usuarioActivo} as fil_asesor,${usuarioInactivo} as fil_asesor_inactivo,${chkReubicacion} as fil_reubicados,
                    ${chkCancelacion} as fil_cancelados from contratos_terrenos a
                    inner join cat_usuarios b on a.vendedor= b.id_usuario
                    inner join cat_terrenos c on c.id_terreno=a.id_terreno
                    inner join cat_manzanas d on d.id_manzana=c.id_manzana
                    inner join cat_fraccionamientos e on e.id_fraccionamiento=d.id_fraccionamiento
                    inner join cat_empresas f on f.id_empresa=e.id_empresa
                    left join cat_estatus_contrato_ventas g on g.id_estatus=a.id_estatus_ventas
                    where a.ID_ESTATUS_CONTRATO in (1,4,5,3)
                    ${where}
                    group by f.RAZON_SOCIAL,e.FRACCIONAMIENTO,f.id_empresa,e.id_fraccionamiento
                    order by razon_social `;

    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "razon_social");

    const formattedData = Object.keys(groupedData).map((razon_social) => ({
        razon_social,
        ventas: groupedData[razon_social],
    }));

    return NextResponse.json(formattedData, { status: 200 });
}
