import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import moment from "moment";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idSolicitud = searchParams.get("id_solicitud_servicio");
    let newData = searchParams.get("newData");
    const fechaMoment = moment(newData, "DD/MM/YYYY", true);
    const col = searchParams.get("col");
    const modulo = Number(searchParams.get("modulo"));

    let field = "";
    let field2 = "";
    let extra = "";
    let extra2 = "";
    let tabla1 = "";

    if (fechaMoment.isValid()) {
        newData = fechaMoment.format("YYYY-MM-DD");
    }

    switch (modulo) {
        case 1:
            tabla1 = "ATENCION_A_CLIENTES";
            break;
        case 2:
            tabla1 = "ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS";
            break;
        case 3:
            tabla1 = "ATENCION_A_CLIENTES_ESCRITURAS";
            break;
        case 4:
            tabla1 = "ATENCION_A_CLIENTES";
            break;
    }
    if (modulo == 2) {
        switch (col) {
            case "c_3":
                field = "no_transformador";
                break;
            case "c_4":
                field = "transformador_instalado";
                break;
            case "c_5":
                field = "transformador_en_uso";
                break;
            case "c_6":
                field = "servicio_de_luz";
                break;
            case "c_7":
                field = "servicio_de_agua";
                break;
            case "c_8":
                field = "biodigestor";
                break;
            case "c_9":
                field = "solicitud_de_marcado";
                break;
            case "c_10":
                field = "carta_finiquito";
                break;
            case "c_11":
                field = "escrituras";
                break;
            case "c_12":
                field = "clave_catastral";
                break;
            case "c_13":
                field = "obra_hidraulica";
                break;
            default:
                break;
        }
        field2 = "id";
    } else if (modulo == 1) {
        switch (col) {
            case "c_5":
                field = "Estado";
                break;
            case "c_6":
                field = "medio_solicitud";
                break;
            case "c_7": {
                field = "Transformador";
                extra2 = `update ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS set no_transformador=(select Transformador from ATENCION_A_CLIENTES where id_solicitud_servicio=${idSolicitud})
                                where id_terreno=(select b.ID_TERRENO from ATENCION_A_CLIENTES a
                                                                inner join CONTRATOS_TERRENOS b on a.id_contrato=b.ID_CONTRATO
                                                                where a.id_solicitud_servicio=${idSolicitud})`;
                break;
            }

            case "c_9":
                field = "fecha_marcado";
                break;
            case "c_10":
                field = "fecha_carta_lista_entrega";
                break;
            case "c_11": {
                field = "fecha_entrega_cliente";
                extra = ", estado=3";
                extra2 = `update ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS set solicitud_de_marcado='${newData}'   
                where id_terreno=(select b.ID_TERRENO from ATENCION_A_CLIENTES a
                            inner join CONTRATOS_TERRENOS b on a.id_contrato=b.ID_CONTRATO
                            where a.id_solicitud_servicio=${idSolicitud})`;
                break;
            }
            case "c_12":
                field = "fecha_compra";
                break;
            case "c_13":
                field = "fecha_envio";
                break;
            case "c_14":
                field = "fecha_carta_recepcion_cliente";
                break;
            case "c_15":
                field = "fecha_instalacion_1";
                break;
            case "c_16": {
                field = "fecha_instalacion_2";
                extra = ", Estado=3 ";
                extra2 = `update ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS set biodigestor='${newData}'   
                where id_terreno=(select b.ID_TERRENO from ATENCION_A_CLIENTES a
                            inner join CONTRATOS_TERRENOS b on a.id_contrato=b.ID_CONTRATO
                            where a.id_solicitud_servicio=${idSolicitud})`;
                break;
            }

            case "c_17":
                field = "fecha_solicitud_presupuesto";
                break;
            case "c_18":
                field = "fecha_presupuesto_recibido";
                break;
            case "c_19":
                field = "fecha_revision_contraloria";
                break;
            case "c_20":
                field = "fecha_presupuesto_autorizado";
                break;
            case "c_21":
                field = "fecha_entrega_paquete";
                break;
            case "c_22":
                field = "fecha_presupuesto_conexion";
                break;
            case "c_23":
                field = "fecha_pago_presupuesto";
                break;
            case "c_24": {
                field = "fecha_conexion";
                extra = ", Estado=3 ";
                extra2 = `update ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS set no_transformador=(select Transformador from ATENCION_A_CLIENTES where id_solicitud_servicio=${idSolicitud})
                            , transformador_instalado='${newData}'  
                            where id_terreno=(select b.ID_TERRENO from ATENCION_A_CLIENTES a
                                        inner join CONTRATOS_TERRENOS b on a.id_contrato=b.ID_CONTRATO
                                        where a.id_solicitud_servicio=${idSolicitud})`;
                break;
            }
            case "c_25":
                field = "fecha_solicitud_contrato";
                break;
            case "c_26": {
                field = "fecha_instalacion_medidor";
                extra = ", Estado=3 ";
                extra2 = "";
                break;
            }
            case "c_27":
                field = "fecha_envio_presupuesto";
                break;
            case "c_28":
                field = "medio_envio_presupuesto";
                break;
            case "c_29": {
                field = "fecha_pago_anticipo";
                extra = ", estado=3 ";
                extra2 = `INSERT INTO ATENCION_A_CLIENTES_ESCRITURAS(id_presupuesto,id_contrato,id_usuario,estado,fecha_pago_anticipo) 
                                SELECT id_solicitud_servicio,id_contrato,id_usuario,1,now() FROM ATENCION_A_CLIENTES WHERE id_solicitud_servicio=${idSolicitud}`;
                break;
            }
            case "c_30":
                field = "fecha_envio_contrato_cespm";
                break;
            case "c_31":
                field = "cuenta_cespm";
                break;
            case "c_32":
                field = "fecha_descubrimiento";
                break;
            case "c_33": {
                field = "fecha_medidor_cespm";
                extra = ", estado=3 ";
                extra2 = `update ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS set servicio_de_agua='${newData}' , obra_hidraulica='SI'  
                where id_terreno=(select b.ID_TERRENO from ATENCION_A_CLIENTES a
                            inner join CONTRATOS_TERRENOS b on a.id_contrato=b.ID_CONTRATO
                            where a.id_solicitud_servicio=${idSolicitud})`;
                break;
            }
            case "c_34":
                field = "fecha_envio_solicitud_cfe";
                break;
            case "c_35":
                field = "folio_seguimiento_cfe";
                break;
            case "c_36": {
                field = "fecha_medidor_cfe";
                extra = ", Estado=3 ";
                extra2 = `update ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS set no_transformador=(select Transformador from ATENCION_A_CLIENTES where id_solicitud_servicio=${idSolicitud})
                , transformador_en_uso='SI', servicio_de_luz='${newData}'  
                where id_terreno=(select b.ID_TERRENO from ATENCION_A_CLIENTES a
                            inner join CONTRATOS_TERRENOS b on a.id_contrato=b.ID_CONTRATO
                            where a.id_solicitud_servicio=${idSolicitud})`;
                break;
            }
            default:
                break;
        }
        field2 = "id_solicitud_servicio";
    } else if (modulo == 3) {
        switch (col) {
            case "c_5":
                field = "Estado";
                break;
            case "c_7":
                field = "fecha_revision_contraloria";
                break;
            case "c_8":
                field = "fecha_solicitud_documentos";
                break;
            case "c_9":
                field = "fecha_firma_notaria";
                break;
            case "c_10":
                field = "fecha_recepcion_escritura";
                break;
            case "c_11":
                field = "fecha_escritura_escaneada";
                break;
            case "c_12": {
                field = "fecha_entrega_cliente";
                extra2 = `UPDATE ATENCION_A_CLIENTES_ESCRITURAS SET Estado=3 WHERE id=${idSolicitud};  
                                update ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS
                                set escrituras='"+val+@"' where id_terreno=(
                                select b.ID_TERRENO from ATENCION_A_CLIENTES_ESCRITURAS a
                                inner join CONTRATOS_TERRENOS b on a.idContrato=b.ID_CONTRATO
                                where a.id="+id_solicitud+")`;
                break;
            }
            default:
                break;
        }
        field2 = "id";
    } else if (modulo == 4) {
        switch (col) {
            case "c_19":
                field = "fecha_revision_contraloria";
                break;
            case "c_10":
                field = "fecha_carta_lista_entrega";
                break;
            case "c_11": {
                field = "fecha_entrega_cliente";
                extra = ", Estado=3 ";
                extra2 = `update ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS set carta_finiquito='${newData}'  
                where id_terreno=(select b.ID_TERRENO from ATENCION_A_CLIENTES a
                            inner join CONTRATOS_TERRENOS b on a.id_contrato=b.ID_CONTRATO
                            where a.id_solicitud_servicio=${idSolicitud})`;
                break;
            }
            default:
                break;
        }
        field2 = "id_solicitud_servicio";
    }

    const queryT = `update ${tabla1} set ${field}='${newData}' ${extra} where ${field2}=${idSolicitud}`;
    await dbQuery(queryT);
    await dbQuery(extra2);

    const query = "select 1";
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
