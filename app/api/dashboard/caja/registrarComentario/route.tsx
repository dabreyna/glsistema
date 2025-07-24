import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

interface Comentario {
    comentario: string;
    id_usuario: string;
    id_contrato: number;
}

export async function POST(request: NextRequest) {
    const data: Comentario = await request.json();

    const query = `insert into comentarios_caja(fecha_comentario,comentario,id_usuario,id_contrato) 
                  values(now(),'${data.comentario}',${data.id_usuario},${data.id_contrato}) returning id_comentario`;
    const tempData = await dbQuery(query);

    if (tempData.rows.length > 0) {
        return NextResponse.json("OK", { status: 200 });
    }
    return NextResponse.json("ERROR", { status: 500 });
}
