import dbQuery from "@/lib/dbQuery";

export async function getEstatus() {
    const query = `SELECT ID_ESTATUS,ESTATUS FROM CAT_ESTATUS_CONTRATO WHERE BND_ACTIVO = TRUE`;
    const { rows } = await dbQuery(query);
    return rows;
}