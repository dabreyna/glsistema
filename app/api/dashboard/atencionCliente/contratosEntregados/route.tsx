import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const estatusContrato = searchParams.get("estatusContrato");
    const bndEntregado = searchParams.get("entregado");

    const entregado =
        bndEntregado != "0" ? (bndEntregado == "true" ? "where contrato_entregado='SI'" : " where contrato_entregado='NO'") : "";

    let where = "1=1 ";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and d.id_fraccionamiento=${idFraccionamiento}`;
    }

    if (fInicio != "" && fFin != "") {
        where += ` and a.fecha_contrato between '${fInicio}' and '${fFin} 23:59:59'`;
    }

    if (estatusContrato != "" && estatusContrato != "0") {
        where += ` and f.id_estatus=${estatusContrato}`;
    }

    const query = `select * from( select a.id_contrato,a.id_cliente,concat(d.nomenclatura,'-',c.no_manzana,'-',b.no_terreno) as terreno,
                    concat(e.nombre,' ',e.ap_paterno,' ',coalesce(e.ap_materno,'')) as nombre_cliente, 
                    to_char(a.fecha_contrato,'dd/MM/yyyy')as fecha_contrato, to_char(a.fecha_firma,'dd/MM/yyyy')as fecha_firma,
                    case when (coalesce(bnd_contrato_entregado,false)=false) then 'NO' else 'SI' end as contrato_entregado,
                    f.estatus as estatus_contrato
                    from contratos_terrenos a
                    inner join cat_terrenos b on a.id_terreno=b.id_terreno
                    inner join cat_manzanas c on b.id_manzana=c.id_manzana
                    inner join cat_fraccionamientos d on c.id_fraccionamiento=d.id_fraccionamiento
                    inner join clientes e on a.id_cliente=e.id_cliente
                    inner join cat_estatus_contrato f on a.id_estatus_contrato=f.id_estatus
                    where ${where}) as a
                    ${entregado}
                    order by a.terreno asc`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
