import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    if (!idContrato) {
        return NextResponse.json({ error: 'El parámetro "idContrato" es requerido.' }, { status: 400 });
    }
    let query = `SELECT A.COMENTARIO,TO_CHAR(A.FECHA_COMPROMISO,'DD/MM/YYYY')AS FECHA_COMPROMISO,CONCAT(B.NOMBRE,' ',B.AP_PATERNO) AS USUARIO  
FROM AGENDA_COBRANZA A
INNER JOIN CAT_USUARIOS B ON A.ID_USUARIO=B.ID_USUARIO
WHERE ID_CONTRATO = ${idContrato}
	AND A.BND_MOSTRAR_CAJA = TRUE --false --colocar false solo como demostracion ya que actualmente no hay mensajes marcados como no atendidos
	AND COALESCE(A.BND_ATENDIDO,FALSE) = FALSE
	AND A.FECHA_ALTA =(SELECT MAX(FECHA_ALTA) FROM AGENDA_COBRANZA WHERE ID_CONTRATO = A.ID_CONTRATO AND BND_MOSTRAR_CAJA = A.BND_MOSTRAR_CAJA
				AND COALESCE(BND_ATENDIDO,FALSE) = COALESCE(A.BND_ATENDIDO,FALSE)) 
             `;
    let tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
