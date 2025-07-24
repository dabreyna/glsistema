import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import moment from "moment";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idUsuarioActivo = searchParams.get("idUsuarioActivo");
    let fInicio = searchParams.get("fInicio");
    let fFin = searchParams.get("fFin");
    const chkServicios = searchParams.get("chkServicios");

    if (!fInicio || !fFin) {
        const now = moment();
        fInicio = now.startOf("month").format("YYYY-MM-DD");
        fFin = now.endOf("month").format("YYYY-MM-DD");
    }

    let where = " ";

    if (idUsuarioActivo != "" && idUsuarioActivo != "0") {
        where += ` and id_asesor_cobranza=${idUsuarioActivo}`;
    }

    if (chkServicios != "" && chkServicios != "false") {
        where += ` and id_tipo_vencimiento=2`;
    } else {
        where += ` and id_tipo_vencimiento=1`;
    }

    let query = `select ROW_NUMBER() OVER(order by nombre_cliente) as consecutivo,*,case when id_estatus_contrato in (3,6,7) then 1.00
                when monto_pagado_mes >= monto_vencido then 1.00 else ((monto_pagado_mes*100)/monto_vencido)/100 end as puntuacion from (
                select 
                concat(e.NOMENCLATURA,'-',d.NO_MANZANA,'-',c.NO_TERRENO) as terreno
                ,a.ID_CONTRATO
                ,f.ID_CLIENTE as id_cliente,concat(f.NOMBRE,' ',f.AP_PATERNO,' ',coalesce(f.AP_MATERNO,'')) as nombre_cliente
                ,to_char(b.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato
                ,a.MONTO_VENCIDO as monto_vencido
                ,a.ID_TIPO_VENCIMIENTO
                ,case when a.ID_TIPO_VENCIMIENTO=1 then (select coalesce(sum(COALESCE(MONTO,0)),0) from MOVIMIENTOS_DETALLE where BND_ACTIVO=TRUE and ID_CONTRATO=b.ID_CONTRATO and ID_TIPO_MOVIMIENTO=3) 
                      when a.ID_TIPO_VENCIMIENTO=2 then  (select COALESCE(sum(COALESCE(MONTO,0)),0) from MOVIMIENTOS_DETALLE where BND_ACTIVO=TRUE and ID_CONTRATO=b.ID_CONTRATO and ID_TIPO_MOVIMIENTO=11) end as monto_pagado
                ,a.MENSUALIDADES_VENCIDAS as mensualidades_vencidas
                ,extract(day from g.FECHA_INICIO) as dia_vencimiento
                ,case when a.ID_TIPO_VENCIMIENTO=1 then (select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where BND_ACTIVO=true and ID_CONTRATO=b.ID_CONTRATO and ID_TIPO_MOVIMIENTO=3 and fecha_movimiento between '${fInicio}' and '${fFin} 23:59:59') 
                      when a.ID_TIPO_VENCIMIENTO=2 then (select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where BND_ACTIVO=true and ID_CONTRATO=b.ID_CONTRATO and ID_TIPO_MOVIMIENTO=11 and fecha_movimiento between '${fInicio}' and '${fFin} 23:59:59') end as monto_pagado_mes 
                ,case when (select count(*) from AGENDA_COBRANZA where ID_CONTRATO=b.ID_CONTRATO and fecha_alta between '${fInicio}' and '${fFin} 23:59:59' ) > 0 then 'SI' else 'NO' end as atendido
                ,f.id_asesor_cobranza,concat(h.nombre,' ',h.ap_paterno,' ',coalesce(h.ap_materno,'')) as ASESOR,b.id_estatus_contrato
                from CARGA_CLIENTES_COBRANZA a
                inner join CONTRATOS_TERRENOS b on b.ID_CONTRATO=a.ID_CONTRATO
                inner join CAT_TERRENOS c on c.ID_TERRENO=b.ID_TERRENO
                inner join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
                inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
                inner join CLIENTES f on f.ID_CLIENTE=b.ID_CLIENTE
                inner join MOVIMIENTOS_CABECERA g on g.ID_CONTRATO=b.ID_CONTRATO
                inner join cat_usuarios h on f.id_asesor_cobranza = h.id_usuario
                where b.ID_ESTATUS_CONTRATO in (1,4,5,3,6,7)
                and a.FECHA_CARGA between '${fInicio}' and '${fFin} 23:59:59'
                )aa where 1=1
                  ${where}
                order by nombre_cliente
               `;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
