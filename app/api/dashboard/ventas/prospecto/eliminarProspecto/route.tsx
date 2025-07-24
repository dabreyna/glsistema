import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { id } from "date-fns/locale";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idCliente = searchParams.get("idCliente");

    try {
        const contratos = await dbQuery(`select id_contrato from contratos_terrenos where id_cliente=${idCliente}`);
        for (let i = 0; i < contratos.rows.length; i++) {
            const id_contrato = contratos.rows[i].id_contrato;

            const requisitos = await dbQuery(
                `select ID_REQUISITO_FRACCIONAMIENTO_terreno from REQUISITOS_FRACCIONAMIENTO_TERRENO where id_contrato=${id_contrato}`
            );
            for (let j = 0; j < requisitos.rows.length; j++) {
                const id_requisito = requisitos.rows[j].ID_REQUISITO_FRACCIONAMIENTO_terreno;
                await dbQuery(`delete from requisitos_archivos where id_requisito_fraccionamiento_terreno=${id_requisito}`);
            }
            await dbQuery(`delete from REQUISITOS_FRACCIONAMIENTO_TERRENO where id_contrato=${id_contrato}`);
            await dbQuery(`delete from REFERENCIAS_PERSONALES where id_contrato=${id_contrato}`);
            await dbQuery(`delete from beneficiarios where id_contrato=${id_contrato}`);
            await dbQuery(`delete from copropietarios where id_contrato=${id_contrato}`);
            await dbQuery(`delete from CONTRATO_PROMOCION_INICIAl where id_contrato=${id_contrato}`);
            await dbQuery(`delete from contratos_terrenos where id_contrato=${id_contrato}`);
        }
        await dbQuery(`delete from agenda where id_cliente=${idCliente}`);
        await dbQuery(`delete from clientes where id_cliente=${idCliente}`);
        return NextResponse.json("OK", { status: 200 });
    } catch (error) {}

    return NextResponse.json("ERROR", { status: 400 });
}
