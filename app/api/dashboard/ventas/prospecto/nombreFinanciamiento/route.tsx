import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idFinanciamiento = searchParams.get("id");
    const query = `select financiamiento from cat_financiamientos where id_financiamiento=${idFinanciamiento};`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
