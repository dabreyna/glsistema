import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileClock } from "lucide-react";
import moment from "moment";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Comentario {
    id_cliente: string;
    // id_contrato: string;
    nombre: string;
    fecha_alta: string;
    fecha_compromiso: string;
    comentario: string;
    clasificacion: string;
    tipo_comentario: string;
    nombre_asesor: string;
}

export function HistorialAgenda({ id }: { id: string }) {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    function print() {
        // window.print();
        // document.getElementById("tablaDatos").style.display = "none";
    }

    const fetchData = async () => {
        try {
            console.log(id);
            const response = await fetch(`/api/dashboard/cobranza/agenda/historialComentarios?idContrato=${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setComentarios(data);
        } catch (error) {
            console.error(error);
        }
    };
    const hoy = moment().format("DD-MM-YYYY");
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" onClick={fetchData} className="uppercase ">
                    <FileClock size={48} />
                    Historial
                </Button>
            </DialogTrigger>
            <DialogContent className=" md:max-w-full sm:min-w-[430px] lg:max-w-[95%] h-[90%]">
                <ScrollArea className="h-6/6 w-full rounded-md border p-4">
                    <DialogHeader>
                        <DialogTitle className="text-center uppercase">Historial Comentarios</DialogTitle>
                        <DialogDescription>
                            Fecha: {hoy} <br />
                            <br />
                        </DialogDescription>
                    </DialogHeader>
                    <>
                        <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm">
                            <TableCaption> </TableCaption>
                            <TableHeader className="border-2 border-slate-200 shadow-lg">
                                <TableRow>
                                    <TableHead className="text-center w-[80px]"># Cliente</TableHead>
                                    <TableHead className="text-center">Cliente</TableHead>
                                    <TableHead className="text-center">Fecha Alta</TableHead>
                                    <TableHead className="text-center">Fecha Compromiso</TableHead>
                                    <TableHead className="text-center">Comentario</TableHead>
                                    <TableHead className="text-center">Clasificacion</TableHead>
                                    <TableHead className="text-center">Tipo Comentario</TableHead>
                                    <TableHead className="text-center">Asesor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comentarios.map((comentario) => (
                                    <TableRow key={comentario.fecha_alta}>
                                        <TableCell className="font-medium text-xs text-center  w-[80px]">{comentario.id_cliente}</TableCell>
                                        <TableCell className="text-center uppercase w-max-[120px]">{comentario.nombre}</TableCell>
                                        <TableCell className="text-center uppercase w-[80px]">{comentario.fecha_alta}</TableCell>
                                        <TableCell className="text-center uppercase w-[80px]">{comentario.fecha_compromiso}</TableCell>
                                        <TableCell className="text-center uppercase">{comentario.comentario}</TableCell>
                                        <TableCell className="text-center uppercase w-[180px]">{comentario.clasificacion}</TableCell>
                                        <TableCell className="text-center uppercase w-[180px]">{comentario.tipo_comentario}</TableCell>
                                        <TableCell className="text-center uppercase w-[180px]">{comentario.nombre_asesor}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter></TableFooter>
                        </Table>
                    </>
                </ScrollArea>
                <DialogFooter>
                    <SheetClose asChild>
                        {/* <Button
                            onClick={() => {
                                function print() {
                                    // Get the element to be printed
                                    const elementToPrint = document.getElementById("tablaDatos2");

                                    // Create a temporary container
                                    const tempElement = document.createElement("div");

                                    // Append the element to the temporary container
                                    tempElement.appendChild(elementToPrint!.cloneNode(true)); // Clone to avoid modifying original

                                    // Optional: Adjust styles for printing
                                    tempElement.style.cssText = `
                      font-size: 10px; 
                      margin: 20px; 
                      page-break-after: always; 
                    `;

                                    // Add the temporary element to the document (temporarily)
                                    document.body.appendChild(tempElement);

                                    // Trigger the print dialog
                                    window.print();

                                    // Remove the temporary element
                                    document.body.removeChild(tempElement);
                                }
                            }}
                        >
                            Imprimir
                        </Button> */}
                    </SheetClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
