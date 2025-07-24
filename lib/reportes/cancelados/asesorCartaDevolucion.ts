import dbQuery from '@/lib/dbQuery';

export async function getListadoAsesores() {
    const query = `SELECT distinct(a.id_usuario),concat(b.nombre,' ',b.ap_paterno,' ',coalesce(b.ap_materno,'')) as asesor
                    FROM public.cobranza_cartas_devolucion a
                    inner join cat_usuarios b on a.id_usuario=b.id_usuario
                    order by asesor asc`;
    const { rows } = await dbQuery(query);
    return rows;
}
