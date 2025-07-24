import dbQuery from "@/lib/dbQuery";

export async function getComentarios(idCliente: string) {
    const query = `SELECT TO_CHAR(FECHA_COMENTARIO,'DD/MM/YYYY') AS FECHA_COMENTARIO,COMENTARIO,DONDE,RESPONSABLE
                   FROM (
                        SELECT A.FECHA_ALTA AS FECHA_COMENTARIO,COMENTARIO,'VENTAS' AS DONDE,CONCAT(B.NOMBRE,' ',B.AP_PATERNO,' ',COALESCE(B.AP_MATERNO,'')) AS RESPONSABLE,A.ID_CLIENTE
                        FROM AGENDA A
                        INNER JOIN CAT_USUARIOS B ON B.ID_USUARIO=A.ID_USUARIO
                        UNION
                        SELECT A.FECHA_COMENTARIO AS FECHA_COMENTARIO,COMENTARIO,'CAJA' AS DONDE,CONCAT(B.NOMBRE,' ',B.AP_PATERNO,' ',COALESCE(B.AP_MATERNO,'')) AS RESPONSABLE,C.ID_CLIENTE
                        FROM COMENTARIOS_CAJA A
                        INNER JOIN CAT_USUARIOS B ON B.ID_USUARIO=A.ID_USUARIO
                        INNER JOIN CONTRATOS_TERRENOS C ON C.ID_CONTRATO=A.ID_CONTRATO
                        UNION
                        SELECT A.FECHA_ALTA AS FECHA_COMENTARIO,COMENTARIO,'COBRANZA' AS DONDE,CONCAT(B.NOMBRE,' ',B.AP_PATERNO,' ',COALESCE(B.AP_MATERNO,'')) AS RESPONSABLE,C.ID_CLIENTE
                        FROM AGENDA_COBRANZA A
                        INNER JOIN CAT_USUARIOS B ON B.ID_USUARIO=A.ID_USUARIO
                        INNER JOIN CONTRATOS_TERRENOS C ON C.ID_CONTRATO=A.ID_CONTRATO
                        )AA 
                   WHERE ID_CLIENTE=${idCliente}
                        AND FECHA_COMENTARIO IS NOT NULL 
                        AND COMENTARIO IS NOT NULL
                   ORDER BY AA.FECHA_COMENTARIO DESC`;
                   
    const { rows } = await dbQuery(query);
    return rows;
}