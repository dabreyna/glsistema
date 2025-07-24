import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { id } from "date-fns/locale";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const fechaInicial = searchParams.get("fechaInicial");
    const numeroPagos = searchParams.get("numeroPagos");
    const montoMensual = searchParams.get("montoMensual");
    const primerPago = searchParams.get("primerPago");

    return NextResponse.json("1", { status: 200 });
}
