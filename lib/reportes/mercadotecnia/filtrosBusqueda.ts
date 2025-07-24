import dbQuery from "@/lib/dbQuery";

export async function getMediosPublicitarios() {
    const query = `SELECT ID_MEDIO,MEDIO FROM CAT_MEDIOS_PUBLICITARIOS WHERE BND_ACTIVO = TRUE`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getEstatus() {
    const query = `SELECT ID_ESTATUS,ESTATUS FROM CAT_ESTATUS_contrato WHERE BND_ACTIVO = TRUE`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getAsesores() {
    const query = `SELECT ID_USUARIO,UPPER(CONCAT(NOMBRE,' ',AP_PATERNO,' ',COALESCE(AP_MATERNO, ''))) AS NOMBRE_ASESOR
                   FROM
                       CAT_USUARIOS
                   WHERE
                       PERFIL_USUARIO IN(2, 3)
                       AND ESTATUS = 1
                   ORDER BY NOMBRE_ASESOR ASC;
`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getAsesoresInactivos() {
    const query = `SELECT ID_USUARIO,UPPER(CONCAT(NOMBRE,' ',AP_PATERNO,' ',COALESCE(AP_MATERNO, ''))) AS NOMBRE_ASESOR
                   FROM
                       CAT_USUARIOS
                   WHERE
                       PERFIL_USUARIO IN(2, 3)
                       AND ESTATUS = 3
                   ORDER BY NOMBRE_ASESOR ASC;
`;
    const { rows } = await dbQuery(query);
    return rows;
}
