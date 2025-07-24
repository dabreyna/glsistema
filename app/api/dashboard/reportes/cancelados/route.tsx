import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const chkDolares = searchParams.get("chkDolares");
    const chkHistorico = searchParams.get("chkHistorico");
    const asesor = searchParams.get("asesor");

    let where = " ";

    if (fInicio != "" && fFin != "") {
        where += ` AND A.FECHA_CANCELACION BETWEEN '${fInicio}' AND '${fFin} 23:59:59'`;
    }

    if (asesor != "" && asesor != "0") {
        where += ` and h.id_usuario=${asesor}`;
    }

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and d.id_fraccionamiento=${idFraccionamiento}`;
    }

    if (chkDolares != "" && chkDolares != "false") {
        where += `  and f.moneda=1`;
    } else {
        where += `  and coalesce(f.moneda,0)=0`;
    }

    if (chkHistorico != "" && chkHistorico != "false") {
        where += `  and extract(year from a.fecha_contrato) < 2014`;
    } else {
        where += `  and extract(year from a.fecha_contrato) > 2013`;
    }

    if (nombreCliente) {
        const words = nombreCliente.split(" ");

        words.forEach((word) => {
            where += ` AND CONCAT(i.NOMBRE,' ',i.AP_PATERNO,' ',COALESCE(i.AP_MATERNO, '')) LIKE '%${word}%'`;
        });
    }

    let query = `SELECT D.NOMENCLATURA,C.NO_MANZANA,B.NO_TERRENO,CONCAT(E.NOMBRE,' ',E.AP_PATERNO,' ',COALESCE(E.AP_MATERNO,'')) AS NOMBRE_CLIENTE
                ,D.FRACCIONAMIENTO,TO_CHAR(A.FECHA_CANCELACION,'DD/MM/YYYY') AS FECHA_CANCELACION
                ,(SELECT COUNT(*) 
                FROM MOVIMIENTOS_DETALLE
                WHERE ID_CONTRATO=A.ID_CONTRATO 
                AND BND_ACTIVO=TRUE
                AND ID_TIPO_MOVIMIENTO=2 
                AND BND_PAGADO=TRUE
                AND BND_CONTRATO_CANCELADO=TRUE
                ) AS MENSUALIDADES_PAGADAS
                ,(SELECT COUNT(*) 
                    FROM MOVIMIENTOS_DETALLE 
                    WHERE ID_CONTRATO=A.ID_CONTRATO 
                    AND BND_ACTIVO=TRUE
                    AND ID_TIPO_MOVIMIENTO=2 
                    AND COALESCE(BND_PAGADO,FALSE)=FALSE 
                    AND FECHA_MOVIMIENTO <= NOW()
                    AND BND_CONTRATO_CANCELADO = true
                ) AS MENSUALIDADES_VENCIDAS
                ,(SELECT COALESCE(SUM(MONTO_SALDO),0) 
                FROM MOVIMIENTOS_DETALLE 
                WHERE ID_CONTRATO=A.ID_CONTRATO 
                AND BND_ACTIVO=TRUE
                AND ID_TIPO_MOVIMIENTO=2 
                AND COALESCE(BND_PAGADO,FALSE)=FALSE 
                AND FECHA_MOVIMIENTO <= NOW()
                AND BND_CONTRATO_CANCELADO=TRUE
                ) AS CAPITAL_VENCIDO
                ,(SELECT COALESCE(SUM(MONTO),0) 
                FROM MOVIMIENTOS_DETALLE
                WHERE ID_CONTRATO=A.ID_CONTRATO 
                AND BND_ACTIVO=TRUE 
                AND ID_TIPO_MOVIMIENTO=3
                AND BND_CONTRATO_CANCELADO=TRUE
                ) AS PAGADO
                ,F.MENSUALIDAD_ACTUAL,TO_CHAR(A.FECHA_CONTRATO,'DD/MM/YYYY') AS FECHA_CONTRATO,F.MONTO_TERRENO_ACTUAL,F.MONTO_TERRENO_INICIAL
                ,(SELECT SUM(MONTO_SALDO) 
                FROM MOVIMIENTOS_DETALLE 
                WHERE ID_CONTRATO=A.ID_CONTRATO 
                AND BND_ACTIVO=TRUE 
                AND ID_TIPO_MOVIMIENTO=2 
                AND COALESCE(BND_PAGADO,FALSE)=FALSE
                AND BND_CONTRATO_CANCELADO=TRUE
                ) AS SALDO_PENDIENTE
                ,B.SUPERFICIE,CONCAT(G.NOMBRE,' ',G.AP_PATERNO,' ',COALESCE(G.AP_MATERNO,'')) AS NOMBRE_VENDEDOR,A.COMENTARIOS_CANCELACION
                ,CASE WHEN H.MONTO_CARGO IS NULL 
                THEN (SELECT COALESCE(SUM(MONTO),0) FROM MOVIMIENTOS_DETALLE WHERE ID_CONTRATO=A.ID_CONTRATO AND BND_ACTIVO=TRUE AND ID_TIPO_MOVIMIENTO=3 AND BND_CONTRATO_CANCELADO=TRUE) 
                ELSE COALESCE(H.MONTO_CARGO,0) 
                END AS CARGO_CANCELACION
                ,COALESCE(H.MONTO_DEVOLUCION,0) AS MONTO_DEVOLUCION
                ,CASE WHEN H.MONTO_CARGO IS NULL THEN 'SIN CARTA' ELSE 'CON CARTA' END AS ESTATUS_CARTA
                ,A.ID_CONTRATO
                ,CONCAT(J.NOMBRE,' ',J.AP_PATERNO,' ',COALESCE(J.AP_MATERNO,'')) AS asesor_carta_devolucion  --agregado el 19/mayo/2025
                ,CONCAT(K.NOMBRE,' ',K.AP_PATERNO,' ',COALESCE(K.AP_MATERNO,'')) AS asesor_cobranza   --agregado el 19/mayo/2025
                FROM CONTRATOS_TERRENOS A
                INNER JOIN CAT_TERRENOS B ON B.ID_TERRENO=A.ID_TERRENO
                INNER JOIN CAT_MANZANAS C ON C.ID_MANZANA=B.ID_MANZANA
                INNER JOIN CAT_FRACCIONAMIENTOS D ON D.ID_FRACCIONAMIENTO=C.ID_FRACCIONAMIENTO
                INNER JOIN CLIENTES E ON E.ID_CLIENTE=A.ID_CLIENTE
                INNER JOIN MOVIMIENTOS_CABECERA F ON A.ID_CONTRATO=F.ID_CONTRATO
                INNER JOIN CAT_USUARIOS G ON G.ID_USUARIO=A.VENDEDOR
                LEFT JOIN COBRANZA_CARTAS_DEVOLUCION H ON H.ID_CONTRATO=A.ID_CONTRATO
                INNER JOIN CLIENTES I ON I.ID_CLIENTE=A.ID_CLIENTE
                LEFT JOIN CAT_USUARIOS J ON H.ID_USUARIO=J.ID_USUARIO --agregado el 19/mayo/2025
                LEFT JOIN CAT_USUARIOS K ON E.ID_ASESOR_COBRANZA=K.ID_USUARIO --agregado el 19/mayo/2025
                WHERE A.ID_ESTATUS_CONTRATO=3 
                --AND A.FECHA_CANCELACION BETWEEN '${fInicio}' AND '${fFin} 23:59:59'
                ${where}
               `;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
