import dbQuery from "@/lib/dbQuery";

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
