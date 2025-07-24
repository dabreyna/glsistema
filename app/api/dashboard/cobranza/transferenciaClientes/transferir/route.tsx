import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

interface Datos {
    selectedClientIds: number[];
    idAsesorOrigen: string;
    idAsesorDestino: string;
}

export async function POST(request: NextRequest) {
    try {
        const data: Datos = await request.json();
        if (
            !Array.isArray(data.selectedClientIds) ||
            data.selectedClientIds.length === 0 ||
            data.idAsesorOrigen === "" ||
            data.idAsesorDestino === ""
        ) {
            return NextResponse.json(
                { message: "Datos incorrectos, no es posible transferir los clientes seleccionados" },
                { status: 400 }
            );
        }
        const idsString = data.selectedClientIds.join(",");

        const where = ` and id_cliente in (${idsString})`;
        const query = `update clientes set id_asesor_cobranza='${data.idAsesorDestino}' where id_asesor_cobranza='${data.idAsesorOrigen}' ${where}`;
        const res = await dbQuery(query);
        const resCount = res.rowCount ? res.rowCount : 0;

        if (resCount > 0) {
            return NextResponse.json({ Resultado: "OK" }, { status: 200 });
        } else {
            return NextResponse.json({ Resultado: "Error" }, { status: 200 });
        }
    } catch (error) {
        console.error("Error en la API:", error);
        return NextResponse.json({ error: "Error en la API" }, { status: 500 });
    }
}
