import dbQuery from '@/lib/dbQuery';

export async function getListadoFraccionamientos() {
    const query = `SELECT ID_FRACCIONAMIENTO,FRACCIONAMIENTO FROM CAT_FRACCIONAMIENTOS WHERE BND_ACTIVO=TRUE ORDER BY FRACCIONAMIENTO ASC`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getListadoAjustesAnuales() {
    const query = `SELECT DISTINCT ANIO FROM AJUSTE_ANUAL ORDER BY ANIO`;
    const { rows } = await dbQuery(query);
    return rows;
}