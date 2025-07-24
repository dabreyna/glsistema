import { NextRequest, NextResponse } from "next/server";
import dbQueryParams from "@/lib/dbQueryParams";
import dbQuery from "@/lib/dbQuery";
import { ca } from "date-fns/locale";

interface Comentario {
    idCliente: string;
    idUsuario: string;
    perfilUsuario: string;
    fecha: string;
    clasificacion: string;
    comentario: string;
    interesado: string;
}

export async function POST(request: NextRequest) {
    let bnd_error = false;
    try {
        const data: Comentario = await request.json();
        const queryUsuario = `select id_usuario from clientes where id_cliente=${data.idCliente}`;
        const usuario = await dbQuery(queryUsuario);

        const query = `insert into agenda(id_cliente,id_usuario,fecha_alta,fecha_compromiso,id_clasificacion,comentario,id_usuario_comentario) 
        values(${data.idCliente},${usuario.rows[0].id_usuario},now(),'${data.fecha}',${data.clasificacion},'${data.comentario}',${data.idUsuario}) returning id_agenda;`;

        const result = await dbQuery(query);
        bnd_error = result.rows[0].id_agenda == null || result.rows[0].id_agenda == "0" ? true : false;

        const queryUpdate = `update clientes set bnd_interesado_prospecto=${data.interesado} where id_cliente=${data.idCliente}`;
        await dbQuery(queryUpdate);

        const queryUpdate2 = `update clientes set id_estatus_prospecto=1 where id_cliente=${data.idCliente}`;
        await dbQuery(queryUpdate2);

        if (bnd_error == false) {
            return NextResponse.json({ Resultado: "OK" }, { status: 200 });
        } else {
            return NextResponse.json({ Resultado: "Error" }, { status: 200 });
        }
    } catch (error) {
        console.error("Error en la API:", error);
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    }
}
