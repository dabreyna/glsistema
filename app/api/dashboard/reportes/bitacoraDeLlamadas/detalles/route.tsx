import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const id_asesor = searchParams.get("id_asesor");
    const fil_asesor = searchParams.get("fil_asesor");
    const fil_fecha_ini = searchParams.get("fil_fecha_ini");
    const fil_fecha_fin = searchParams.get("fil_fecha_fin")?.toUpperCase();
    const fil_cliente = searchParams.get("fil_cliente")?.toUpperCase();
    const fil_clasificacion = searchParams.get("fil_clasificacion")?.toUpperCase();
    const asesor = searchParams.get("asesor")?.toUpperCase();

    let where = " ";

    if (id_asesor != "0") {
        where += ` and a.id_usuario=${id_asesor}`;
    }
    if (fil_clasificacion != "0") {
        where += ` and g.id_clasificacion=${fil_clasificacion}`;
    }

    if (fil_cliente) {
        const words = fil_cliente.split(" ");

        words.forEach((word) => {
            where += ` AND CONCAT(f.NOMBRE,' ',f.AP_PATERNO,' ',COALESCE(f.AP_MATERNO, '')) ILIKE '%${word}%'`;
        });

        console.log(where);
    }

    let query = `SELECT ROW_NUMBER() OVER () AS NUMERO_FILA,  AA.*,CONCAT(BB.TEL_COD_CEL,'-',BB.TEL_CEL) AS TEL_CEL,CONCAT(BB.TEL_COD_CASA,'-',BB.TEL_CASA) AS TEL_CASA,
               CONCAT(BB.TEL_COD_TRABAJO,'-',BB.TEL_TRABAJO) AS TEL_TRABAJO,BB.EMAIL
                FROM (
                SELECT CONCAT(E.NOMENCLATURA,'-',D.NO_MANZANA,'-',C.NO_TERRENO) AS TERRENO
                ,CONCAT(F.NOMBRE,' ',F.AP_PATERNO,' ',COALESCE(F.AP_MATERNO,'')) AS NOMBRE_CLIENTE,F.ID_CLIENTE
                ,TO_CHAR(A.FECHA_ALTA,'DD/MM/YYYY') AS FECHA_AGENDA
                ,G.CLASIFICACION
                ,A.COMENTARIO
                FROM AGENDA_COBRANZA A
                INNER JOIN CONTRATOS_TERRENOS B ON B.ID_CONTRATO=A.ID_CONTRATO
                INNER JOIN CAT_TERRENOS C ON C.ID_TERRENO=B.ID_TERRENO
                INNER JOIN CAT_MANZANAS D ON D.ID_MANZANA=C.ID_MANZANA
                INNER JOIN CAT_FRACCIONAMIENTOS E ON E.ID_FRACCIONAMIENTO=D.ID_FRACCIONAMIENTO
                INNER JOIN CLIENTES F ON F.ID_CLIENTE=B.ID_CLIENTE
                INNER JOIN CAT_COBRANZA_CLASIFICACION G ON G.ID_CLASIFICACION=A.ID_CLASIFICACION	
                WHERE 1=1
                ${where}  
                AND A.FECHA_ALTA BETWEEN '${fil_fecha_ini}' AND '${fil_fecha_fin} 23:59:59'
                ORDER BY A.FECHA_ALTA DESC
                  ) AA
                INNER JOIN CLIENTES BB ON AA.ID_CLIENTE=BB.ID_CLIENTE
               `;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
