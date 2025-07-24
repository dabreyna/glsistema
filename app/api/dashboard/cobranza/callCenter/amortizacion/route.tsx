import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const dias_gracia = 9;

    const query = `select a.NO_PAGO,to_char(a.FECHA_MOVIMIENTO,'dd/MM/yyyy') as fecha_movimiento,MONTO
                    ,(select coalesce(sum(monto),0) from movimientos_detalle where ID_CONTRATO=a.id_contrato 
                        and ID_TIPO_MOVIMIENTO=8 and BND_ACTIVO=true and NO_PAGO=a.NO_PAGO) as intereses
                    ,case when coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO < now() then 1 else 0 end as bnd_atrasado
                    from movimientos_detalle a
                    where a.ID_CONTRATO=${idContrato}
                    and a.ID_TIPO_MOVIMIENTO=2
                    and a.BND_ACTIVO=true
                    order by NO_PAGO`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
