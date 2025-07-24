import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import moment from "moment";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    let fInicio = searchParams.get("fInicio");
    let fFin = searchParams.get("fFin");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();

    let where = "";

    if (nombreCliente) {
        const words = nombreCliente.split(" ");

        words.forEach((word) => {
            where += ` AND CONCAT(c.NOMBRE,' ',c.AP_PATERNO,' ',COALESCE(c.AP_MATERNO, '')) ILIKE '%${word}%'`;
        });
    }
    if (!nombreCliente && !fInicio && !fFin) {
        const now = moment();
        fInicio = now.startOf("month").format("YYYY-MM-DD");
        fFin = now.endOf("month").format("YYYY-MM-DD");
    }
    if (fInicio && fFin) {
        where += ` and a.fecha_comentario between '${fInicio}' AND '${fFin} 23:59:59'`;
    }
    let query = "";
    query = `SELECT TO_CHAR(A.FECHA_COMENTARIO,'DD/MM/YYYY') AS FECHA,CONCAT(C.NOMBRE,' ',C.AP_PATERNO,' ',COALESCE(C.AP_MATERNO,'')) AS NOMBRE_CLIENTE
            ,A.COMENTARIO,CONCAT(D.NOMBRE,' ',D.AP_PATERNO,' ',COALESCE(D.AP_MATERNO,'')) AS NOMBRE_ASESOR
            ,CONCAT(G.NOMENCLATURA,'-',F.NO_MANZANA,'-',E.NO_TERRENO) AS TERRENO,A.ID_COMENTARIO
            ,D.ID_USUARIO
            FROM COMENTARIOS_CAJA A
            INNER JOIN CONTRATOS_TERRENOS B ON A.ID_CONTRATO = B.ID_CONTRATO
            INNER JOIN CLIENTES C ON B.ID_CLIENTE = C.ID_CLIENTE
            INNER JOIN CAT_USUARIOS D ON A.ID_USUARIO = D.ID_USUARIO
            INNER JOIN CAT_TERRENOS E ON B.ID_TERRENO = E.ID_TERRENO
            INNER JOIN CAT_MANZANAS F ON E.ID_MANZANA = F.ID_MANZANA
            INNER JOIN CAT_FRACCIONAMIENTOS G ON F.ID_FRACCIONAMIENTO = G.ID_FRACCIONAMIENTO
            WHERE 1 = 1 
            ${where}
            ORDER BY A.FECHA_COMENTARIO DESC`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
