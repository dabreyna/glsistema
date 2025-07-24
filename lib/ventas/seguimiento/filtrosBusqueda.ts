import dbQuery from "@/lib/dbQuery";

export async function getAsesores() {
    const query = `SELECT id_USUARIO,NOMBRE||' '||AP_PATERNO||' '||coalesce(AP_MATERNO,'') AS NOMBRE_ASESOR FROM CAT_USUARIOS WHERE perfil_usuario=2 and estatus=1
                   ORDER BY NOMBRE_ASESOR ASC;
`;
    const { rows } = await dbQuery(query);
    // console.log(rows);
    return rows;
}

export async function getClasificacion() {
    const query = `SELECT ID_CLASIFICACION,CLASIFICACION FROM cat_ventas_clasificacion WHERE BND_ACTIVO=TRUE ORDER BY CLASIFICACION ASC;
`;
    const { rows } = await dbQuery(query);
    return rows;
}