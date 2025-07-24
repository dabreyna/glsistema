import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idManzana = searchParams.get("idManzana");
    const idTerreno = searchParams.get("idTerreno");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();

    let where = " ";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and c.id_fraccionamiento=${idFraccionamiento} `;
    }

    if (idManzana != "" && idManzana != "0") {
        where += ` and b.id_manzana=${idManzana} `;
    }
    if (idTerreno != "" && idTerreno != "0") {
        where += ` and a.id_terreno=${idTerreno} `;
    }

    const query = `SELECT C.NOMENCLATURA||'-'||B.NO_MANZANA||'-'||A.NO_TERRENO AS TERRENO,
                  A.SUPERFICIE,A.PRECIO_M2,A.TOTAL_TERRENO,A.ID_TERRENO
                  FROM CAT_TERRENOS A
                  INNER JOIN CAT_MANZANAS B ON B.ID_MANZANA=A.ID_MANZANA
                  INNER JOIN CAT_FRACCIONAMIENTOS C ON C.ID_FRACCIONAMIENTO=B.ID_FRACCIONAMIENTO
                  WHERE 1=1
                  ${where}
                  ORDER BY NOMENCLATURA
               `;
    const tempData = await dbQuery(query);
    const resultados = [];

    for (const terreno of tempData.rows) {
        const query2 = `select c.NOMBRE||' '||c.AP_PATERNO||' '||COALESCE(c.AP_MATERNO,'') as nombre_cliente
                    ,to_char(b.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato,to_char(b.FECHA_CANCELACION,'dd/MM/yyyy') as fecha_cancelacion
                    ,d.MONTO_TERRENO_INICIAL as precio_terreno,d.precio_m2_inicial
                    from CAT_TERRENOS a
                    inner join CONTRATOS_TERRENOS b on b.ID_TERRENO=a.ID_TERRENO and b.ID_ESTATUS_CONTRATO in (1,3,4,5,6,7)
                    inner join CLIENTES c on c.ID_CLIENTE=b.ID_CLIENTE
                    inner join MOVIMIENTOS_CABECERA d on d.ID_CONTRATO=b.ID_CONTRATO
                    where a.id_terreno=${terreno.id_terreno} 
                    order by b.fecha_contrato desc
                    `;
        const contratos = await dbQuery(query2);
        resultados.push({
            ...terreno,
            contratos: contratos.rows,
        });
    }
    return NextResponse.json(resultados, { status: 200 });
}
