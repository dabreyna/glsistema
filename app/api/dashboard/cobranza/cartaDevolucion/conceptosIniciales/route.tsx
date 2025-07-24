import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { id } from "date-fns/locale";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const porcentajeCancelacion = 20.0;

    const cartasGeneradas = await dbQuery(`select count(*) as cartas from COBRANZA_CARTAS_devolucion where id_contrato=${idContrato};`);

    // si no hay cartas generadas, crear conceptos iniciales (total pagado(1) y cargo cancelacion(2))
    if (cartasGeneradas.rows[0].cartas == "0") {
        const totalPagado = await dbQuery(`select case when BND_CANCELADO=TRUE then 
                                                (
                                                    select sum(pagado) as pagado from (
                                                        select case when id_tipo_movimiento in (3,12) then sum(monto) 
                                                                    when id_tipo_movimiento in (5) then sum(monto*-1)
                                                        end as pagado 
                                                        from MOVIMIENTOS_DETALLE
                                                        where ID_CONTRATO=a.ID_CONTRATO
                                                        AND BND_CONTRATO_CANCELADO=TRUE
                                                        and ID_TIPO_MOVIMIENTO in (3,12,5)
                                                        and bnd_activo=TRUE
                                                        group by ID_TIPO_MOVIMIENTO
                                                    ) aa
                                                )
                                            else 
                                                (
                                                    select sum(pagado) as pagado from (
                                                        select case when id_tipo_movimiento in (3,12) then sum(monto) 
                                                                    when id_tipo_movimiento in (5) then sum(monto*-1)
                                                        end as pagado 
                                                        from MOVIMIENTOS_DETALLE 
                                                        where ID_CONTRATO=a.ID_CONTRATO
                                                        AND BND_CONTRATO_CANCELADO=FALSE
                                                        and ID_TIPO_MOVIMIENTO in (3,12,5)
                                                        and bnd_activo=TRUE
                                                        group by ID_TIPO_MOVIMIENTO
                                                    ) aa
                                                )
                                            end as TOTAL_PAGADO
                                            from CONTRATOS_TERRENOS a 
                                            where ID_CONTRATO=${idContrato}`);
        const cargoCancelacion = await dbQuery(`select (MONTO_TERRENO_INICIAL*(${porcentajeCancelacion}/100.00))*-1 as cargo
                                                from MOVIMIENTOS_CABECERA 
                                                where ID_CONTRATO=${idContrato}`);

        const datos = { totalPagado: totalPagado.rows[0].total_pagado, cargoCancelacion: cargoCancelacion.rows[0].cargo };
        console.log(datos);
        return NextResponse.json(datos, { status: 200 });
    } else {
        const totalPagado = await dbQuery(
            `select concepto,monto,orden,id_concepto from cobranza_cartas_conceptos where id_contrato=${idContrato}`
        );
        return NextResponse.json(totalPagado.rows, { status: 200 });
    }
    return NextResponse.json("1", { status: 200 });
}
