import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");
    const anio = searchParams.get("anio");
    const mes = searchParams.get("mes");
    const estatusToma = searchParams.get("estatusToma");

    let where = " where 1=1";

    if (estatusToma === "1" || estatusToma === "2") {
        where += ` and b.estatus=${estatusToma}`;
    } else {
        where += ` and b.estatus in (1,2)`;
    }

    if (idFraccionamiento != "0" && idFraccionamiento != "") {
        where += ` and f.id_fraccionamiento=${idFraccionamiento}`;
    }
    if (idManzana != "0" && idManzana != "") {
        where += ` and e.id_manzana=${idManzana}`;
    }
    if (idTerreno != "0" && idTerreno != "") {
        where += ` and d.id_terreno=${idTerreno}`;
    }
    if (anio != "0" && anio != "") {
        where += ` and periodo_lectura_anio=${anio}`;
    }
    if (mes != "0" && mes != "") {
        where += ` and periodo_lectura=${mes}`;
    }

    const query = ` select coalesce(a.id_movimiento_detalle,0) as id_movimiento, a.id_carga, b.id_contrato,concat(f.NOMENCLATURA,'-',e.NO_MANZANA,'-',d.NO_TERRENO) as toma_agua, 
					coalesce((select lectura from CONSUMO_AGUA_LECTURAS z where z.id_carga<a.id_carga and z.id_toma=a.id_toma order by z.id_carga desc limit 1),0)as lectura_anterior,
					a.lectura as lectura_actual,
                    to_char(a.fecha_lectura,'dd/MM/yyyy') as fecha_lectura,coalesce(a.observaciones,'N/A') as observaciones,coalesce(a.fotos,'N/A')as fotos,a.importe,g.estatus,a.estatus_lectura
                    --,a.periodo_lectura,a.periodo_lectura_anio,a.id_carga
					from CONSUMO_AGUA_LECTURAS a
                    inner join CAT_TOMAS_AGUA b on a.id_toma=b.id_toma
                    inner join CONTRATOS_TERRENOS c on b.id_contrato=c.ID_CONTRATO
                    inner join CAT_TERRENOS d on c.ID_TERRENO=d.ID_TERRENO
                    inner join CAT_MANZANAS e on d.ID_MANZANA=e.ID_MANZANA
                    inner join CAT_FRACCIONAMIENTOS f on e.ID_FRACCIONAMIENTO=f.ID_FRACCIONAMIENTO
                    inner join CAT_ESTATUS_TOMAS_AGUA g on b.estatus=g.id_estatus
                    ${where}
                    order by a.periodo_lectura_anio asc,a.periodo_lectura asc, toma_agua asc
                    `;

    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
