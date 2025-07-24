import dbQuery from '@/lib/dbQuery';

export async function getListadoServicios() {
    const query = `select id_servicio,servicio from cat_servicios where bnd_activo is true`;
    const rows  = await dbQuery(query);
    return rows.rows;
}
