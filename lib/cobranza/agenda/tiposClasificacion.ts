import dbQuery from "@/lib/dbQuery";


export async function getClasificacion() {
    const query = `select id_clasificacion,clasificacion from cat_cobranza_clasificacion where bnd_activo=true ORDER BY CLASIFICACION ASC;
`;
    const { rows } = await dbQuery(query);
    return rows;
}