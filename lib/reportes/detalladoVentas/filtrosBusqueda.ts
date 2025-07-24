import dbQuery from '@/lib/dbQuery';

export async function getAsesoresActivos() {
    const query = `select id_usuario,concat(nombre,' ',ap_paterno,' ', coalesce(ap_materno,'')) as nombre from cat_usuarios where estatus=1 and perfil_usuario in (2,3) order by nombre`;
    const { rows } = await dbQuery(query);
    return rows;
}
export async function getAsesoresInactivos() {
    let query = `select id_usuario,concat(nombre,' ',ap_paterno,' ', coalesce(ap_materno,'')) as nombre from cat_usuarios where estatus not in(1) and perfil_usuario in (2,3) order by nombre`; 
    const { rows } = await dbQuery(query);
    return rows;
}
export async function getEstatusContrato(){
let query=`select id_estatus,estatus from cat_estatus_contrato where bnd_activo=true order by estatus asc`;
const { rows } = await dbQuery(query);
return rows;
} 