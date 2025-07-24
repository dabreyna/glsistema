"use client";

import React, { useEffect, useState } from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import moment from "moment";
import "moment/locale/es";
import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";
// import { id } from "date-fns/locale";

let PizZipUtils: { getBinaryContent?: any; default?: any } | null = null;
if (typeof window !== "undefined") {
    import("pizzip/utils/index.js").then(function (r) {
        PizZipUtils = r;
    });
}

function loadFile(url: string, callback: (error: any, content: any) => void) {
    PizZipUtils?.getBinaryContent(url, callback);
}

const generateDocument = async (buffer: any) => {
    //crearMovimientos();
    const nombre_cliente = `CONTRATO - ${buffer.rows[0].nombre_cliente}.docx`;
    try {
        const response = await fetch("/templates/CONTRATO_AIRES_PARAISO_2025.docx");
        if (!response.ok) {
            throw new Error(`Error al obtener la plantilla: ${response.status}`);
        }
        const content = await response.arrayBuffer();

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        }); // Carga el zip usando loadZip

        console.log("Datos a insertar:", buffer.rows[0]); // Verifica los datos justo antes de insertarlos

        doc.setData({
            fecha_actual: moment().format("LL"),
            nombre_cliente: buffer.rows[0].nombre_cliente,
            fraccionamiento: buffer.rows[0].fraccionamiento,
            no_manzana: buffer.rows[0].no_manzana,
            no_terreno: buffer.rows[0].no_terreno,
            superficie: buffer.rows[0].superficie,
            precio_lote: buffer.rows[0].precio_lote,
            ocupacion: buffer.rows[0].ocupacion,
            titulo: buffer.rows[0].abreviatura,
        });

        try {
            doc.render(); // Intenta renderizar el documento
        } catch (error: any) {
            const e = {
                message: error.message,
                stack: error.stack,
            };
            console.error(JSON.stringify(e)); // Muestra el error de renderizado en detalle
            // opcionalmente puedes lanzar el error para que se capture en el catch principal
            // throw error;
        }

        const blob = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        saveAs(blob, nombre_cliente);
    } catch (error) {
        console.error("Error al generar documento:", error);
    }
};

// interface Props {
//     buffer: any;
// }

export default function GeneraDOC() {
    const idCliente = useContratoSelectedStore((state) => state.idCliente);
    const idContrato = useContratoSelectedStore((state) => state.idContrato);
    const [datosContrato, setDatosContrato] = useState<any[]>([]);

    useEffect(() => {
        if (idCliente !== "0" && idCliente !== "") {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `/api/dashboard/utilerias/documentos/documentoWord/contrato?idCliente=${idCliente}&idContrato=${idContrato}`
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data: ${response.status}`);
                    }
                    const data = await response.json();
                    setDatosContrato(data);
                    // console.log(datosContrato);
                    // console.log(data);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [idContrato]);

    return (
        <>
            <Button onClick={() => generateDocument(datosContrato)}>Contrato</Button> {/* Corrected line */}
        </>
    );
}
