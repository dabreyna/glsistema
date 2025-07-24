import { NextRequest, NextResponse } from "next/server";
import dbQueryParams from "@/lib/dbQueryParams";
import dbQuery from "@/lib/dbQuery";

interface Copropietario {
    id_copropietario: string | null;
    abreviatura: string | null;
    nombre: string | null;
    ap_paterno: string | null;
    ap_materno: string | null;
    fecha_nacimiento: string | null;
    sexo: string | null;
    lugar_nacimiento: string | null;
    ocupacion: string | null;
    calle: string | null;
    numero: string | null;
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
    bnd_permiso: string | null;
    bnd_principal: string | null;
    id_usuario: string | null;
    bnd_activo: string | null;
    id_terreno: string | null;
    id_contrato: string | null;
    fecha_alta: string | null;
}

export async function POST(request: NextRequest) {
    try {
        const data: Copropietario = await request.json();

        if (data.id_copropietario === "0") {
            await dbQuery("BEGIN;");

            const query = `
                INSERT INTO copropietarios (abreviatura, nombre, ap_paterno, ap_materno,fecha_nacimiento,sexo,lugar_nacimiento,
                ocupacion,calle,numero,ciudad,cp,colonia,estado,pais, tel_cod_casa, tel_casa,tel_cod_cel, tel_cel,tel_cod_trabajo, tel_trabajo, 
                email, lugar_trabajo, domicilio_trabajo, conyuge, estado_civil, nacionalidad,bnd_permiso,bnd_principal,
                id_usuario,bnd_activo,id_terreno,id_contrato,fecha_alta)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33,$34)
                RETURNING id_copropietario;
            `;
            const values = [
                data.abreviatura,
                data.nombre,
                data.ap_paterno,
                data.ap_materno,
                data.fecha_nacimiento,
                data.sexo,
                data.lugar_nacimiento,
                data.ocupacion,
                data.calle,
                data.numero,
                data.ciudad,
                data.cp,
                data.colonia,
                data.estado,
                data.pais,
                data.tel_cod_casa,
                data.tel_casa,
                data.tel_cod_cel,
                data.tel_cel,
                data.tel_cod_trabajo,
                data.tel_trabajo,
                data.email,
                data.lugar_trabajo,
                data.domicilio_trabajo,
                data.conyuge,
                data.estado_civil,
                data.nacionalidad,
                data.bnd_permiso,
                data.bnd_principal,
                data.id_usuario,
                data.bnd_activo,
                data.id_terreno,
                data.id_contrato,
                data.fecha_alta,
            ];

            const result = await dbQueryParams(query, values);
            if (result.rows.length > 0) {
                const id_copropietario = result.rows[0].id_copropietario;
                await dbQuery("COMMIT;");
                return NextResponse.json(id_copropietario, { status: 200 });
            } else {
                await dbQuery("ROLLBACK;");
                return NextResponse.json({ error: "Error al crear copropietario" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: "Error al crear copropietario" }, { status: 500 });
        }
    } catch (error) {
        await dbQuery("ROLLBACK;"); // Asegura rollback en caso de error general
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    }
}
