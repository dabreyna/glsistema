import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

interface Mensualidad {
    no_pago: number;
    fecha: string;
    deposito: string;
    deposito_preferente: string;
    intereses?: string;
    dias?: string;
}
interface TablaDatos {
    mensualidades?: Mensualidad[];
}

export async function GET(request: NextRequest) {
    let tablaFinal: TablaDatos = {};
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const queryMensualidadesPendientes = `SELECT COUNT(*) AS CONT FROM MOVIMIENTOS_DETALLE A
                                        WHERE ID_TIPO_MOVIMIENTO=2
                                        AND COALESCE(BND_PAGADO,FALSE)=FALSE
                                        AND FECHA_MOVIMIENTO <= NOW()
                                        AND BND_ACTIVO=TRUE
                                        AND ID_CONTRATO=${idContrato}`;
    const resultMensualidadesPendientes = await dbQuery(queryMensualidadesPendientes);

    if (resultMensualidadesPendientes.rows[0].cont > 0) {
        const query1 = `SELECT BB.*,
                    COALESCE(
                    ROUND(
                    (
                      SELECT (((A.MONTO_SALDO * B.TASA_INTERES_DIARIO)/100)*(SELECT EXTRACT(DAY FROM MAX(NOW())-(BB.FECHA::DATE))-COALESCE(DIAS_INTERES_PAGADOS,0)))AS INTERES
                      FROM MOVIMIENTOS_DETALLE A
                      INNER JOIN MOVIMIENTOS_CABECERA B ON  A.ID_CONTRATO = B.ID_CONTRATO
                      WHERE A.ID_CONTRATO=${idContrato}
                      AND A.ID_TIPO_MOVIMIENTO=2
                      AND A.BND_ACTIVO=TRUE
                      AND A.FECHA_MOVIMIENTO BETWEEN DATE_TRUNC('MONTH', BB.FECHA::DATE) AND 
                      (SELECT (DATE_TRUNC('MONTH', BB.FECHA::DATE) + INTERVAL '1 MONTH' - INTERVAL '1 DAY'))::DATE
                      AND A.FECHA_MOVIMIENTO <= (NOW()- INTERVAL '9 DAYS')
                    ),2),0) AS INTERESES,
                    (SELECT EXTRACT(DAY FROM MAX(NOW())-(BB.FECHA::DATE))) AS DIAS
                  FROM (
                    SELECT NO_PAGO,TO_CHAR(FECHA_MOVIMIENTO,'YYYY/MM/DD') AS FECHA,TO_CHAR(FECHA_MOVIMIENTO,'DD/MM/YYYY') AS FECHA2,
                    (SELECT COALESCE(SUM(MONTO_SALDO),0) AS DEPOSITO
                    FROM MOVIMIENTOS_DETALLE
                    WHERE ID_TIPO_MOVIMIENTO=1
                    AND ID_CONTRATO=${idContrato}
                    AND COALESCE(BND_PAGADO,FALSE)=FALSE)
                    ,MONTO_SALDO AS DEPOSITO_PREFERENTE
                    FROM MOVIMIENTOS_DETALLE A
                    WHERE BND_ACTIVO=TRUE
                    AND ID_TIPO_MOVIMIENTO IN (2)
                    AND COALESCE(BND_PAGADO,FALSE)=FALSE
                    AND FECHA_MOVIMIENTO <= NOW()
                    AND ID_CONTRATO=${idContrato}
                    ORDER BY NO_PAGO) BB
    `;
        const datosGenerales = await dbQuery(query1);
        tablaFinal.mensualidades = datosGenerales.rows;
        return NextResponse.json(datosGenerales.rows, { status: 200 });
    } else {
        return NextResponse.json("", { status: 200 });
    }

    return NextResponse.json("", { status: 200 });
}
