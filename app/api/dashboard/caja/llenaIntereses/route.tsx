import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";
import { format, parseISO, addDays, subDays } from "date-fns";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const mensualidades = Number(searchParams.get("mensualidades"));
    const fecha = searchParams.get("fecha");

    const diasGracia = 9;
    if (mensualidades === 0) {
        const query = `SELECT sum(intereses) as intereses
                        FROM (
                            SELECT ((a.MONTO_SALDO * b.TASA_INTERES_DIARIO) / 100) * (EXTRACT(DAY FROM ('${fecha}'::date - FECHA_MOVIMIENTO)) - COALESCE(dias_interes_pagados, 0)) as intereses
                            FROM MOVIMIENTOS_DETALLE A
                            INNER JOIN MOVIMIENTOS_CABECERA b ON a.ID_MOVIMIENTO_CABECERA = b.ID_MOVIMIENTO_CABECERA
                            WHERE a.ID_CONTRATO = ${idContrato}
                            AND ID_TIPO_MOVIMIENTO = 2
                            AND COALESCE(BND_PAGADO, false) is not true
                            AND a.bnd_activo = true
                            AND FECHA_MOVIMIENTO <= ('${fecha}'::date - INTERVAL '${diasGracia} days')
                        ) aa;
        `;
        dbQuery(query);
        const tempData = await dbQuery(query);
        const tempValue = Math.ceil(parseFloat(tempData.rows[0].intereses) * 100) / 100;
        return NextResponse.json(tempValue, { status: 200 });
    }
    if (mensualidades > 0) {
        const query = `SELECT sum(intereses) as intereses
                        FROM (
                            SELECT ((a.MONTO_SALDO * b.TASA_INTERES_DIARIO) / 100) * (EXTRACT(DAY FROM ('${fecha}'::date - FECHA_MOVIMIENTO)) - COALESCE(dias_interes_pagados, 0)) as intereses
                            FROM MOVIMIENTOS_DETALLE A
                            INNER JOIN MOVIMIENTOS_CABECERA b ON a.ID_MOVIMIENTO_CABECERA = b.ID_MOVIMIENTO_CABECERA
                            WHERE a.ID_CONTRATO = ${idContrato}
                            AND ID_TIPO_MOVIMIENTO = 2
                            AND COALESCE(BND_PAGADO, false) is not true
                            AND a.bnd_activo = true
                            AND FECHA_MOVIMIENTO <= ('${fecha}'::date - INTERVAL '${diasGracia} days')
                            limit ${mensualidades}
                        ) aa;
        `;
        dbQuery(query);
        const tempData = await dbQuery(query);
        const tempValue = Math.ceil(parseFloat(tempData.rows[0].intereses) * 100) / 100;
        return NextResponse.json(tempValue, { status: 200 });
    }
}
