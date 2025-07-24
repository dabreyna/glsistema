"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast, toast } from "@/hooks/use-toast";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import moment from "moment";
import "moment/locale/es";

interface BtnTerminarVentaProps {
    idCliente: string;
    idContrato: string;
}
/*
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

        saveAs(blob, "output.docx");
    } catch (error) {
        console.error("Error al generar documento:", error);
    }
};
*/

export default function BtnTerminarVenta({ idCliente, idContrato }: BtnTerminarVentaProps) {
    // const [datosContrato, setDatosContrato] = useState<any[]>([]);
    /*
    function terminarVenta() {
        const a = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/utilerias/documentos/documentoWord/contrato?idCliente=${idCliente}&idContrato=${idContrato}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setDatosContrato(data);
                console.log(datosContrato);
            } catch (error) {
                console.error(error);
            }
        };
        a();
        if (datosContrato.length > 0) {
            // generateDocument(datosContrato);
            // router.push(`/private/dashboard/detallesContrato/${idCliente}`);
        }
    }
    return (
        <>
            <Button onClick={terminarVenta}>TERMINAR</Button>
        </>
    );
    */
    const router = useRouter();
    // function getDatosContrato() {
    //     const a = async () => {
    //         try {
    //             const response = await fetch(
    //                 `/api/dashboard/utilerias/documentos/documentoWord/contrato?idCliente=${idCliente}&idContrato=${idContrato}`
    //             );
    //             if (!response.ok) {
    //                 throw new Error(`Failed to fetch data: ${response.status}`);
    //             }
    //             const data = await response.json();
    //             console.log(data);
    //             setDatosContrato(data);
    //             console.log(datosContrato);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     a();
    // }
    function terminarVenta() {
        const crearMovimientos = async () => {
            // try {
            //     const response = await fetch(
            //         `/api/dashboard/utilerias/documentos/documentoWord/contrato?idCliente=${idCliente}&idContrato=${idContrato}`
            //     );
            //     if (!response.ok) {
            //         throw new Error(`Failed to fetch data: ${response.status}`);
            //     }
            //     const data = await response.json();
            //     setDatosContrato(data);
            //     console.log(datosContrato);
            //     console.log(data);
            // } catch (error) {
            //     console.error(error);
            // }
            try {
                // const response = await fetch(`/`, {
                const response = await fetch(
                    `/api/dashboard/ventas/prospecto/creaCorridasPago?idCliente=${idCliente}&idContrato=${idContrato}`
                );
                if (!response.ok) {
                    toast({
                        // Llama a la función toast
                        title: "Error",
                        description: "No se pudieron generar los movimientos de contrato",
                        duration: 1500,
                        variant: "destructive",
                    });
                    const errorData = await response.json(); // Intenta obtener detalles del error
                    throw new Error(`${response.status} ${response.statusText}: ${errorData.message || "Error en la solicitud"}`);
                    // throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const result = await response.json();
                if (result.Resultado == "OK") {
                    //aqui va el toast
                    toast({
                        // Llama a la función toast
                        title: "Éxito",
                        description: "Contrato MENSUALIDADES GENERADAS correctamente",
                        duration: 2500,
                        variant: "default",
                        style: {
                            background: "#25D366",
                            color: "#fff",
                        },
                    });
                    // if (datosContrato.length > 0) {

                    router.push(`/private/dashboard/detallesContrato/${idCliente}`);
                    //}
                    // router.push(`/private/dashboard/detallesContrato/${idCliente}`);
                    // redirect(`/private/dashboard/ventas/alta/${result}`);
                } else {
                    toast({
                        // Llama a la función toast
                        title: "Error",
                        description: "No se pudieron generar los movimientos de contrato",
                        variant: "destructive",
                    });
                }
                // console.log("ESTO PASO: " + result);
            } catch (error) {
                console.error(error);
            }
        };
        crearMovimientos();
    }
    return (
        <>
            <Button onClick={terminarVenta}>TERMINAR</Button>
        </>
    );
}
