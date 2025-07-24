import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const queryServiciosPendientes = `SELECT TO_CHAR(B.FECHA_MOVIMIENTO,'DD/MM/YYYY') AS FECHA_VENCIMIENTO,
                                      CONCAT(G.NOMENCLATURA,'-',A.NO_RECIBO)AS RECIBO,
                                      A.MONTO,TO_CHAR(A.FECHA_MOVIMIENTO,'DD/MM/YYYY') AS FECHA_PAGO,C.SERVICIO 
                                    FROM MOVIMIENTOS_DETALLE A
                                    INNER JOIN MOVIMIENTOS_DETALLE B ON B.ID_MOVIMIENTO_DETALLE=A.NO_PAGO
                                    INNER JOIN CAT_SERVICIOS C ON B.ID_SERVICIO=C.ID_SERVICIO
                                    INNER JOIN CONTRATOS_TERRENOS D ON A.ID_CONTRATO=D.ID_CONTRATO
                                    INNER JOIN CAT_TERRENOS E ON D.ID_TERRENO=E.ID_TERRENO
                                    INNER JOIN CAT_MANZANAS F ON E.ID_MANZANA=F.ID_MANZANA
                                    INNER JOIN CAT_FRACCIONAMIENTOS G ON F.ID_FRACCIONAMIENTO=G.ID_FRACCIONAMIENTO
                                    WHERE A.ID_CONTRATO=${idContrato}
                                    AND A.ID_TIPO_MOVIMIENTO IN (11)
                                    AND A.BND_ACTIVO=TRUE`;

    const resultServiciosPendientes = await dbQuery(queryServiciosPendientes);

    return NextResponse.json(resultServiciosPendientes.rows, { status: 200 });
}
