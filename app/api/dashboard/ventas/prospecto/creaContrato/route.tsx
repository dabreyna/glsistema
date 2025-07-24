import { NextRequest, NextResponse } from "next/server";
import dbQueryParams from "@/lib/dbQueryParams";
import dbQuery from "@/lib/dbQuery";
import { id } from "date-fns/locale";

interface Contrato {
    id_cliente: string;
    id_usuario: string;
    pagoInicial: string;
    descuentoDinero: string;
    moneda: string;
    fraccionamiento: string;
    manzana: string;
    terreno: string;
    numeroPagos: string;
    mensualidad: string;
    tasaInteresDiario: string;
    descuentoPorcentaje: string;
    tipoVenta: string;
    fechaInicio: string;
    medioPublicitario: string;
    monto: string;
    financiamiento: string;
    costoFinanciero: string;
}

export async function POST(request: NextRequest) {
    let idContrato = "0";
    try {
        const data: Contrato = await request.json();

        if (data.id_cliente != "0") {
            await dbQuery("BEGIN;");

            const query = `insert into contratos_terrenos(id_terreno,id_cliente,id_estatus_contrato,bnd_activo,vendedor,id_medio_publicitario,id_estatus_ventas) values
                        ($1,$2,$3,$4,$5,$6,$7) returning id_contrato;`;
            const values = [data.terreno, data.id_cliente, 8, true, data.id_usuario, data.medioPublicitario, data.tipoVenta];

            const result = await dbQueryParams(query, values);
            if (result.rows.length > 0) {
                idContrato = result.rows[0].id_contrato.toString();
                await dbQuery("COMMIT;");
            } else {
                await dbQuery("ROLLBACK;");
                return NextResponse.json({ error: "Error al crear contrato" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: "no se inserto nada" }, { status: 200 });
        }

        await dbQuery("BEGIN;");
        const query2 = `insert into CONTRATO_PROMOCION_INICIAL(id_contrato,id_fraccionamiento,id_manzana,id_terreno,monto_terreno
        ,costo_financiero,id_financiamiento,pagos,pago_inicial,fecha_primer_pago,mensualidad,interes_diario,descuento_pesos,descuento_porcentaje,moneda,id_medio_publicitario) 
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        returning id_contrato;
        `;

        const values = [
            idContrato,
            data.fraccionamiento,
            data.manzana,
            data.terreno,
            data.monto,
            data.costoFinanciero,
            data.financiamiento,
            data.numeroPagos,
            data.pagoInicial,
            data.fechaInicio,
            data.mensualidad,
            data.tasaInteresDiario,
            data.descuentoDinero,
            data.descuentoPorcentaje,
            data.moneda,
            data.medioPublicitario,
        ];
        const result = await dbQueryParams(query2, values);
        if (result.rows.length > 0) {
            idContrato = result.rows[0].id_contrato;
            await dbQuery("COMMIT;");
            return NextResponse.json(idContrato, { status: 200 });
        } else {
            await dbQuery("ROLLBACK;");
            return NextResponse.json({ error: "Error al crear contrato" }, { status: 500 });
        }
    } catch (error) {
        await dbQuery("ROLLBACK;"); // Asegura rollback en caso de error general
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    }
}
