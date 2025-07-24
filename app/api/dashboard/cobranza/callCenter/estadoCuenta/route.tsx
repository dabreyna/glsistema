import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select MONTO_TERRENO_ACTUAL as precio_actual,MONTO_TERRENO_INICIAL as precio_original
                  ,(select sum(monto) as precio_ajustado from movimientos_detalle where id_contrato=${idContrato} and id_tipo_movimiento=2 and bnd_activo=true and bnd_contrato_cancelado = false)
                  ,concat((select count(*) from movimientos_detalle where ID_CONTRATO=${idContrato} and ID_TIPO_MOVIMIENTO=3 and BND_ACTIVO=true),' / ',a.no_pagos) as pagos
                  ,(select sum(monto) from movimientos_detalle where ID_CONTRATO=${idContrato} and ID_TIPO_MOVIMIENTO=3 and BND_ACTIVO=true) as pagado,a.SALDO,coalesce(d.MONEDA,'PESOS') as moneda
                  ,a.MENSUALIDAD_ACTUAL,(select sum(monto) from movimientos_detalle where ID_CONTRATO=${idContrato} and ID_TIPO_MOVIMIENTO=1 and BND_ACTIVO=true) as deposito
                  ,case 
                    when mes_ajuste_anual=1 then 'ENERO'
                    when mes_ajuste_anual=2 then 'FEBRERO'
                    when mes_ajuste_anual=3 then 'MARZO'
                    when mes_ajuste_anual=4 then 'ABRIL'
                    when mes_ajuste_anual=5 then 'MAYO'
                    when mes_ajuste_anual=6 then 'JUNIO'
                    when mes_ajuste_anual=7 then 'JULIO'
                    when mes_ajuste_anual=8 then 'AGOSTO'
                    when mes_ajuste_anual=9 then 'SEPTIEMBRE'
                    when mes_ajuste_anual=10 then 'OCTUBRE'
                    when mes_ajuste_anual=11 then 'NOVIEMBRE'
                    when mes_ajuste_anual=12 then 'DICIEMBRE'
                    else 'N/A'
                  end
                  as mes_ajuste
                  ,to_char(a.fecha_inicio,'dd/MM/yyyy') as primer_pago,e.FINANCIAMIENTO,c.SUPERFICIE


                  from MOVIMIENTOS_CABECERA a
                  inner join CONTRATOS_TERRENOS b on a.ID_CONTRATO=b.ID_CONTRATO
                  inner join CAT_TERRENOS c on c.ID_TERRENO=b.ID_TERRENO
                  left join CAT_MONEDA d on d.ID_MONEDA=a.MONEDA
                  inner join CAT_FINANCIAMIENTOS e on e.ID_FINANCIAMIENTO=a.ID_FINANCIAMIENTO
                  where a.ID_CONTRATO=${idContrato}`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
