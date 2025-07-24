import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();
    const mensualidades = searchParams.get("mensualidades");

    let where = " ";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and id_fraccionamiento=${idFraccionamiento}`;
    }

    if (idManzana != "" && idManzana != "0") {
        where += ` and id_manzana=${idManzana}`;
    }
    if (idTerreno != "" && idTerreno != "0") {
        where += ` and id_terreno=${idTerreno}`;
    }

    if (mensualidades != "0") {
        if (mensualidades == "4") {
            where += ` and atrasadas >= 4`;
        } else {
            where += ` and atrasadas = ${mensualidades}`;
        }
    }

    if (nombreCliente) {
        const words = nombreCliente.split(" ");

        words.forEach((word) => {
            where += ` AND nombre_cliente ILIKE '%${word}%'`;
        });
    }

    let query = `select * from (
                  select concat(d.NOMENCLATURA,'-',c.NO_MANZANA,'-',b.NO_TERRENO) as nomenclatura
                  ,concat(e.NOMBRE,' ',e.AP_PATERNO,' ',coalesce(AP_MATERNO,'')) as nombre_cliente
                  ,to_char(a.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato
                  ,(select count(*) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=2 and coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO < now()) as atrasadas
                  ,a.ID_CONTRATO,d.id_fraccionamiento,c.id_manzana,b.id_terreno
                  from CONTRATOS_TERRENOS a
                  inner join CAT_TERRENOS b on b.ID_TERRENO=a.ID_TERRENO
                  inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
                  inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
                  inner join CLIENTES e on e.ID_CLIENTE=a.ID_CLIENTE
                  where a.ID_ESTATUS_CONTRATO in (1,4,5)
                  )aa
                  where 1=1
                ${where}  
               `;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
