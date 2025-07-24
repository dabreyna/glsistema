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
        where += ` and b.vendedor='${usuarioInactivo}'`;
    }

    if (usuarioActivo != "0" && usuarioActivo != "") {
        where += ` and a.vendedor='${usuarioActivo}'`;
    }

    if (chkReubicacion != "true" && chkCancelacion != "true") {
        where += ` and coalesce(k.id_estatus,0)=0`;
    } else if (chkReubicacion == "true" && chkCancelacion != "true") {
        where += ` and coalesce(k.id_estatus,0) in (0,1)`;
    } else if (chkReubicacion != "true" && chkCancelacion != "false") {
        where += ` and coalesce(g.id_estatus,0) in (0,2)`;
    } else if (chkReubicacion != "false" && chkCancelacion != "false") {
        where += ` and coalesce(k.id_estatus,0) in (0,1,2)`;
    }

    const query = `select ROW_NUMBER() OVER(order by  concat(b.NOMBRE,' ',b.AP_PATERNO,' ',coalesce(b.AP_MATERNO,'')),a.fecha_contrato desc,e.NOMENCLATURA,d.NO_MANZANA,c.NO_TERRENO) as consecutivo
                  ,e.NOMENCLATURA,d.NO_MANZANA,c.NO_TERRENO,concat(b.NOMBRE,' ',b.AP_PATERNO,' ',coalesce(b.AP_MATERNO,'')) as nombre_asesor
                  ,c.SUPERFICIE,(select medio from cat_medios_publicitarios where id_medio=a.ID_MEDIO_PUBLICITARIO) as medioPublicitario
                  ,concat(h.NOMBRE,' ',h.AP_PATERNO,' ',coalesce(h.AP_MATERNO,'')) as nombre_cliente,concat(coalesce(h.tel_cod_cel,''),'-',coalesce(h.tel_cel,'')) as TEL_CEL,g.MENSUALIDAD_ACTUAL
                  ,to_char(a.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato,g.MONTO_TERRENO_ACTUAL,i.ESTATUS,j.FINANCIAMIENTO,a.id_contrato
                  ,CASE WHEN A.BND_CANCELADO=true THEN (select coalesce(sum(monto),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.id_contrato and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=1 and bnd_contrato_cancelado=true) ELSE (select coalesce(sum(monto),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.id_contrato and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=1 and bnd_contrato_cancelado=false) END as enganche
                  ,CASE WHEN A.BND_CANCELADO=true THEN (select coalesce(sum(coalesce(monto,0)),0) as pagado from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.id_contrato and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=3 and bnd_contrato_cancelado=true) ELSE (select coalesce(sum(coalesce(monto,0)),0) as pagado from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.id_contrato and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=3 and bnd_contrato_cancelado=false) END as pagado
                  ,CASE WHEN A.BND_CANCELADO=true THEN (select count(*) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.id_contrato and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=2 and BND_PAGADO=true and bnd_contrato_cancelado=true) ELSE (select count(*) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.id_contrato and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=2 and BND_PAGADO=true and bnd_contrato_cancelado=false) END as mens_pagadas
                  ,CASE WHEN A.BND_CANCELADO=true THEN (select count(*) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.id_contrato and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=2 and coalesce(BND_PAGADO,false)=false and fecha_movimiento between '${fecha_inicio}' and '${fecha_fin} 23:59:59') ELSE (select count(*) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.id_contrato and bnd_contrato_cancelado=false and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=2 and coalesce(BND_PAGADO,false)=false and fecha_movimiento between '${fecha_inicio}' and '${fecha_inicio} 23:59:59') END as mens_pendientes
                  ,case when a.id_estatus_contrato=1 then to_char(a.fecha_contrato,'dd/MM/yyyy')
                        when a.id_estatus_contrato=4 then to_char(a.fecha_firma,'dd/MM/yyyy')
                        when a.id_estatus_contrato=5 then (select to_char(max(fecha_movimiento),'dd/MM/yyyy') from movimientos_detalle where id_contrato=a.id_contrato and id_tipo_movimiento=3 and bnd_activo=true and bnd_contrato_cancelado=false)        
                        when a.id_estatus_contrato=3 then to_char(a.fecha_cancelacion,'dd/MM/yyyy') end
                  as fecha_estatus
                  from CONTRATOS_TERRENOS a
                  inner join cat_USUARIOS b on b.id_USUARIO=a.VENDEDOR
                  inner join CAT_TERRENOS c on c.ID_TERRENO=a.ID_TERRENO
                  inner join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
                  inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
                  inner join CAT_EMPRESAS f on f.ID_EMPRESA=e.id_EMPRESA
                  inner join MOVIMIENTOS_CABECERA g on g.ID_CONTRATO=a.ID_CONTRATO
                  inner join CLIENTES h on h.ID_CLIENTE=a.ID_CLIENTE
                  inner join CAT_ESTATUS_CONTRATO i on i.ID_ESTATUS=a.ID_ESTATUS_CONTRATO
                  inner join CAT_FINANCIAMIENTOS j on j.ID_FINANCIAMIENTO=g.ID_FINANCIAMIENTO
                  left join CAT_ESTATUS_CONTRATO_VENTAS k on k.id_estatus=a.id_estatus_ventas
                  where a.ID_ESTATUS_CONTRATO in (1,4,5,3)
                    ${where}
                    order by consecutivo,nombre_asesor,fecha_contrato desc,e.NOMENCLATURA,d.NO_MANZANA,c.NO_TERRENO`;
    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "nombre_asesor");

    const formattedData = Object.keys(groupedData).map((nombre_asesor) => ({
        nombre_asesor,
        ventas: groupedData[nombre_asesor],
    }));

    return NextResponse.json(formattedData, { status: 200 });
}
