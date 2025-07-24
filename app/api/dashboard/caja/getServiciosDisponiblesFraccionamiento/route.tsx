import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");

    const query = `select servicio,a.id_servicio
                    from servicios_informativos_terrenos a
                    inner join cat_servicios b on a.id_servicio = b.id_servicio
                    inner join contratos_terrenos c on c.id_terreno = a.id_terreno
                    where c.id_contrato =${idContrato}`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
