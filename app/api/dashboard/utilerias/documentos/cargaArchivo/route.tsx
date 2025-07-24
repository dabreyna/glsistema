import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import dbQueryParams from "@/lib/dbQueryParams";
import dbQuery from "@/lib/dbQuery";

export const POST = async (req: NextRequest) => {
    const formData = await req.formData();

    const file = formData.get("file") as Blob | null;
    const tipoDocumento = formData.get("documento") as string;
    const idCliente = formData.get("idCliente") as string;
    const idContrato = formData.get("idContrato") as string;
    const idTerreno = formData.get("idTerreno") as string;

    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    let filename = "undefined_filename";
    if (file instanceof File) {
        const fileExtension = file.name.split(".").pop();
        if (fileExtension) {
            filename = `${idCliente}_${idContrato}_${tipoDocumento}.${fileExtension}`;
        } else {
            filename = `${idCliente}_${idContrato}_${tipoDocumento}`;
        }
    } else {
        filename = `${idCliente}_${idContrato}_${tipoDocumento}.bin`;
    }

    const uploadDir = path.join(process.cwd(), "app/private/dashboard/documentos/requisitos", idCliente);

    if (!existsSync(uploadDir)) {
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
            console.error("Error al crear el directorio:", mkdirError);
            return NextResponse.json({ Message: "Failed to create directory", status: 500 }, { status: 500 });
        }
    }
    const filePath = path.join(uploadDir, filename);

    try {
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        const query = `insert into requisitos_fraccionamiento_terreno(archivo,ruta_archivo,id_terreno,id_cliente,id_contrato,fecha)
       values('${filename}','${filename}',${idTerreno},${idCliente},${idContrato},now()) returning id_requisito_fraccionamiento_terreno;`;

        const idRequisito = await dbQuery(query);
        if (idRequisito.rows.length > 0) {
            return NextResponse.json({ Message: filename, status: 201 });
        } else {
            return NextResponse.json({ Message: "Error", status: 500 });
        }
    } catch (error: any) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
