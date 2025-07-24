import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";
import { format, parseISO, addDays, subDays } from "date-fns";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const fecha = parseISO(searchParams.get("fecha") ?? "");
    const diasGracia = 9;

    const fechaInicial = format(subDays(fecha, diasGracia), "yyyy-MM-dd");
    const fechaFinal = format(addDays(fecha, diasGracia), "yyyy-MM-dd");

    const query = `SELECT coalesce(sum(monto_saldo), 0) AS monto
                    FROM MOVIMIENTOS_DETALLE AS A
                    WHERE A.ID_CONTRATO = ${idContrato}
                    AND A.ID_TIPO_MOVIMIENTO = 2
                    AND COALESCE(A.BND_PAGADO, FALSE) IS NOT TRUE 
                    AND A.BND_ACTIVO = TRUE
                    and a.bnd_contrato_cancelado = false
                    AND A.FECHA_MOVIMIENTO BETWEEN ('${fechaInicial}'::date + INTERVAL '1 day') AND '${fechaFinal}'::date - INTERVAL '1 day';`;

    const tempData = await dbQuery(query);
    db.$disconnect();
    return NextResponse.json(tempData.rows, { status: 200 });
}
