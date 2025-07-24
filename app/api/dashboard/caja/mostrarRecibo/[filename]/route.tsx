import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RECEIPTS_DIR = path.join(process.cwd(), "recibos");

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
    const filename = params.filename;

    if (!filename) {
        return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const filePath = path.join(RECEIPTS_DIR, filename);

    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "PDF not found" }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const response = new Response(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${filename}"`,
                "Cache-Control": "public, max-age=31536000",
            },
        });

        return response;
    } catch (error) {
        console.error("Error serving PDF:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
