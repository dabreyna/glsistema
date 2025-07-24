import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");
    const idServicio = searchParams.get("idServicio");
    const idEstatus = searchParams.get("idEstatus");
    const anio = searchParams.get("anio");
    const mes = searchParams.get("mes");

    let where = " ";

    if (idServicio != "0") {
        where += ` and a.id_servicio=${idServicio}`;
    }

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and  e.ID_FRACCIONAMIENTO=${idFraccionamiento}`;
    }

    if (idManzana != "" && idManzana != "0") {
        where += ` and d.id_manzana=${idManzana}`;
    }
    if (idTerreno != "" && idTerreno != "0") {
        where += ` and c.id_terreno=${idTerreno}`;
    }
    if (mes != "" && mes != "0") {
        where += ` and extract(Month from a.Fecha_Solicitud)=${mes}`;
    }
    if (anio != "" && anio != "0") {
        where += ` and extract(year from a.Fecha_Solicitud)=${anio}`;
    }
    if (idEstatus != "" && idEstatus != "-1") {
        where += ` and a.estado=${idEstatus}`;
    }

    const queryUpdateEstatus = `WITH UpdatedRows AS (
                                UPDATE ATENCION_A_CLIENTES
                                SET Estado = CASE
                                    WHEN estado = 1 AND (extract(DAY FROM (now() - Fecha_Solicitud)) > 15) AND id_servicio IN (471, 472, 475, 487) THEN 2
                                    WHEN estado = 1 AND (extract(DAY FROM (now() - Fecha_Solicitud)) > 90) AND id_servicio IN (479) THEN 2
                                    WHEN estado = 1 AND (extract(DAY FROM (now() - Fecha_Solicitud)) > 45) AND id_servicio IN (477) THEN 2
                                    WHEN estado = 1 AND (extract(DAY FROM (now() - Fecha_Solicitud)) > 4) AND id_servicio IN (500) THEN 2
                                    WHEN estado = 2 AND (extract(DAY FROM (now() - Fecha_Envio_Presupuesto)) > 20) AND id_servicio IN (500) THEN 0
                                    ELSE estado
                                END
                                WHERE id_servicio IN (471, 472, 475, 487, 479, 477, 500)
                                RETURNING 1 -- Devolver un valor para cada fila actualizada
                            )
                            SELECT COUNT(*) AS rows_updated FROM UpdatedRows;`;
    const update = await dbQuery(queryUpdateEstatus);
    if (update.rows[0].rows_updated > 0) {
        const query = `select xx.*,(select archivo from ATENCION_A_CLIENTES_DOCUMENTOS where id_solicitud=xx.id_solicitud_servicio order by fecha_carga desc limit 1)
                        from (
                        select concat(f.NOMBRE,' ',f.AP_PATERNO,' ',coalesce(f.AP_MATERNO,'')) as Cliente,
                        g.NOMBRE as NombreUsuario,
                        --e.FRACCIONAMIENTO,d.NO_MANZANA,c.NO_TERRENO,
                        concat(e.nomenclatura,'-',d.NO_MANZANA,'-',c.NO_TERRENO) as nomenclatura,
                        a.id_Solicitud_Servicio,a.id_Servicio,a.id_Contrato,a.id_Usuario,a.Estado,a.Medio_Solicitud,a.Transformador,a.Medio_Envio_Presupuesto,a.Cuenta_CESPM,a.Folio_Seguimiento_CFE,
                        to_char( a.Fecha_Solicitud, 'dd/MM/yyyy') AS Fecha_Solicitud,
                        to_char( a.Fecha_Marcado, 'dd/MM/yyyy') AS Fecha_Marcado,
                        to_char( a.Fecha_Carta_Lista_Entrega, 'dd/MM/yyyy') AS Fecha_Carta_Lista_Entrega,
                        to_char( a.Fecha_Entrega_Cliente, 'dd/MM/yyyy') AS Fecha_Entrega_Cliente,
                        to_char( a.Fecha_Compra, 'dd/MM/yyyy') AS Fecha_Compra,
                        to_char( a.Fecha_Envio, 'dd/MM/yyyy') AS Fecha_Envio,
                        to_char( a.Fecha_Carta_Recepcion_Cliente, 'dd/MM/yyyy') AS Fecha_Carta_Recepcion_Cliente,
                        to_char( a.Fecha_Instalacion_1, 'dd/MM/yyyy') AS Fecha_Instalacion_1,
                        to_char( a.Fecha_Instalacion_2, 'dd/MM/yyyy') AS Fecha_Instalacion_2,
                        to_char( a.Fecha_Solicitud_Presupuesto, 'dd/MM/yyyy') AS Fecha_Solicitud_Presupuesto,
                        to_char( a.Fecha_Presupuesto_Recibido, 'dd/MM/yyyy') AS Fecha_Presupuesto_Recibido,
                        to_char( a.Fecha_Revision_Contraloria, 'dd/MM/yyyy') AS Fecha_Revision_Contraloria,
                        to_char( a.Fecha_Presupuesto_Autorizado, 'dd/MM/yyyy') AS Fecha_Presupuesto_Autorizado,
                        to_char( a.Fecha_Entrega_Paquete, 'dd/MM/yyyy') AS Fecha_Entrega_Paquete,
                        to_char( a.Fecha_Presupuesto_Conexion, 'dd/MM/yyyy') AS Fecha_Presupuesto_Conexion,
                        to_char( a.Fecha_Pago_Presupuesto, 'dd/MM/yyyy') AS Fecha_Pago_Presupuesto,
                        to_char( a.Fecha_Conexion, 'dd/MM/yyyy') AS Fecha_Conexion,
                        to_char( a.Fecha_Solicitud_Contrato, 'dd/MM/yyyy') AS Fecha_Solicitud_Contrato,
                        to_char( a.Fecha_Instalacion_Medidor, 'dd/MM/yyyy') AS Fecha_Instalacion_Medidor,
                        to_char( a.Fecha_Envio_Presupuesto, 'dd/MM/yyyy') AS Fecha_Envio_Presupuesto,
                        to_char( a.Fecha_Pago_Anticipo, 'dd/MM/yyyy') AS Fecha_Pago_Anticipo,
                        to_char( a.Fecha_Envio_Contrato_CESPM, 'dd/MM/yyyy') AS Fecha_Envio_Contrato_CESPM,
                        to_char( a.Fecha_Descubrimiento, 'dd/MM/yyyy') AS Fecha_Descubrimiento,
                        to_char( a.Fecha_Medidor_CESPM, 'dd/MM/yyyy') AS Fecha_Medidor_CESPM,
                        to_char( a.Fecha_Envio_Solicitud_CFE, 'dd/MM/yyyy') AS Fecha_Envio_Solicitud_CFE,
                        to_char( a.Fecha_Medidor_CFE, 'dd/MM/yyyy') AS Fecha_Medidor_CFE,

                        extract (DAY from (now()-a.Fecha_Solicitud)) AS dias,
                        extract (DAY from (now()-a.Fecha_Envio_Presupuesto)) AS dias2
                        -- aqui quiero la consulta que actualice el a.Estado=2 cuando now() - a.Fecha_Solicitud es menor a la fecha actual > 15 dias
                        -- y el a.id_servicio =471

                    from ATENCION_A_CLIENTES a
                    inner join CONTRATOS_TERRENOS b on b.ID_CONTRATO=a.id_Contrato
                    inner join CAT_TERRENOS c on c.ID_TERRENO=b.ID_TERRENO
                    inner join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
                    inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
                    inner join CLIENTES f on f.ID_CLIENTE=b.ID_CLIENTE
                    inner join cat_USUARIOS g on g.id_USUARIO=a.id_Usuario
                    where 1=1 
                    ${where}  
                    order by a.Fecha_Solicitud asc) xx
    `;
        const tempData = await dbQuery(query);
        return NextResponse.json(tempData.rows, { status: 200 });
    }
    return NextResponse.json("", { status: 200 });
}
