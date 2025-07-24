import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

/*TODO:


*/

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    let query = `select deposito+pagos-descuentos_mensualidad as total_pagado,aa.*
,pagos-descuentos_mensualidad as deposito_preferente
from (
	-- select d.NOMENCLATURA+'-'+format(try_convert(numeric,c.NO_MANZANA),'000')+'-'+format(try_convert(numeric,b.NO_terreno),'000') as terreno
	select a.id_contrato,concat(d.NOMENCLATURA,'-',c.NO_MANZANA,'-',b.NO_terreno) as terreno
,'CAPITAL' AS concepto
	,e.MONTO_TERRENO_INICIAL
	,(select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO in (5))+(select coalesce(descuento_monto,0) from movimientos_cabecera where id_contrato=a.id_contrato) as descuentos
,(select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO in (5)) as descuentos_mensualidad
	,coalesce((select sum(mensualidad_actual)-sum(mensualidad_anterior) from AJUSTE_ANUAL_DETALLE where id_contrato=a.id_contrato),0) as ajuste_anual
,case when bnd_indexa=true then (select sum(ib.MONTO-ia.MENSUALIDAD_INICIAL) from MOVIMIENTOS_CABECERA ia inner join MOVIMIENTOS_DETALLE ib on ib.ID_CONTRATO=ia.ID_CONTRATO and ib.ID_TIPO_MOVIMIENTO=2 where ia.ID_CONTRATO=a.id_contrato) else 0 end as ajuste_anual_saldo
	--,e.MONTO_TERRENO_ACTUAL
,(select sum(monto) from movimientos_detalle where id_contrato=a.id_contrato and id_tipo_movimiento in (1,2)) as saldo_ajustado
	,(select coalesce(sum(monto),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO in (12)) as deposito
	,(select coalesce(sum(monto),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO in (3)) as pagos
	,e.SALDO
	,(select COUNT(*) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO in (2) and coalesce(BND_PAGADO,false)=false) as mensualidades_pendientes
  ,(select COUNT(*) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true AND ID_TIPO_MOVIMIENTO in (2) AND BND_PAGADO=TRUE) as mensualidades_pagadas
  ,b.superficie
	from CONTRATOS_TERRENOS a
	inner join CAT_TERRENOS b on b.ID_TERRENO=a.ID_TERRENO
	inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
	inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
	inner join MOVIMIENTOS_CABECERA e on a.ID_CONTRATO=e.ID_CONTRATO
	where a.ID_CONTRATO=${idContrato}) aa
    `;

    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
