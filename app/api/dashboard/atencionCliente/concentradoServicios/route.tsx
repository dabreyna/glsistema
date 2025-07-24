import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");

    let where = " ";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and d.ID_FRACCIONAMIENTO=${idFraccionamiento}`;
    }

    if (idManzana != "" && idManzana != "0") {
        where += ` and c.id_manzana=${idManzana}`;
    }
    if (idTerreno != "" && idTerreno != "0") {
        where += ` and b.id_terreno=${idTerreno}`;
    }

    const query = `select concat(d.nomenclatura,'-',c.NO_MANZANA,'-',b.NO_TERRENO) as nomenclatura,concat(f.nombre,' ',f.ap_paterno,' ',coalesce(f.ap_materno,'')) as nombre_cliente,g.estatus,b.CALLE,
                        a.id,a.id_terreno,a.no_transformador,a.transformador_instalado,a.transformador_en_uso, a.servicio_de_luz,a.servicio_de_agua,a.biodigestor,
                        a.solicitud_de_marcado AS solicitud_de_marcado, a.carta_finiquito AS carta_finiquito,
                        a.escrituras AS escrituras, a.clave_catastral, a.obra_hidraulica
                    from ATENCION_A_CLIENTES_LEVANTAMIENTO_SERVICIOS a
                    inner join CAT_TERRENOS b on b.ID_TERRENO=a.id_terreno
                    inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
                    inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
					left join contratos_terrenos e on b.id_terreno=e.id_terreno and e.id_estatus_contrato not in(3,6,7,8)
					left join clientes f on e.id_cliente=f.id_cliente
					left join cat_estatus_contrato g on e.id_estatus_contrato=g.id_estatus
                    where 1=1 
                    ${where}  
                    order by d.id_fraccionamiento,c.no_manzana, b.no_terreno  asc
    `;
    console.log(query);
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
