import { NextRequest, NextResponse } from "next/server";
import dbQueryParams from "@/lib/dbQueryParams";
import dbQuery from "@/lib/dbQuery";

interface Cliente {
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
    bnd_activo: string | null;
    ultima_modificacion: string | null;
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

export async function POST(request: NextRequest) {
    try {
        const data: Cliente = await request.json();

        if (data.id_cliente === "0") {
            await dbQuery("BEGIN;");

            const query = `
                INSERT INTO clientes (abreviatura, nombre, ap_paterno, ap_materno, tel_cod_casa, tel_casa,tel_cod_cel, tel_cel, email,fecha_alta, id_usuario,bnd_activo, id_estatus_prospecto,tel_usa_cel
                , tel_usa_casa, notas,id_medio_publicitario,ultima_modificacion)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                RETURNING id_cliente;
            `;
            const values = [
                data.abreviatura,
                data.nombre,
                data.ap_paterno,
                data.ap_materno,
                data.tel_cod_casa,
                data.tel_casa,
                data.tel_cod_cel,
                data.tel_cel,
                data.email,
                data.fecha_alta,
                data.id_usuario,
                data.bnd_activo,
                data.id_estatus_prospecto,
                data.tel_usa_cel,
                data.tel_usa_casa,
                data.notas,
                data.id_medio_publicitario,
                data.ultima_modificacion,
            ];

            const result = await dbQueryParams(query, values);
            if (result.rows.length > 0) {
                const id_cliente = result.rows[0].id_cliente;
                await dbQuery("COMMIT;");
                return NextResponse.json(id_cliente, { status: 200 });
            } else {
                await dbQuery("ROLLBACK;");
                return NextResponse.json({ error: "Error al crear cliente" }, { status: 500 });
            }
        } else {
            const setClauses: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            for (const key in data) {
                if (key !== "id_cliente" && data[key as keyof Cliente] !== null && data[key as keyof Cliente] !== undefined) {
                    setClauses.push(`${key} = $${paramCount}`);
                    values.push(data[key as keyof Cliente]);
                    paramCount++;
                }
            }
            const queryUpdate = `UPDATE clientes
                                SET ${setClauses.join(", ")}
                                WHERE id_cliente = ${data.id_cliente}
                                returning id_cliente;
                            `;

            const resultUpdate = await dbQueryParams(queryUpdate, values);
            if (resultUpdate.rows.length > 0) {
                return NextResponse.json(resultUpdate.rows, { status: 200 });
            } else {
                return NextResponse.json({ message: "Error al actualizar datos" }, { status: 500 });
            }
        }
    } catch (error) {
        await dbQuery("ROLLBACK;"); // Asegura rollback en caso de error general
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    }
}
