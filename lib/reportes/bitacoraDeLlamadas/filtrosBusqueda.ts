import dbQuery from "@/lib/dbQuery";

export async function getAsesores() {
    const query = `SELECT ID_USUARIO,UPPER(CONCAT(NOMBRE,' ',AP_PATERNO,' ',COALESCE(AP_MATERNO, ''))) AS NOMBRE_ASESOR
                   FROM
                       CAT_USUARIOS
                   WHERE
                       PERFIL_USUARIO IN(4)
                       AND ESTATUS = 1
                   ORDER BY NOMBRE_ASESOR ASC;
`;
    const { rows } = await dbQuery(query);
    // console.log(rows);
    return rows;
}

export async function getClasificacion() {
    const query = `SELECT ID_CLASIFICACION,CLASIFICACION FROM CAT_COBRANZA_CLASIFICACION WHERE BND_ACTIVO=TRUE ORDER BY CLASIFICACION ASC;
`;
    const { rows } = await dbQuery(query);
    return rows;
}