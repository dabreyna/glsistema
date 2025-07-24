import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const fecha = searchParams.get("fecha");
    const diasGracia = 9;

    const query = `select coalesce(sum(monto_saldo),0) as saldo 
                  from movimientos_detalle 
                  where id_tipo_movimiento=10 
                  and fecha_movimiento <= '${fecha}'::date 
                  and bnd_activo=true 
                  and id_contrato=${idContrato}`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows[0].saldo, { status: 200 });
}
