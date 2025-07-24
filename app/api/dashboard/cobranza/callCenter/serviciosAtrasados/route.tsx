import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const dias_gracia = 9;

    const query = `select b.SERVICIO,count(*) as cantidad,sum(a.MONTO) as monto,sum(d.CONSUMO_M3) as consumo_m3
                    from movimientos_detalle a
                    inner join CAT_SERVICIOS b on a.ID_SERVICIO=b.ID_SERVICIO
                    left join CONSUMO_AGUA_CARGA d on a.ID_CARGA=d.ID_CARGA_VIEJO
                    where a.ID_CONTRATO=${idContrato}
                    and a.BND_ACTIVO=true
                    and a.ID_TIPO_MOVIMIENTO=10
                    and coalesce(a.BND_PAGADO,false)=false
                    and a.FECHA_MOVIMIENTO < now()
                    group by b.servicio,a.ID_SERVICIO,a.id_contrato`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
