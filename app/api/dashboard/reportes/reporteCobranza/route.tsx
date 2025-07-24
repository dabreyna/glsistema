import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idEmpresa = searchParams.get("idEmpresa");
    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");
    const estacion = searchParams.get("estacion");
    const idUsuarioActivo = searchParams.get("idUsuarioActivo");
    const idUsuarioInactivo = searchParams.get("idUsuarioInactivo");
    const moneda = searchParams.get("moneda");
    const notaCredito = searchParams.get("notaCredito");
    const pagosCancelados = searchParams.get("pagosCancelados");
    const pagosActivos = searchParams.get("pagosActivos");
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");

    let where = "";
    if (idEmpresa != "" && idEmpresa != "0") {
        where += " and j.id_empresa='" + idEmpresa + "'";
    }
    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += " and e.id_fraccionamiento='" + idFraccionamiento + "'";
    }
    if (idManzana != "" && idManzana != "0") {
        where += " and d.id_manzana='" + idManzana + "'";
    }
    if (idTerreno != "" && idTerreno != "0") {
        where += " and c.id_terreno='" + idTerreno + "'";
    }
    if (estacion != "" && estacion != "0") {
        where += " and h.id_estacion='" + estacion + "'";
    }
    if (idUsuarioActivo != "" && idUsuarioActivo != "0") {
        where += " and g.id_usuario='" + idUsuarioActivo + "'";
    }
    if (idUsuarioInactivo != "" && idUsuarioInactivo != "0") {
        where += " and g.id_usuario='" + idUsuarioInactivo + "'";
    }
    if (moneda == "" || moneda === "0") {
        where += " and case when a.ID_TIPO_MOVIMIENTO in (11) then 0 else coalesce(i.MONEDA,0) end = 0";
    } else if (moneda == "1") {
        where += " and case when a.ID_TIPO_MOVIMIENTO in (11) then 0 else i.MONEDA end = 1";
    }

    if (pagosActivos == "true" && notaCredito == "false" && pagosCancelados == "false") {
        where += " and a.bnd_activo=true and a.id_tipo_pago not in (5)";
    } else if (pagosActivos == "true" && notaCredito == "true" && pagosCancelados == "false") {
        where += " and a.bnd_activo=true";
    } else if (pagosActivos == "true" && notaCredito == "false" && pagosCancelados == "true") {
        where += "and a.id_tipo_pago not in (5)";
    } else if (pagosActivos == "false" && notaCredito == "true" && pagosCancelados == "false") {
        where += " and ( (a.id_tipo_pago=5 and a.bnd_activo=true) or (a.id_tipo_pago=5 and a.bnd_activo=false))"; //
    } else if (pagosActivos == "false" && notaCredito == "true" && pagosCancelados == "true") {
        where += " and a.id_tipo_pago=5 and coalesce(a.bnd_activo,false)=false";
    } else if (pagosActivos == "false" && notaCredito == "false" && pagosCancelados == "true") {
        where += " and coalesce(a.bnd_activo,false)=false and a.id_tipo_pago not in (5) --and a.bnd_contrato_cancelado=true";
    }

    if (fInicio != "" && fFin != "") {
        where += ` and a.fecha_movimiento between '${fInicio}' AND '${fFin} 23:59:59'`;
    }

    let query = `select zz.* from (select aa.NO_RECIBO,coalesce(sum(coalesce(pagos,0)),0) as pagos,coalesce(bb.MONTO_CHEQUE,0) as MONTO_CHEQUE,coalesce(bb.MONTO_EFECTIVO,0) as MONTO_EFECTIVO,coalesce(bb.MONTO_DLLS,0) as MONTO_DLLS,bb.TIPO_CAMBIO
,to_char(bb.FECHA_MOVIMIENTO,'dd/MM/yyyy HH:mm:ss') as fecha
,bb.USUARIO,concat(cc.NOMBRE,' ',cc.AP_PATERNO,' ',coalesce(cc.AP_MATERNO,'')) as nombre_usuario
,aa.FRACCIONAMIENTO,aa.nombre_cliente,aa.terreno,aa.bnd_activo as cancelado,bb.id_tipo_pago,aa.razon_social
from (
select a.NO_RECIBO
,case when a.ID_TIPO_MOVIMIENTO in (3,8,11,12) then a.monto
      when a.ID_TIPO_MOVIMIENTO in (5,6) then a.monto*-1 end pagos
,e.FRACCIONAMIENTO,concat(f.NOMBRE,' ',f.AP_PATERNO,' ',coalesce(f.AP_MATERNO,'')) as nombre_cliente
,concat(e.NOMENCLATURA,'-',d.NO_MANZANA,'-',c.NO_TERRENO) as terreno,a.id_contrato,j.razon_social,a.bnd_Activo
from MOVIMIENTOS_DETALLE a
inner join CONTRATOS_TERRENOS b on b.ID_CONTRATO=a.ID_CONTRATO
inner join CAT_TERRENOS c on c.ID_TERRENO=b.ID_TERRENO
inner join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
inner join CLIENTES f on f.ID_CLIENTE=b.ID_CLIENTE
inner join CAT_USUARIOS g on g.ID_USUARIO=a.USUARIO
--inner join cat_ESTACIONES h on h.ID_ESTACION=g.ID_ESTACION
inner join movimientos_cabecera i on i.id_contrato=a.id_contrato
inner join cat_empresas j on j.id_empresa=e.id_empresa
where a.NO_RECIBO is not null
--and a.bnd_contrato_cancelado=false -- AGREGADO POR DB EN POSTGRESS DEBIDO A QUE YA NO HAY MOVIMIENTOS_DETALLE_CANCELADOS--
and a.ID_TIPO_MOVIMIENTO in (1,3,8,11,12,5,6)
${where}
        )aa
inner join MOVIMIENTOS_DETALLE bb on bb.NO_RECIBO=aa.NO_RECIBO and bb.ID_TIPO_MOVIMIENTO=4 and bb.id_contrato=aa.id_contrato
inner join cat_USUARIOS cc on cc.id_USUARIO=bb.USUARIO
where 1=1
group by aa.NO_RECIBO,bb.MONTO_CHEQUE,bb.MONTO_EFECTIVO,bb.MONTO_DLLS,bb.TIPO_CAMBIO,bb.FECHA_MOVIMIENTO
,bb.USUARIO,aa.FRACCIONAMIENTO,aa.nombre_cliente,aa.terreno,aa.bnd_activo,bb.id_tipo_pago,cc.NOMBRE,cc.AP_PATERNO,cc.AP_MATERNO,aa.razon_social

union

select aa.NO_RECIBO,coalesce(sum(coalesce(pagos,0)),0) as pagos,coalesce(bb.MONTO_CHEQUE,0) as MONTO_CHEQUE,coalesce(bb.MONTO_EFECTIVO,0) as MONTO_EFECTIVO,coalesce(bb.MONTO_DLLS,0) as MONTO_DLLS,bb.TIPO_CAMBIO
,to_char(bb.FECHA_MOVIMIENTO,'dd/MM/yyyy HH:mm:ss') as fecha
,bb.USUARIO,concat(cc.NOMBRE,' ',cc.AP_PATERNO,' ',cc.AP_MATERNO) as nombre_usuario
,aa.FRACCIONAMIENTO,aa.nombre_cliente,aa.terreno,aa.bnd_activo as cancelado,bb.id_tipo_pago,aa.razon_social
from (
select a.NO_RECIBO
,case when a.ID_TIPO_MOVIMIENTO in (3,4,8,11,12) then a.monto
      when a.ID_TIPO_MOVIMIENTO in (5,6) then a.monto*-1 end pagos
,e.FRACCIONAMIENTO,concat(f.NOMBRE,' ',f.AP_PATERNO,' ',coalesce(f.AP_MATERNO,'')) as nombre_cliente
,concat(e.NOMENCLATURA,'-',d.NO_MANZANA,'-',c.NO_TERRENO) as terreno,a.id_contrato,j.razon_social,a.bnd_Activo
from MOVIMIENTOS_DETALLE a
inner join CONTRATOS_TERRENOS b on b.ID_CONTRATO=a.ID_CONTRATO
inner join CAT_TERRENOS c on c.ID_TERRENO=b.ID_TERRENO
inner join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
inner join CLIENTES f on f.ID_CLIENTE=b.ID_CLIENTE
inner join CAT_USUARIOS g on g.id_USUARIO=a.USUARIO
--inner join cat_ESTACIONES h on h.ID_ESTACION=g.ID_ESTACION
inner join movimientos_cabecera i on i.id_contrato=a.id_contrato
inner join cat_empresas j on j.id_empresa=e.id_empresa
where a.NO_RECIBO is not null
--and a.bnd_contrato_cancelado=true -- AGREGADO POR DB EN POSTGRESS DEBIDO A QUE YA NO HAY MOVIMIENTOS_DETALLE_CANCELADOS--
and NO_PAGO is not null --agregado por DB para corregir el problema de duplicados en cancelados y sumarlos en activos
and a.ID_TIPO_MOVIMIENTO in (1,3,4,8,11,12,5,6)
${where}
        )aa
inner join MOVIMIENTOS_DETALLE bb on bb.NO_RECIBO=aa.NO_RECIBO and bb.ID_TIPO_MOVIMIENTO=4 and bb.id_contrato=aa.id_contrato and bb.bnd_contrato_cancelado=true
inner join cat_USUARIOS cc on cc.id_USUARIO=bb.USUARIO
where 1=1
group by aa.NO_RECIBO,bb.MONTO_CHEQUE,bb.MONTO_EFECTIVO,bb.MONTO_DLLS,bb.TIPO_CAMBIO,bb.FECHA_MOVIMIENTO
,bb.USUARIO,aa.FRACCIONAMIENTO,aa.nombre_cliente,aa.terreno,aa.bnd_activo,bb.id_tipo_pago,cc.NOMBRE,cc.AP_PATERNO,cc.AP_MATERNO,aa.razon_social
) zz
order by zz.razon_social,zz.NO_RECIBO desc
  `;
    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "razon_social");
    const formattedData = Object.keys(groupedData).map((razon_social) => ({
        razon_social,
        pagos: groupedData[razon_social],
    }));
    return NextResponse.json(formattedData, { status: 200 });
}
