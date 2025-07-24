import dbQuery from "@/lib/dbQuery";

export async function getAsesores() {
    const query = `SELECT ID_USUARIO,UPPER(CONCAT(NOMBRE,' ',AP_PATERNO,' ',COALESCE(AP_MATERNO, ''))) AS NOMBRE_ASESOR
                   FROM CAT_USUARIOS
                   WHERE
                       PERFIL_USUARIO IN(4)
                       AND ESTATUS = 1
                   ORDER BY NOMBRE_ASESOR ASC;`;
    const { rows } = await dbQuery(query);
    // console.log(rows);
    return rows;
}