"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { MessageSquareText, Printer, Receipt } from "lucide-react"; // Import Printer icon
import { useRef, useCallback } from "react"; // Import useRef and useCallback

interface BtnMostrarReciboProps {
    idRecibo: number;
    idContrato: number;
}

export function BtnMostrarRecibo({ idRecibo, idContrato }: BtnMostrarReciboProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const pdfUrl = `/api/dashboard/caja/mostrarRecibo/Recibo_${idContrato}_${idRecibo}.pdf`;

    const handlePrint = useCallback(() => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow?.print();
        }
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Receipt className="mr-2 h-4 w-4" /> #{idRecibo}
                </Button>
            </DialogTrigger>

            <DialogContent className="min-w-[80%] w-[full-content] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="uppercase text-center bg-slate-200 p-2 rounded-t-lg">Recibo #{idRecibo}</DialogTitle>
                    <DialogDescription className="uppercase border-orange-400 border-l-4 text-left p-2 mt-2">
                        Contrato #{idContrato}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-grow overflow-hidden relative h-[calc(90vh-180px)]">
                    {" "}
                    <iframe ref={iframeRef} src={pdfUrl} title={`Recibo ${idRecibo}`} width="100%" height="100%" style={{ border: "none" }}>
                        <p>
                            Tu navegador no soporta iframes. Puedes descargar el PDF{" "}
                            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                aquí
                            </a>
                            .
                        </p>
                    </iframe>
                </div>

                <DialogFooter className="flex justify-end p-4 border-t mt-4">
                    <Button onClick={handlePrint} className="mr-2">
                        <Printer className="mr-2 h-4 w-4" /> Imprimir Recibo
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cerrar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
