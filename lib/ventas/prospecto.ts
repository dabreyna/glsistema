import dbQuery from '@/lib/dbQuery';
// import { id } from 'date-fns/locale';

interface Prospecto {
  id_cliente: string;
  abreviatura: string | null;
  nombre: string;
  ap_paterno: string | null;
  ap_materno: string | null;
  fecha_nacimiento: string | null;
  sexo: string | null;
  lugar_nacimiento: string | null;
  ocupacion: string | null;
  calle: string | null;
  numero: string | null;
  entre: string | null;
  ciudad: string | null;
  cp: string | null;
  colonia: string | null;
  estado: string | null;
  pais: string | null;
  tel_cod_casa: string | null;
  tel_casa: string | null;
  tel_cod_cel: string | null;
  tel_cel: string | null;
  tel_cod_trabajo: string | null;
  tel_trabajo: string | null;
  email: string | null;
  lugar_trabajo: string | null;
  domicilio_trabajo: string | null;
  conyuge: string | null;
  estado_civil: string | null;
  nacionalidad: string | null;
  fecha_alta: string | null;
  id_usuario: string | null;
  ultimo_modificacion: string | null;
  id_estatus_prospecto: string | null;
  bnd_interesado_prospecto: string | null;
  id_medio_publicitario: string | null;
  tel_usa_cel: string | null;
  tel_usa_casa: string | null;
  tel_usa_oficina: string | null;
  notas: string | null;
  fecha_correo: string | null;
  id_asesor_cobranza: string | null;
}

export async function getProspectoID(idProspecto: string) {
    const query = `SELECT COALESCE((SELECT ID_CLIENTE FROM CLIENTES WHERE ID_CLIENTE=${idProspecto}),0) as idProspecto;`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getCliente(idProspecto: string) {
  const query = `SELECT * FROM CLIENTES WHERE ID_CLIENTE=${idProspecto};`;
  const tempData = await dbQuery(query);
  return tempData.rows;
}

export async function getTiposEstadoCivil() {
  const query = `SELECT id_estado,estado FROM CAT_ESTADO_CIVIL;`;
  const tempData = await dbQuery(query);
  return tempData.rows;
}

export async function getTiposMediosPublicitarios() {
  const query = `SELECT id_medio,medio FROM CAT_MEDIOS_PUBLICITARIOS ORDER BY MEDIO ASC;`;
  const tempData = await dbQuery(query);
  return tempData.rows;
}

export async function getFraccionamientos() {
  const query = `SELECT a.id_fraccionamiento,a.fraccionamiento FROM cat_fraccionamientos a
inner join cat_manzanas b on a.id_fraccionamiento=b.id_fraccionamiento
inner join cat_terrenos c on b.id_manzana=c.id_manzana
where a.BND_ACTIVO=true and c.estatus=1
GROUP BY a.id_fraccionamiento,a.fraccionamiento
order by fraccionamiento asc`;
  const tempData = await dbQuery(query);
  return tempData.rows;
}

export async function getFinanciamientos() {
  const query = `select * from cat_financiamientos where bnd_activo=true order by financiamiento asc`;
  const tempData = await dbQuery(query);
  return tempData.rows;
}

export async function getTipoVenta(){
  const query = `select id_estatus,estatus from CAT_ESTATUS_CONTRATO_VENTAS where bnd_activo=true ORDER BY estatus`;
  const tempData = await dbQuery(query);
  return tempData.rows;
}

export async function getTipoCambio(){
  const query = `select tipo_cambio from cat_tipo_cambio  where bnd_activo=true order BY fecha_inicio desc LIMIT 1`;
  const tempData = await dbQuery(query);
  return tempData.rows;
}

export async function getIDTerreno(idContrato: string) {
  const query = `select id_terreno from contratos_terrenos where id_contrato=${idContrato};`;
  const idTerreno = await dbQuery(query);
  return idTerreno.rows[0].id_terreno;
}