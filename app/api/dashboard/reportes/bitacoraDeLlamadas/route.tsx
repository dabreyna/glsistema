import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idAsesor = searchParams.get("idAsesor");
    const idClasificacion = searchParams.get("tipoDeClasificacion");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();
    let fInicio = searchParams.get("fInicio");
    let fFin = searchParams.get("fFin");

    if (fInicio == "" && fFin == "") {
        fInicio = "2000-01-01";
        fFin = "2030-12-31";
    }
    let where = " ";

    if (idAsesor != "" && idAsesor != "0") {
        where += ` and b.id_usuario=${idAsesor}`;
    }
    if (idClasificacion != "" && idClasificacion != "0") {
        where += ` and a.id_clasificacion=${idAsesor}`;
    }

    if (nombreCliente) {
        const words = nombreCliente.split(" ");

        words.forEach((word) => {
            where += ` AND CONCAT(e.NOMBRE,' ',e.AP_PATERNO,' ',COALESCE(e.AP_MATERNO, '')) ILIKE '%${word}%'`;
        });
    }

    let query = `SELECT CONCAT(B.NOMBRE,' ',B.AP_PATERNO,' ',COALESCE(B.AP_MATERNO,'')) AS NOMBRE_ASESOR,A.ID_CLASIFICACION,B.ID_USUARIO,
                CASE WHEN C.CLASIFICACION IS NULL THEN 'N/A' ELSE C.CLASIFICACION END AS CLASIFICACION,A.ID_TIPO_COMENTARIO,F.TIPO,COUNT(*) AS CONT,
                '${idAsesor}' AS FIL_ASESOR,'${fInicio}' AS FIL_FECHA_INICIO,'${fFin}' AS FIL_FECHA_FIN,
                '${nombreCliente}' AS FIL_CLIENTE,'${idClasificacion}' AS FIL_CLASIFICACION FROM AGENDA_COBRANZA A 
                INNER JOIN CAT_USUARIOS B ON B.ID_USUARIO=A.ID_USUARIO 
                LEFT JOIN CAT_COBRANZA_CLASIFICACION C ON C.ID_CLASIFICACION=A.ID_CLASIFICACION 
                INNER JOIN CONTRATOS_TERRENOS D ON D.ID_CONTRATO=A.ID_CONTRATO 
                INNER JOIN CLIENTES E ON E.ID_CLIENTE=D.ID_CLIENTE 
                LEFT JOIN CAT_COBRANZA_TIPOS_COMENTARIO F ON F.ID_TIPO=A.ID_TIPO_COMENTARIO 
                WHERE 1=1 
                ${where}
                AND A.FECHA_ALTA BETWEEN '${fInicio}' AND '${fFin} 23:59:59'
                GROUP BY NOMBRE_ASESOR,A.ID_CLASIFICACION,C.CLASIFICACION,B.ID_USUARIO,A.ID_TIPO_COMENTARIO,F.TIPO ORDER BY NOMBRE_ASESOR`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
