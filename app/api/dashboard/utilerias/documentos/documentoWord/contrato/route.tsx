import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idCliente = searchParams.get("idCliente");
    const idContrato = searchParams.get("idContrato");
    const query = `select a.nombre || ' ' || a.ap_paterno || ' ' || coalesce(ap_materno,'') as nombre_cliente,e.fraccionamiento,d.no_manzana ,c.no_terreno,b.id_contrato
    ,c.superficie,f.monto_financiar,f.monto_terreno_inicial,f.mensualidad_inicial,a.abreviatura,a.ocupacion

    from clientes a
    inner join contratos_terrenos b on a.id_cliente=b.id_cliente
    inner join cat_terrenos c on b.id_terreno=c.id_terreno
    inner join cat_manzanas d on c.id_manzana=d.id_manzana
    inner join cat_fraccionamientos e on d.id_fraccionamiento=e.id_fraccionamiento
    inner join movimientos_cabecera f on b.id_contrato=f.id_contrato
    where a.id_cliente=${idCliente} and b.id_contrato=${idContrato};`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData, { status: 200 });
}
