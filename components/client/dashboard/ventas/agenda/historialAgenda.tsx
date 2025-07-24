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
    nombre: string;
    fecha_alta: string;
    comentario: string;
    nombre_asesor: string;
    fecha_compromiso: string;
    nombre_comentario: string;
    clasificacion: string;
    id_cliente: string;
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
            const response = await fetch(`/api/dashboard/ventas/agenda/historialComentarios?idCliente=${id}`);
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
                                    <TableHead className="text-center">Asesor</TableHead>
                                    <TableHead className="text-center">Realizado por</TableHead>
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
                                        <TableCell className="text-center uppercase w-[180px]">{comentario.nombre_asesor}</TableCell>
                                        <TableCell className="text-center uppercase w-[180px]">{comentario.nombre_comentario}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter></TableFooter>
                        </Table>
                    </>
                </ScrollArea>
                <DialogFooter>
                    <SheetClose asChild></SheetClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
