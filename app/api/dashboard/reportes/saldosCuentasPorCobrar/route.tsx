import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const chkHistorico = searchParams.get("chkHistorico");

    let where = " ";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and d.id_fraccionamiento=${idFraccionamiento}`;
    }

    if (chkHistorico != "" && chkHistorico != "false") {
        where += ` and extract(year from a.fecha_contrato) <= 2013`;
    }

    if (fInicio != "" && fFin != "") {
        where += ` and a.fecha_contrato between '${fInicio}' and '${fFin} 23:59:59'`;
    }

    const query = `select ROW_NUMBER() OVER(order by e.NOMBRE||' '||e.AP_PATERNO||' '||coalesce(e.AP_MATERNO,'')) as consecutivo
                  ,a.ID_CONTRATO
                  ,d.NOMENCLATURA||'-'||c.NO_MANZANA||'-'||b.NO_TERRENO as terreno
                  ,e.NOMBRE||' '||e.AP_PATERNO||' '||coalesce(e.AP_MATERNO,'') as nombre_cliente
                  ,f.MONTO_TERRENO_INICIAL as precio_original
                  ,f.MONTO_TERRENO_ACTUAL as precio_actual
                  ,(select sum(monto) 
                    from MOVIMIENTOS_DETALLE 
                    where ID_CONTRATO=a.ID_CONTRATO 
                    and ID_TIPO_MOVIMIENTO in (3,12) 
                    and BND_ACTIVO=true 
                    and bnd_contrato_cancelado =false) as pagado
                  ,f.SALDO
                  ,to_char(a.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato
                  from CONTRATOS_TERRENOS a
                  inner join CAT_TERRENOS b on b.ID_TERRENO=a.ID_TERRENO
                  inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
                  inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
                  inner join CLIENTES e on e.ID_CLIENTE=a.ID_CLIENTE
                  inner join MOVIMIENTOS_CABECERA f on f.ID_CONTRATO=a.ID_CONTRATO
                  where a.ID_ESTATUS_CONTRATO=4 
                  ${where}
                  order by nombre_cliente
    `;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
