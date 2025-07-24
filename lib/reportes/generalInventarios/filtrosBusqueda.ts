import dbQuery from '@/lib/dbQuery';

export async function getListadoFraccionamientos() {
    const query = `SELECT FRACCIONAMIENTO,ID_FRACCIONAMIENTO FROM CAT_FRACCIONAMIENTOS WHERE BND_ACTIVO=TRUE ORDER BY FRACCIONAMIENTO ASC`;
    const { rows } = await dbQuery(query);
    return rows;
}
export async function getListadoFinanciamientos() {
    let query = `SELECT FINANCIAMIENTO,PORCENTAJE,ID_FINANCIAMIENTO,NO_PAGOS FROM CAT_FINANCIAMIENTOS WHERE BND_ACTIVO = TRUE`;
    const { rows } = await dbQuery(query);
    return rows;
}

