import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idEmpresa = searchParams.get("idEmpresa");
    const tipo_cambio = searchParams.get("tipo_cambio");
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");

    let where = "";
    if (idEmpresa != "" && idEmpresa != "0") {
        where += ` and f.id_empresa=${idEmpresa}`;
    }
    const exigible = `(select coalesce(sum(coalesce(MONTO_SALDO,0)),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and bnd_activo=true and ID_TIPO_MOVIMIENTO in (1,2) and fecha_movimiento between '${fInicio}' and '${fFin} 23:59:59' and coalesce(BND_PAGADO,false)=false)`;
    const real = `(select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and bnd_activo=true and ID_TIPO_MOVIMIENTO in (3,12) and fecha_movimiento between '${fInicio}' and '${fFin} 23:59:59')`;
    const otros = `(select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and bnd_activo=true and ID_TIPO_MOVIMIENTO in (3,12) and fecha_movimiento between '${fInicio}' and '${fFin} 23:59:59')`;

    let query = `select RAZON_SOCIAL,FRACCIONAMIENTO,sum(exigible) as exigible,sum(cobranza_real) as cobranza_real,sum(cobranza_otros) as cobranza_otros from (
                  select f.RAZON_SOCIAL,d.FRACCIONAMIENTO
                  ,case when g.moneda=1 then ${tipo_cambio} * ${exigible} else ${exigible} end as exigible
                  ,case when g.moneda=1 then ${tipo_cambio} * ${real} else ${real} end as cobranza_real
                  ,case when g.moneda=1 then ${tipo_cambio} * ${otros} else ${otros} end as cobranza_otros
                  from CONTRATOS_TERRENOS a
                  inner join CAT_TERRENOS b on b.ID_TERRENO=a.ID_TERRENO
                  inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
                  inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
                  inner join CAT_EMPRESAS f on f.ID_EMPRESA=d.id_EMPRESA
                  inner join MOVIMIENTOS_CABECERA g on g.ID_CONTRATO=a.ID_CONTRATO
                  where a.ID_ESTATUS_CONTRATO in (1,4,5)
                   ${where}
                  )aa
                  group by RAZON_SOCIAL,FRACCIONAMIENTO
                  order by razon_social,fraccionamiento`;

    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "razon_social");
    const formattedData = Object.keys(groupedData).map((razon_social) => ({
        razon_social,
        cartera: groupedData[razon_social],
    }));
    return NextResponse.json(formattedData, { status: 200 });
}
