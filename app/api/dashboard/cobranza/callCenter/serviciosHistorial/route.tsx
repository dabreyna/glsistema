import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const dias_gracia = 9;

    const query = `select b.SERVICIO,MONTO,case when coalesce(BND_PAGADO,false)=true then 'PAGADO' ELSE 'PENDIENTE' END as estatus
                    ,to_char(FECHA_MOVIMIENTO,'dd/MM/yyyy') as fecha_movimiento
                    ,to_char((select max(FECHA_MOVIMIENTO) from movimientos_detalle aa 
                        where a.ID_MOVIMIENTO_DETALLE=aa.NO_PAGO 
                        and aa.id_tipo_movimiento=11 
                        and aa.bnd_activo=true),'dd/MM/yyyy') as fecha_pago
                    ,c.lectura_anterior,c.lectura_actual,c.consumo_m3
                    --,a.id_carga
                    from movimientos_detalle a
                    inner join CAT_SERVICIOS b on a.ID_SERVICIO=b.ID_SERVICIO
                    left join consumo_agua_carga c on a.id_carga=c.id_carga_VIEJO and a.id_servicio=1 and c.id_contrato=${idContrato}
                    where a.ID_CONTRATO=${idContrato}
                    and a.BND_ACTIVO=true
                    and a.ID_TIPO_MOVIMIENTO=10`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
