import dbQuery from '@/lib/dbQuery';

export async function getEmpresas() {
    const query = `SELECT ID_EMPRESA,NOMBRE,RAZON_SOCIAL,RFC,CIUDAD,DIRECCION,REPRESENTANTE_LEGAL,telefono_principal,EMAIL,estado FROM CAT_EMPRESAS WHERE 1=1`;
    const { rows } = await dbQuery(query);
    return rows;
}
