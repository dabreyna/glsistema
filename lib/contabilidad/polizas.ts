import dbQuery from "@/lib/dbQuery";

export async function getPolizas() {
    const query = `SELECT TO_CHAR(A.FECHA_INICIO,'DD/MM/YYYY') AS FECHA_INICIO,TO_CHAR(A.FECHA_FIN,'DD/MM/YYYY') AS FECHA_FIN
                  ,A.CONCEPTO_POLIZA,A.ID_POLIZA,coalesce(A.BND_CONTABILIZADO,'False') as BND_CONTABILIZADO--,TO_CHAR(A.FECHA_INICIO,'DD/MM/YYYY') AS FECHA_INICIO1,TO_CHAR(A.FECHA_FIN,'DD/MM/YYYY') AS FECHA_FIN1
                  ,A.ID_EMPRESA,B.NOMBRE
                  FROM CONTABILIDAD_POLIZAS A 
                  INNER JOIN CAT_EMPRESAS B ON B.ID_EMPRESA=A.ID_EMPRESA
                  WHERE EXTRACT(YEAR FROM A.FECHA_INICIO)>=EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 YEAR')
                  ORDER BY a.id_poliza DESC;`;
    const { rows } = await dbQuery(query);
    // console.log(rows);
    return rows;
}
