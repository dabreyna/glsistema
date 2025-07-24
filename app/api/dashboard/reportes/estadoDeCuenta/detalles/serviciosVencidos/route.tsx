import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const queryServiciosPendientes = `SELECT ROW_NUMBER() OVER() AS NO_PAGO,TO_CHAR(A.FECHA_MOVIMIENTO,'DD/MM/YYYY') AS FECHA,A.MONTO_SALDO,B.SERVICIO
                                    FROM MOVIMIENTOS_DETALLE A
                                    INNER JOIN CAT_SERVICIOS B ON A.ID_SERVICIO=B.ID_SERVICIO
                                    WHERE A.ID_TIPO_MOVIMIENTO=10
                                    AND COALESCE(BND_PAGADO,FALSE)=FALSE
                                    AND A.FECHA_MOVIMIENTO <= NOW()
                                    AND A.BND_ACTIVO=TRUE
                                    AND A.ID_CONTRATO=${idContrato}
                                    ORDER BY FECHA ASC`;

    const resultServiciosPendientes = await dbQuery(queryServiciosPendientes);

    return NextResponse.json(resultServiciosPendientes.rows, { status: 200 });
}
