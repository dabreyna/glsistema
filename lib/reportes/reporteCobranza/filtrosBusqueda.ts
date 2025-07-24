import dbQuery from "@/lib/dbQuery";

export async function getEmpresas() {
    const query = `SELECT RAZON_SOCIAL,ID_EMPRESA FROM CAT_EMPRESAS ORDER BY RAZON_SOCIAL ASC`;
    const { rows } = await dbQuery(query);
    return rows;
}
export async function getEstaciones() {
    const query = `SELECT ID_ESTACION,NOMBRE FROM CAT_ESTACIONES ORDER BY NOMBRE ASC`;
    const { rows } = await dbQuery(query);
    return rows;
}
export async function getUsuarios() {
    const query = `SELECT ID_USUARIO,UPPER(CONCAT(NOMBRE,' ',AP_PATERNO,' ',COALESCE(AP_MATERNO, ''))) AS NOMBRE_USUARIO
                   FROM
                       CAT_USUARIOS
                   WHERE
                       ESTATUS = 1
                   ORDER BY NOMBRE_USUARIO ASC;
`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getUsuariosInactivos() {
    const query = `SELECT ID_USUARIO,UPPER(CONCAT(NOMBRE,' ',AP_PATERNO,' ',COALESCE(AP_MATERNO, ''))) AS NOMBRE_USUARIO
                   FROM
                       CAT_USUARIOS
                   WHERE
                       ESTATUS = 3
                   ORDER BY NOMBRE_USUARIO ASC;
`;
    const { rows } = await dbQuery(query);
    return rows;
}
