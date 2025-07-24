import dbQuery from '@/lib/dbQuery';

export async function getContrato(idContrato: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE id_contrato = ${idContrato}`;
    const { rows } = await dbQuery(query);
    return rows[0];
}

export async function getContratosPorIdCliente(idCliente: string) {
    const query = `SELECT A.ID_CLIENTE,A.ID_CONTRATO,CONCAT(D.NOMENCLATURA,'-',C.NO_MANZANA,'-',B.NO_TERRENO) AS TERRENO,A.ID_TERRENO
                    FROM CONTRATOS_TERRENOS A
                    INNER JOIN CAT_TERRENOS B ON A.ID_TERRENO = B.ID_TERRENO
                    INNER JOIN CAT_MANZANAS C ON B.ID_MANZANA = C.ID_MANZANA
                    INNER JOIN CAT_FRACCIONAMIENTOS D ON C.ID_FRACCIONAMIENTO = D.ID_FRACCIONAMIENTO
                    WHERE A.ID_CLIENTE = ${idCliente}
                        AND A.ID_ESTATUS_CONTRATO not IN(3,6,7,8)`;
    const { rows } = await dbQuery(query);
    return rows;
}
export async function getContratosPorIdClienteOrdenados(idCliente: string) {
    const query = `SELECT A.ID_CLIENTE,A.ID_CONTRATO,CONCAT(D.NOMENCLATURA,'-',C.NO_MANZANA,'-',B.NO_TERRENO) AS TERRENO,A.ID_TERRENO,a.id_estatus_contrato
                    FROM CONTRATOS_TERRENOS A
                    INNER JOIN CAT_TERRENOS B ON A.ID_TERRENO = B.ID_TERRENO
                    INNER JOIN CAT_MANZANAS C ON B.ID_MANZANA = C.ID_MANZANA
                    INNER JOIN CAT_FRACCIONAMIENTOS D ON C.ID_FRACCIONAMIENTO = D.ID_FRACCIONAMIENTO
                    WHERE A.ID_CLIENTE = ${idCliente}
                        AND A.ID_ESTATUS_CONTRATO not IN(3,6,7,8) order by a.id_estatus_contrato asc,terreno asc`;
    const { rows } = await dbQuery(query);
    return rows;
}
// export async function getContratosPorIdCliente(idCliente: string) {
//     const query = `SELECT id_contrato FROM contratos_terrenos WHERE id_cliente= ${idCliente} and id_estatus_contrato in(1)`;
//     const { rows } = await dbQuery(query);
//     return rows;
// }

export async function getContratos() {
    const query = `SELECT * FROM contratos_terrenos`;
    const { rows } = await dbQuery(query);
    return rows;
}



export async function getContratosPorApellido(apellido: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE nombre_contrato LIKE '%${apellido}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorNombre(nombre: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE nombre_contrato LIKE '%${nombre}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorApPaterno(apPaterno: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE ap_paterno LIKE '%${apPaterno}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorApMaterno(apMaterno: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE ap_materno LIKE '%${apMaterno}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorEmail(email: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE email LIKE '%${email}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorTelefono(telefono: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE telefono LIKE '%${telefono}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorDireccion(direccion: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE direccion LIKE '%${direccion}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorCiudad(ciudad: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE ciudad LIKE '%${ciudad}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorProvincia(provincia: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE provincia LIKE '%${provincia}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorPais(pais: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE pais LIKE '%${pais}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorTerreno(terreno: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE terreno LIKE '%${terreno}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}



export async function getContratosPorEstadoCivil(estadoCivil: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE estado_civil LIKE '%${estadoCivil}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorNacionalidad(nacionalidad: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE nacionalidad LIKE '%${nacionalidad}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorFechaNacimiento(fechaNacimiento: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE fecha_nacimiento LIKE '%${fechaNacimiento}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorFechaNacimientoDesde(fechaNacimientoDesde: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE fecha_nacimiento >= ${fechaNacimientoDesde}`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorFechaNacimientoHasta(fechaNacimientoHasta: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE fecha_nacimiento <= ${fechaNacimientoHasta}`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getContratosPorFechaNacimientoEntre(fechaNacimientoDesde: string, fechaNacimientoHasta: string) {
    const query = `SELECT * FROM contratos_terrenos WHERE fecha_nacimiento BETWEEN ${fechaNacimientoDesde} AND ${fechaNacimientoHasta}`;
    const { rows } = await dbQuery(query);
    return rows;
}