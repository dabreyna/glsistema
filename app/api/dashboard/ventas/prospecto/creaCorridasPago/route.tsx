import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbClient";
import dbQueryTrans from "@/lib/dbQueryTrans";
import moment from "moment";
import { ca } from "date-fns/locale";

function getMesAjusteAnual(fechaInicial: string) {
    const mes = moment(fechaInicial, "DD/MM/YYYY").month() + 1;
    // console.log(mes);
    let mes_ajuste = 0;
    switch (mes) {
        case 9:
        case 10:
        case 11:
            mes_ajuste = 7;
            break;
        case 12:
        case 1:
        case 2:
            mes_ajuste = 10;
            break;
        case 3:
        case 4:
        case 5:
            mes_ajuste = 1;
            break;
        case 6:
        case 7:
        case 8:
            mes_ajuste = 4;
            break;
    }
    return mes_ajuste;
}

export async function GET(request: NextRequest) {
    const client = await pool.connect();
    const { searchParams } = new URL(request.url);
    const idCliente = searchParams.get("idCliente");
    const idContrato = searchParams.get("idContrato");
    let query = "";
    let bnd_error = false;
    try {
        await dbQueryTrans(client, "BEGIN;");

        query = `select id_fraccionamiento,id_manzana,id_terreno,monto_terreno,costo_financiero,id_financiamiento
                  ,pagos,pago_inicial,to_char(fecha_primer_pago,'dd/MM/yyyy') as fecha_primer_pago,mensualidad,interes_diario,descuento_pesos
                  ,descuento_porcentaje,moneda from CONTRATO_PROMOCION_INICIAL where id_contrato=${idContrato};`;
        const datosTerreno = await dbQueryTrans(client, query);
        const id_fraccionamiento = Number(datosTerreno.rows[0].id_fraccionamiento);
        const id_manzana = Number(datosTerreno.rows[0].id_manzana);
        const id_terreno = Number(datosTerreno.rows[0].id_terreno);
        const monto_terreno = Number(datosTerreno.rows[0].monto_terreno);
        const costo_financiero = Number(datosTerreno.rows[0].costo_financiero);
        const id_financiamiento = Number(datosTerreno.rows[0].id_financiamiento);
        const pagos = Number(datosTerreno.rows[0].pagos);
        const pago_inicial = Number(datosTerreno.rows[0].pago_inicial);
        const fecha_primer_pago = datosTerreno.rows[0].fecha_primer_pago;
        const mensualidad = Number(datosTerreno.rows[0].mensualidad);
        const interes_diario = Number(datosTerreno.rows[0].interes_diario);
        const descuento_pesos = Number(datosTerreno.rows[0].descuento_pesos);
        const descuento_porcentaje = Number(datosTerreno.rows[0].descuento_porcentaje);
        const moneda = datosTerreno.rows[0].moneda;

        query = `select estatus from cat_terrenos where id_terreno=${id_terreno};`;
        const estatus = await dbQueryTrans(client, query);
        if (estatus.rows[0].estatus != 1) {
            bnd_error = true;
            return NextResponse.json({ error: "Error" }, { status: 500 });
        }

        query = `update cat_terrenos set estatus=3 where id_terreno=${id_terreno} returning estatus`;
        const result = await dbQueryTrans(client, query);
        if (result.rows[0].estatus != 3) {
            bnd_error = true;
            return NextResponse.json({ error: "Error" }, { status: 500 });
        }

        query = `update clientes set id_estatus_prospecto=2 where id_cliente=${idCliente} returning id_estatus_prospecto`;
        const result2 = await dbQueryTrans(client, query);

        if (result2.rows[0].id_estatus_prospecto != 2) {
            bnd_error = true;
            return NextResponse.json({ error: "Error" }, { status: 500 });
        }
        query = `update contratos_terrenos set id_estatus_contrato=1,fecha_contrato=now() where id_contrato=${idContrato} returning id_estatus_contrato`;
        const result3 = await dbQueryTrans(client, query);

        if (result3.rows[0].id_estatus_contrato != 1) {
            bnd_error = true;
            return NextResponse.json({ error: "Error" }, { status: 500 });
        }
        const monto_financiar = Number(monto_terreno) - Number(pago_inicial);
        const mensualidad_inicial = Number(monto_financiar) / Number(pagos);
        const mensualidad_actual = Number(monto_financiar) / Number(pagos);
        const mes_ajuste_anual = getMesAjusteAnual(fecha_primer_pago);
        const f_primer_pago = moment(fecha_primer_pago, "DD/MM/YYYY").format("YYYY-MM-DD");

        query = `select precio_m2 from cat_terrenos where id_terreno=${id_terreno}`;
        const result4 = await dbQueryTrans(client, query);
        const precio_m2 = result4.rows[0].precio_m2;

        query = `insert into movimientos_cabecera(id_terreno,id_cliente,monto_terreno_inicial,monto_terreno_actual,id_financiamiento
          ,id_estatus_contrato,fecha_inicio,mensualidad_inicial,mensualidad_actual,descuento_monto,descuento_porcentaje,moneda,tasa_interes_diario,no_pagos
          ,monto_financiar,id_contrato,saldo,mes_ajuste_anual,precio_m2_inicial) 
          values(${id_terreno},${idCliente},${monto_terreno.toFixed(2)},${monto_terreno.toFixed(
            2
        )},${id_financiamiento},1,'${f_primer_pago}',${mensualidad_inicial.toFixed(2)},${mensualidad_actual.toFixed(2)}
          ,${descuento_pesos.toFixed(2)},${descuento_porcentaje},${moneda},${interes_diario},${pagos},${monto_financiar.toFixed(
            2
        )},${idContrato},${monto_financiar.toFixed(2)},${mes_ajuste_anual},${precio_m2}) 
          returning id_movimiento_cabecera;
          `;
        const result5 = await dbQueryTrans(client, query);

        const id_movimiento_cabecera = result5.rows[0].id_movimiento_cabecera;

        if (id_movimiento_cabecera == null && id_movimiento_cabecera == "0") {
            bnd_error = true;
            return NextResponse.json({ error: "Error al insertar movimiento CABECERA" }, { status: 500 });
        }
        for (let x = 1; x <= pagos; x++) {
            const fecha = moment(fecha_primer_pago, "DD/MM/YYYY")
                .add(x - 1, "months")
                .format("YYYY-MM-DD");
            query = `insert into movimientos_detalle(id_movimiento_cabecera,no_pago,id_tipo_movimiento,monto,fecha_movimiento,bnd_activo,id_contrato,MONTO_SALDO)
             values(${id_movimiento_cabecera},${x},2,${mensualidad_actual},'${fecha}',true,${idContrato},${mensualidad_actual}) returning id_movimiento_detalle`;

            const resultado = await dbQueryTrans(client, query);

            if (resultado.rows[0].id_movimiento_detalle == null && resultado.rows[0].id_movimiento_detalle == "0") {
                bnd_error = true;
                return NextResponse.json({ error: "Error al CREAR MOVIMIENTOS DE PAGO" }, { status: 500 });
            }
        }

        await client.query("COMMIT;");
        return NextResponse.json({ Resultado: "OK" }, { status: 200 });
    } catch (error) {
        await client.query("ROLLBACK;");
        console.error("Error en la API:", error);
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    } finally {
        client.release(); // Libera la conexión *siempre*
    }
}
