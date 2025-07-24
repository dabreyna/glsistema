import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("id_contrato");

    const query = `select b.saldo,to_char(a.fecha_contrato,'dd/MM/yyyy') as fecha_contrato,b.no_pagos as mensualidades,
                    c.financiamiento,
                    b.monto_terreno_inicial as precio_original,d.estatus,
                    case 
                      WHEN b.mes_ajuste_anual = 1 THEN 'ENERO'
                        WHEN b.mes_ajuste_anual = 2 THEN 'FEBRERO'
                        WHEN b.mes_ajuste_anual = 3 THEN 'MARZO'
                        WHEN b.mes_ajuste_anual = 4 THEN 'ABRIL'
                        WHEN b.mes_ajuste_anual = 5 THEN 'MAYO'
                        WHEN b.mes_ajuste_anual = 6 THEN 'JUNIO'
                        WHEN b.mes_ajuste_anual = 7 THEN 'JULIO'
                        WHEN b.mes_ajuste_anual = 8 THEN 'AGOSTO'
                        WHEN b.mes_ajuste_anual = 9 THEN 'SEPTIEMBRE'
                        WHEN b.mes_ajuste_anual = 10 THEN 'OCTUBRE'
                        WHEN b.mes_ajuste_anual = 11 THEN 'NOVIEMBRE'
                        WHEN b.mes_ajuste_anual = 12 THEN 'DICIEMBRE'
                    end as ajuste_anual,
                    concat(e.nombre,' ',e.ap_paterno,' ',coalesce(e.ap_materno,'')) as asesor_venta,
                    concat(g.nombre,' ',g.ap_paterno,' ',coalesce(g.ap_materno,'')) as asesor_cobranza,
                    coalesce(a.bnd_contrato_entregado,false) as contrato_entregado,
                    a.bloqueo_caja as bnd_bloqueo_caja,
                    a.bnd_descuentos as bnd_descuentos,
                    b.id_movimiento_cabecera::numeric as id_movimiento_cabecera,
                    coalesce(b.moneda,0) as moneda,
                    h.no_terreno,
                    i.no_manzana,
                    j.fraccionamiento

                    from contratos_terrenos a
                    inner join movimientos_cabecera b on a.id_contrato=b.id_contrato
                    inner join cat_financiamientos c on b.id_financiamiento=c.id_financiamiento
                    inner join cat_estatus_contrato d on a.id_estatus_contrato=d.id_estatus
                    inner join cat_usuarios e on a.vendedor =e.id_usuario
                    inner join clientes f on a.id_cliente =f.id_cliente
                    inner join cat_usuarios g on f.id_asesor_cobranza =g.id_usuario
                    left join cat_terrenos h on a.id_terreno=h.id_terreno
                    left join cat_manzanas i on h.id_manzana=i.id_manzana
                    left join cat_fraccionamientos j on i.id_fraccionamiento=j.id_fraccionamiento
                    where a.id_contrato=${idContrato}`;

    const tempData = await dbQuery(query);
    db.$disconnect();
    return NextResponse.json(tempData.rows, { status: 200 });
}
