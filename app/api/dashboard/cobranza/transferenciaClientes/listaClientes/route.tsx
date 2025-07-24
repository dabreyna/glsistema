import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idAsesorOrigen = searchParams.get("idAsesorOrigen");

    if (idAsesorOrigen === "0") {
        return NextResponse.json({ error: "Falta elegir Asesor Origen" }, { status: 400 });
    }
    const query = `select c.ID_CLIENTE, concat(c.ap_paterno,' ',coalesce(c.ap_materno,''),' ',c.nombre) as nombre_cliente
                  from CARGA_CLIENTES_COBRANZA a
                  inner join CONTRATOS_TERRENOS b on b.ID_CONTRATO=a.ID_CONTRATO
                  inner join CLIENTES c on c.ID_CLIENTE=b.ID_CLIENTE
                  where a.FECHA_CARGA in (select fecha_carga as fecha 
                                    from CARGA_CLIENTES_COBRANZA group by fecha_carga  order by FECHA desc limit 2)
                  and b.ID_ESTATUS_CONTRATO in (1,4,5)
                  and c.id_asesor_cobranza=${idAsesorOrigen}
                  group by c.id_cliente,nombre_cliente
                  order by nombre_cliente asc
               `;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
