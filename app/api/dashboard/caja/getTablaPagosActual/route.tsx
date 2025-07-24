import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const fecha = searchParams.get("fecha");
    const diasGracia = 9;

    const query = `select a.id_movimiento_detalle,a.monto,a.monto_saldo,a.bnd_Activo,a.id_tipo_movimiento
                    ,to_char(a.fecha_movimiento,'yyyy-MM-dd') as fecha_movimiento,b.TASA_INTERES_DIARIO
                    ,coalesce(a.bnd_pagado,false)as bnd_pagado,a.id_contrato,a.no_pago
                    ,case when a.FECHA_MOVIMIENTO <= '${fecha}'::date - INTERVAL '${diasGracia} days' and a.id_tipo_movimiento=2
                    then cast(((a.MONTO_SALDO*b.TASA_INTERES_DIARIO)/100)*(EXTRACT(DAY FROM ('${fecha}'::date - a.FECHA_MOVIMIENTO))-coalesce(a.DIAS_INTERES_PAGADOS,0)) as numeric(10,2))
                    else 0
                    end as intereses
                    ,c.servicio,d.id_estatus_contrato
                    from movimientos_detalle a
                    inner join movimientos_cabecera b on b.id_contrato=a.id_contrato
                    left join cat_servicios c on c.id_servicio=a.id_servicio
                    inner join contratos_terrenos d on d.id_contrato=b.id_contrato
                    where 1=1
                    and a.bnd_Activo=true
                    and coalesce(a.bnd_contrato_cancelado,false) = false
                    and a.id_contrato in (${idContrato})
                    --and a.bnd_pagado=false
                   -- and a.id_tipo_movimiento in (2,10)
                    --and a.fecha_movimiento <= now()
                    --and extract(month, a.fecha_movimiento) <= extract(month ,'${fecha}'::date) --+ INTERVAL '2 months'  
                    order by a.id_tipo_movimiento,a.no_pago,a.fecha_movimiento`;

    const tempData = await dbQuery(query);
    db.$disconnect();
    return NextResponse.json(tempData.rows, { status: 200 });
}
