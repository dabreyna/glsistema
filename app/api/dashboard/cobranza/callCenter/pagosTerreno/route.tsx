import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const dias_gracia = 9;

    const query = `select b.MOVIMIENTO as operacion,coalesce(a.NO_PAGO,0) as NO_PAGO,to_char(a.FECHA_MOVIMIENTO,'DD/MM/YYYY HH12:MI:SS AM') as fecha_pago
                    ,c.TIPO as tipo_pago
                    ,coalesce((select to_char(FECHA_MOVIMIENTO,'dd/MM/yyyy') from movimientos_detalle aa 
                        where aa.ID_CONTRATO=a.ID_CONTRATO and aa.ID_TIPO_MOVIMIENTO=2 and aa.NO_PAGO=a.NO_PAGO),'N/A') as fecha_vencimiento
                    ,a.NO_RECIBO
                    ,case when a.BND_ACTIVO=true then 'ACTIVO' ELSE 'CANCELADO' END AS ESTATUS_MOVIMIENTO
                    ,a.MONTO
                    --,a.id_contrato,a.id_tipo_pago
                    from movimientos_detalle a
                    inner join CAT_TIPOS_MOVIMIENTO b on a.ID_TIPO_MOVIMIENTO=b.ID_TIPO_MOVIMIENTO
                    inner join CAT_TIPO_PAGO c on a.ID_TIPO_PAGO=c.ID_TIPO_pago
                    where a.ID_CONTRATO=${idContrato}
                    and a.ID_TIPO_MOVIMIENTO in (1,3,5,6,8,9,4,12)
                    order by NO_PAGO asc, fecha_movimiento asc
`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
