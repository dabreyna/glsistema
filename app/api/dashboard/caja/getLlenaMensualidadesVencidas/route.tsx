import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const fecha = searchParams.get("fecha");
    const diasGracia = 9;

    const query = `SELECT coalesce(sum(monto_saldo),0) as monto_vencido,count(*) as mens_vencidas,
                    to_char(min(fecha_movimiento),'dd/MM/yyyy') as fecha_vencimiento
                    FROM MOVIMIENTOS_DETALLE A
                    WHERE ID_CONTRATO = ${idContrato}
                    AND ID_TIPO_MOVIMIENTO = 2
                    AND coalesce(BND_PAGADO,false) <> true and a.bnd_activo=true
                    AND FECHA_MOVIMIENTO <= '${fecha}'::date - INTERVAL '${diasGracia} days';`;

    const tempData = await dbQuery(query);
    db.$disconnect();
    return NextResponse.json(tempData.rows, { status: 200 });
}
