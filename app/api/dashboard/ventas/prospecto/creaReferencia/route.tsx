import { NextRequest, NextResponse } from "next/server";
import dbQueryParams from "@/lib/dbQueryParams";
import dbQuery from "@/lib/dbQuery";

interface Referencia {
    id_referencia: string | null;
    abreviatura: string | null;
    nombre: string | null;
    ap_paterno: string | null;
    ap_materno: string | null;
    parentesco: string | null;
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
    observaciones: string | null;
    id_usuario: string | null;
    id_terreno: string | null;
    id_contrato: string | null;
    fecha_alta: string | null;
}

export async function POST(request: NextRequest) {
    try {
        const data: Referencia = await request.json();
        console.log(data);

        if (data.id_referencia === "0") {
            await dbQuery("BEGIN;");
            const query = `
                INSERT INTO referencias_personales (abreviatura, nombre, ap_paterno, ap_materno,parentesco,
                calle,numero,entre,ciudad,cp,colonia,estado,pais, tel_cod_casa, tel_casa,tel_cod_cel, tel_cel, 
                observaciones,id_usuario,id_terreno,id_contrato,fecha_alta)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
                RETURNING id_referencia;
            `;
            const values = [
                data.abreviatura,
                data.nombre,
                data.ap_paterno,
                data.ap_materno,
                data.parentesco,
                data.calle,
                data.numero,
                data.entre,
                data.ciudad,
                data.cp,
                data.colonia,
                data.estado,
                data.pais,
                data.tel_cod_casa,
                data.tel_casa,
                data.tel_cod_cel,
                data.tel_cel,
                data.observaciones,
                data.id_usuario,
                data.id_terreno,
                data.id_contrato,
                data.fecha_alta,
            ];

            const result = await dbQueryParams(query, values);
            if (result.rows.length > 0) {
                const id_referencia = result.rows[0].id_referencia;
                await dbQuery("COMMIT;");
                return NextResponse.json(id_referencia, { status: 200 });
            } else {
                await dbQuery("ROLLBACK;");
                return NextResponse.json({ error: "Error al crear referencia" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: "Error al crear referencia" }, { status: 500 });
        }
    } catch (error) {
        await dbQuery("ROLLBACK;"); // Asegura rollback en caso de error general
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    }
}
