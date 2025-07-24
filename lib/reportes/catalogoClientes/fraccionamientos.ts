import dbQuery from "@/lib/dbQuery";

export async function getFraccionamientos() {
    const query = `SELECT ID_FRACCIONAMIENTO,FRACCIONAMIENTO FROM CAT_FRACCIONAMIENTOS WHERE BND_ACTIVO = TRUE ORDER BY FRACCIONAMIENTO ASC`;
    const { rows } = await dbQuery(query);
    return rows;
}