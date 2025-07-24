import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import moment from "moment";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const asesor = searchParams.get("asesor");
    const chkVenta = searchParams.get("chkVenta");
    const chkPostVenta = searchParams.get("chkPostVenta");
    const chkCancelado = searchParams.get("chkCancelado");

    const fechaBase = moment(fInicio);
    const fmes2 = fechaBase.clone().add(1, "months").format("YYYY-MM-DD");
    const fmes3 = fechaBase.clone().add(2, "months").format("YYYY-MM-DD");
    const fmes4 = fechaBase.clone().add(3, "months").format("YYYY-MM-DD");
    const fmes5 = fechaBase.clone().add(4, "months").format("YYYY-MM-DD");
    const fmes6 = fechaBase.clone().add(5, "months").format("YYYY-MM-DD");

    let estatusContrato = "";

    if (chkVenta != "" && chkVenta != "false") {
        estatusContrato += "1,4";
    }

    if (chkPostVenta != "" && chkPostVenta != "false") {
        estatusContrato = estatusContrato ? estatusContrato + ",5" : "5";
    }

    if (chkCancelado != "" && chkCancelado != "false") {
        estatusContrato = estatusContrato ? estatusContrato + ",3" : "3";
    }

    estatusContrato = estatusContrato ? ` and a.id_estatus_contrato in (${estatusContrato})` : ` and a.id_estatus_contrato in (1,2,3,4,5)`;

    let where = "";

    where = estatusContrato ? estatusContrato : " and a.id_estatus_contrato in (1,2,3,4,5)";
    if (asesor != "" && asesor != "0") {
        where += ` and f.id_usuario='${asesor}'`;
    }
    let query = "";
    if (fInicio != "" && fFin != "") {
        query = `SELECT A.ID_CLIENTE,CONCAT(B.NOMBRE,' ',B.AP_PATERNO,' ',COALESCE(B.AP_MATERNO,'')) AS NOMBRE_CLIENTE,CONCAT(E.NOMENCLATURA,'-',D.NO_MANZANA,'-',C.NO_TERRENO)AS TERRENO
            --,E.FRACCIONAMIENTO
            ,TO_CHAR(A.FECHA_CONTRATO,'DD/MM/YYYY') AS FECHA
            ,CONCAT(F.NOMBRE,' ',F.AP_PATERNO,' ',COALESCE(F.AP_MATERNO,'')) AS ASESOR_VENTAS,A.ID_ESTATUS_CONTRATO,A.ID_CONTRATO
            ,A.ID_ESTATUS_CONTRATO
            ,CASE WHEN (SELECT COUNT(*) FROM MOVIMIENTOS_DETALLE 
                        WHERE ID_CONTRATO = A.ID_CONTRATO 
                        AND BND_ACTIVO = TRUE 
                        AND ID_TIPO_MOVIMIENTO = 2 
                        AND BND_PAGADO = TRUE) > 5 THEN 'MADURADA'
                ELSE CASE WHEN A.ID_ESTATUS_CONTRATO =3 THEN 'CANCELADO'
                ELSE '-' -- O CUALQUIER OTRO VALOR QUE DESEES SI NO CUMPLE LA CONDICIÓN
                END
            END AS MADURADA
            ,coalesce((select CASE
						WHEN aa.BND_PAGADO = TRUE  THEN 'PAGADA'
						WHEN aa.fecha_movimiento < CURRENT_DATE THEN 'VENCIDA'
						--ELSE 'N/A'
						END
				from MOVIMIENTOS_DETALLE aa
				where aa.BND_ACTIVO=TRUE and aa.ID_TIPO_MOVIMIENTO=2 and aa.bnd_contrato_cancelado=false
				and EXTRACT(MONTH FROM aa.FECHA_MOVIMIENTO) = EXTRACT(MONTH FROM TO_DATE('${fInicio}', 'YYYY-MM-DD'))
				and EXTRACT(YEAR FROM aa.FECHA_MOVIMIENTO) = EXTRACT(YEAR FROM TO_DATE('${fInicio}','YYYY-MM-DD'))
				and aa.ID_CONTRATO=A.ID_CONTRATO),'N/A') as MES1
            ,coalesce((select CASE
						WHEN aa.BND_PAGADO = TRUE  THEN 'PAGADA'
						WHEN aa.fecha_movimiento < CURRENT_DATE THEN 'VENCIDA'
						--ELSE 'N/A'
						END
				from MOVIMIENTOS_DETALLE aa
				where aa.BND_ACTIVO=TRUE and aa.ID_TIPO_MOVIMIENTO=2
				and EXTRACT(MONTH FROM aa.FECHA_MOVIMIENTO) = EXTRACT(MONTH FROM TO_DATE('${fmes2}', 'YYYY-MM-DD'))
				and EXTRACT(YEAR FROM aa.FECHA_MOVIMIENTO) = EXTRACT(YEAR FROM TO_DATE('${fmes2}','YYYY-MM-DD'))
				and aa.ID_CONTRATO=A.ID_CONTRATO),'N/A') as MES2
            ,coalesce((select CASE
						WHEN aa.BND_PAGADO = TRUE  THEN 'PAGADA'
						WHEN aa.fecha_movimiento < CURRENT_DATE THEN 'VENCIDA'
						--ELSE 'N/A'
						END
				from MOVIMIENTOS_DETALLE aa
				where aa.BND_ACTIVO=TRUE and aa.ID_TIPO_MOVIMIENTO=2
				and EXTRACT(MONTH FROM aa.FECHA_MOVIMIENTO) = EXTRACT(MONTH FROM TO_DATE('${fmes3}', 'YYYY-MM-DD'))
				and EXTRACT(YEAR FROM aa.FECHA_MOVIMIENTO) = EXTRACT(YEAR FROM TO_DATE('${fmes3}','YYYY-MM-DD'))
				and aa.ID_CONTRATO=A.ID_CONTRATO),'N/A') as MES3
            ,coalesce((select CASE
						WHEN aa.BND_PAGADO = TRUE  THEN 'PAGADA'
						WHEN aa.fecha_movimiento < CURRENT_DATE THEN 'VENCIDA'
						--ELSE 'N/A'
						END
				from MOVIMIENTOS_DETALLE aa
				where aa.BND_ACTIVO=TRUE and aa.ID_TIPO_MOVIMIENTO=2
				and EXTRACT(MONTH FROM aa.FECHA_MOVIMIENTO) = EXTRACT(MONTH FROM TO_DATE('${fmes4}', 'YYYY-MM-DD'))
				and EXTRACT(YEAR FROM aa.FECHA_MOVIMIENTO) = EXTRACT(YEAR FROM TO_DATE('${fmes4}','YYYY-MM-DD'))
				and aa.ID_CONTRATO=A.ID_CONTRATO),'N/A') as MES4
            ,coalesce((select CASE
						WHEN aa.BND_PAGADO = TRUE  THEN 'PAGADA'
						WHEN aa.fecha_movimiento < CURRENT_DATE THEN 'VENCIDA'
						--ELSE 'N/A'
						END
				from MOVIMIENTOS_DETALLE aa
				where aa.BND_ACTIVO=TRUE and aa.ID_TIPO_MOVIMIENTO=2
				and EXTRACT(MONTH FROM aa.FECHA_MOVIMIENTO) = EXTRACT(MONTH FROM TO_DATE('${fmes5}', 'YYYY-MM-DD'))
				and EXTRACT(YEAR FROM aa.FECHA_MOVIMIENTO) = EXTRACT(YEAR FROM TO_DATE('${fmes5}','YYYY-MM-DD'))
				and aa.ID_CONTRATO=A.ID_CONTRATO),'N/A') as MES5
            ,coalesce((select CASE
						WHEN aa.BND_PAGADO = TRUE  THEN 'PAGADA'
						WHEN aa.fecha_movimiento < CURRENT_DATE THEN 'VENCIDA'
						--ELSE 'N/A'
						END
				from MOVIMIENTOS_DETALLE aa
				where aa.BND_ACTIVO=TRUE and aa.ID_TIPO_MOVIMIENTO=2
				and EXTRACT(MONTH FROM aa.FECHA_MOVIMIENTO) = EXTRACT(MONTH FROM TO_DATE('${fmes6}', 'YYYY-MM-DD'))
				and EXTRACT(YEAR FROM aa.FECHA_MOVIMIENTO) = EXTRACT(YEAR FROM TO_DATE('${fmes6}','YYYY-MM-DD'))
				and aa.ID_CONTRATO=A.ID_CONTRATO),'N/A') as MES6

            FROM CONTRATOS_TERRENOS A
            INNER JOIN CLIENTES B ON A.ID_CLIENTE=B.ID_CLIENTE
            INNER JOIN CAT_TERRENOS C ON C.ID_TERRENO=A.ID_TERRENO
            INNER JOIN CAT_MANZANAS D ON D.ID_MANZANA=C.ID_MANZANA
            INNER JOIN CAT_FRACCIONAMIENTOS E ON E.ID_FRACCIONAMIENTO=D.ID_FRACCIONAMIENTO
            INNER JOIN CAT_USUARIOS F ON F.ID_USUARIO=A.VENDEDOR
            WHERE 1=1 
            AND A.FECHA_CONTRATO BETWEEN '${fInicio}' AND '${fFin} 23:59:59'
            ${where}
            
            ORDER BY NOMBRE_CLIENTE;`;
    } else {
        query = `SELECT 'NO HAY DATOS'`;
    }
    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
