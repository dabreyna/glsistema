import dbQuery from '@/lib/dbQuery';

export async function getCliente(idCliente: string) {
    const query = `SELECT * FROM clientes WHERE id_cliente = ${idCliente}`;
    const { rows } = await dbQuery(query);
    // console.log(rows);
    return rows[0];
}

export async function getClientes() {
    const query = `SELECT * FROM cliente`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorApellido(apellido: string) {
    const query = `SELECT * FROM cliente WHERE nombre_cliente LIKE '%${apellido}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorNombre(nombre: string) {
    const query = `SELECT * FROM cliente WHERE nombre_cliente LIKE '%${nombre}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorApPaterno(apPaterno: string) {
    const query = `SELECT * FROM cliente WHERE ap_paterno LIKE '%${apPaterno}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorApMaterno(apMaterno: string) {
    const query = `SELECT * FROM cliente WHERE ap_materno LIKE '%${apMaterno}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorEmail(email: string) {
    const query = `SELECT * FROM cliente WHERE email LIKE '%${email}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorTelefono(telefono: string) {
    const query = `SELECT * FROM cliente WHERE telefono LIKE '%${telefono}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorDireccion(direccion: string) {
    const query = `SELECT * FROM cliente WHERE direccion LIKE '%${direccion}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorCiudad(ciudad: string) {
    const query = `SELECT * FROM cliente WHERE ciudad LIKE '%${ciudad}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorProvincia(provincia: string) {
    const query = `SELECT * FROM cliente WHERE provincia LIKE '%${provincia}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorPais(pais: string) {
    const query = `SELECT * FROM cliente WHERE pais LIKE '%${pais}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorTerreno(terreno: string) {
    const query = `SELECT * FROM cliente WHERE terreno LIKE '%${terreno}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorIdContrato(idContrato: string) {
    const query = `SELECT * FROM cliente WHERE id_contrato LIKE '%${idContrato}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorEstadoCivil(estadoCivil: string) {
    const query = `SELECT * FROM cliente WHERE estado_civil LIKE '%${estadoCivil}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorNacionalidad(nacionalidad: string) {
    const query = `SELECT * FROM cliente WHERE nacionalidad LIKE '%${nacionalidad}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorFechaNacimiento(fechaNacimiento: string) {
    const query = `SELECT * FROM cliente WHERE fecha_nacimiento LIKE '%${fechaNacimiento}%'`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorFechaNacimientoDesde(fechaNacimientoDesde: string) {
    const query = `SELECT * FROM cliente WHERE fecha_nacimiento >= ${fechaNacimientoDesde}`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorFechaNacimientoHasta(fechaNacimientoHasta: string) {
    const query = `SELECT * FROM cliente WHERE fecha_nacimiento <= ${fechaNacimientoHasta}`;
    const { rows } = await dbQuery(query);
    return rows;
}

export async function getClientesPorFechaNacimientoEntre(fechaNacimientoDesde: string, fechaNacimientoHasta: string) {
    const query = `SELECT * FROM cliente WHERE fecha_nacimiento BETWEEN ${fechaNacimientoDesde} AND ${fechaNacimientoHasta}`;
    const { rows } = await dbQuery(query);
    return rows;
}