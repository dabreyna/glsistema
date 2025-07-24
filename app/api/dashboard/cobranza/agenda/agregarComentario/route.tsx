import { NextRequest, NextResponse } from "next/server";
// import dbQueryParams from "@/lib/dbQueryParams";
import dbQuery from "@/lib/dbQuery";
import { forEach } from "lodash";

interface Comentario {
    idCliente: string;
    idUsuario: string;
    perfilUsuario: string;
    idContrato: string;
    fecha: string;
    clasificacion: string;
    monto: string;
    chkMostrar: string;
    comentario: string;
}

export async function POST(request: NextRequest) {
    try {
        const data: Comentario = await request.json();
        // console.log(data);

        const queryUsuario = `SELECT B.ID_CONTRATO
                    FROM CARGA_CLIENTES_COBRANZA A
                    INNER JOIN CONTRATOS_TERRENOS B ON A.ID_CONTRATO=B.ID_CONTRATO AND B.ID_ESTATUS_CONTRATO IN (1,4,5)
                    INNER JOIN CLIENTES C ON C.ID_CLIENTE=B.ID_CLIENTE
                    WHERE C.ID_CLIENTE=(SELECT C.ID_CLIENTE
                    FROM CARGA_CLIENTES_COBRANZA A
                    INNER JOIN CONTRATOS_TERRENOS B ON A.ID_CONTRATO=B.ID_CONTRATO
                    INNER JOIN CLIENTES C ON C.ID_CLIENTE=B.ID_CLIENTE
                    WHERE A.ID_CONTRATO=${data.idContrato} GROUP BY C.ID_CLIENTE)
                    GROUP BY B.ID_CONTRATO`;
        const contratos = await dbQuery(queryUsuario);

        forEach(contratos.rows, (contrato) => {
            (async () => {
                //
                const query = `insert into agenda_cobranza(id_contrato,id_usuario,fecha_alta,fecha_compromiso,id_clasificacion,comentario,id_tipo_comentario,bnd_mostrar_caja) 
                                values(${data.idContrato},${data.idUsuario},now(),'${data.fecha}',${data.clasificacion},'${data.comentario}',2,${data.chkMostrar});`;
                try {
                    await dbQuery(query);
                } catch (error) {
                    return NextResponse.json({ error: "Error en la API" }, { status: 500 });
                }
            })();
        });

        if (Number(data.monto) > 0) {
            const query = `update cobranza_compromisos_pago set bnd_activo=false where id_contrato=${data.idContrato}`;
            await dbQuery(query);
            const query2 = `insert into cobranza_compromisos_pago(id_contrato,fecha_compromiso,monto,bnd_activo,fecha_movimiento,comentarios) 
                          values
                         (${data.idContrato},'${data.fecha}',${data.monto},true,now(),'${data.comentario}') returning id_compromiso;`;
            const res = await dbQuery(query2);
            if (res.rows[0].id_compromiso != null || res.rows[0].id_compromiso != "0") {
                return NextResponse.json({ Resultado: "OK" }, { status: 200 });
            } else {
                return NextResponse.json({ Resultado: "Error" }, { status: 200 });
            }
        } else {
            return NextResponse.json({ Resultado: "OK Cita" }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    }
}
