import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idEmpresa = searchParams.get("idEmpresa");
    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const fecha = searchParams.get("fecha");
    const tipoCambio = searchParams.get("tipoCambio");

    let where = " ";

    if (idEmpresa != "" && idEmpresa != "0") {
        where += ` and CAT_EMPRESAS.ID_EMPRESA=${idEmpresa}`;
    }

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and CAT_FRACCIONAMIENTOS.ID_FRACCIONAMIENTO=${idFraccionamiento}`;
    }

    const query = `SELECT COUNT(*) AS mensualidades_vencidas, SUM(MOVIMIENTOS_DETALLE.MONTO_SALDO) AS monto_vencido, MOVIMIENTOS_DETALLE.ID_CONTRATO, coalesce(MOVIMIENTOS_CABECERA.MONEDA,0) as MONEDA
                    FROM CAT_FRACCIONAMIENTOS 
					INNER JOIN CAT_EMPRESAS ON CAT_FRACCIONAMIENTOS.id_EMPRESA = CAT_EMPRESAS.ID_EMPRESA 
					INNER JOIN CAT_MANZANAS ON CAT_FRACCIONAMIENTOS.ID_FRACCIONAMIENTO = CAT_MANZANAS.ID_FRACCIONAMIENTO 
					INNER JOIN CAT_TERRENOS ON CAT_MANZANAS.ID_MANZANA = CAT_TERRENOS.ID_MANZANA 
					INNER JOIN CONTRATOS_TERRENOS ON CAT_TERRENOS.ID_TERRENO = CONTRATOS_TERRENOS.ID_TERRENO 
					INNER JOIN MOVIMIENTOS_DETALLE ON CONTRATOS_TERRENOS.ID_CONTRATO = MOVIMIENTOS_DETALLE.ID_CONTRATO and movimientos_detalle.bnd_contrato_cancelado=false
					INNER JOIN MOVIMIENTOS_CABECERA ON CAT_TERRENOS.ID_TERRENO = MOVIMIENTOS_CABECERA.ID_TERRENO 
														AND CONTRATOS_TERRENOS.ID_CONTRATO = MOVIMIENTOS_CABECERA.ID_CONTRATO 
														AND MOVIMIENTOS_DETALLE.ID_MOVIMIENTO_CABECERA = MOVIMIENTOS_CABECERA.ID_MOVIMIENTO_CABECERA
                    WHERE (MOVIMIENTOS_DETALLE.ID_TIPO_MOVIMIENTO = 2) 
                    AND (COALESCE(MOVIMIENTOS_DETALLE.BND_PAGADO, FALSE) = FALSE)
                    AND (MOVIMIENTOS_DETALLE.FECHA_MOVIMIENTO <= '${fecha} 23:59:59') 
                    AND (MOVIMIENTOS_DETALLE.ID_CONTRATO IN (SELECT ID_CONTRATO FROM CONTRATOS_TERRENOS AS CONTRATOS_TERRENOS_1))   
                    ${where}
                    GROUP BY MOVIMIENTOS_DETALLE.ID_CONTRATO, MOVIMIENTOS_CABECERA.MONEDA
                    ORDER BY mensualidades_vencidas asc;`;

    const queryCalculoTotalMensualidadesVencidas = ``;
    const tempData = await dbQuery(queryCalculoTotalMensualidadesVencidas);
    return NextResponse.json(tempData.rows, { status: 200 });
}
