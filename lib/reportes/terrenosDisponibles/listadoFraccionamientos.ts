import dbQuery from '@/lib/dbQuery';

export async function getListadoFraccionamientos() {
    const query = `SELECT C.ID_FRACCIONAMIENTO,C.FRACCIONAMIENTO
                    FROM CAT_TERRENOS A
                    INNER JOIN CAT_MANZANAS B ON A.ID_MANZANA = B.ID_MANZANA
                    INNER JOIN CAT_FRACCIONAMIENTOS C ON B.ID_FRACCIONAMIENTO = C.ID_FRACCIONAMIENTO
                    WHERE A.BND_ACTIVO = TRUE AND A.ESTATUS = 1
                    GROUP BY C.ID_FRACCIONAMIENTO,C.FRACCIONAMIENTO
                    ORDER BY C.FRACCIONAMIENTO ASC`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getDatosGenerales() {
    const query = `SELECT TO_CHAR(COUNT(ID_TERRENO),'99,999') AS TOTAL_TERRENOS,TO_CHAR(SUM(TOTAL_TERRENO),'$ 999,999,999,999.99') AS TOTAL_VALOR,
                      TO_CHAR(SUM(SUPERFICIE),'999,999,999,999,999.99 m2') AS TOTAL_SUPERFICIE
               FROM (SELECT ID_TERRENO,SUPERFICIE,TOTAL_TERRENO FROM CAT_TERRENOS WHERE BND_ACTIVO = TRUE AND ESTATUS = 1 )`;
    const { rows } = await dbQuery(query);
    return rows[0];
}