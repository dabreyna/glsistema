import dbQuery from "@/lib/dbQuery";

export async function getAsesoresActivos() {
    const query = `SELECT ID_USUARIO,UPPER(CONCAT(NOMBRE,' ',AP_PATERNO,' ',COALESCE(AP_MATERNO, ''))) AS NOMBRE_ASESOR
                   FROM
                       CAT_USUARIOS
                   WHERE
                       PERFIL_USUARIO IN(4)
                       AND ESTATUS = 1
                   ORDER BY NOMBRE_ASESOR ASC;`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getFraccionamientos() {
    const query = `SELECT ID_FRACCIONAMIENTO,FRACCIONAMIENTO FROM CAT_FRACCIONAMIENTOS WHERE BND_ACTIVO=TRUE
                   ORDER BY FRACCIONAMIENTO ASC;`;
    const { rows } = await dbQuery(query);
    return rows;
}
export async function getClasificaciones() {
    const query = `SELECT ID_CLASIFICACION,CLASIFICACION FROM CAT_COBRANZA_CLASIFICACION WHERE BND_ACTIVO=TRUE
                   ORDER BY CLASIFICACION ASC;`;
    const { rows } = await dbQuery(query);
    return rows;
}
export async function getVencimientos() {
    const query = `SELECT ID_TIPO_VENCIMIENTO,VENCIMIENTO FROM CAT_TIPO_VENCIMIENTO
                   ORDER BY VENCIMIENTO ASC;`;
    const { rows } = await dbQuery(query);
    return rows;
}