//"use client";

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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { set } from "lodash";
import { MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";

interface BtnComentariosProps {
    idContrato: number;
    terreno: string;
    nombreCliente: string;
}

interface Comentario {
    fecha: string | null;
    comentario: string | null;
    nombre_asesor: string | null;
}

export function BtnVerComentariosCaja({ idContrato, terreno, nombreCliente }: BtnComentariosProps) {
    const toast = useToast();
    const [comentarios, setComentarios] = useState<Comentario[]>([]);

    const fetchData = async () => {
        setComentarios([]);
        try {
            const response = await fetch(`/api/dashboard/caja/getComentarios?idContrato=${idContrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setComentarios(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={fetchData}>
                    <MessageSquareText />
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[80%] w-[full-content] max-h-[80%]">
                <DialogHeader>
                    <DialogTitle className="uppercase text-center bg-slate-200">COMENTARIOS: - {nombreCliente} -</DialogTitle>
                    <DialogDescription className="uppercase border-orange-400 border-l-4 text-left">
                        {/* Cliente: {nombreCliente}  */}
                        {"  "}&nbsp; Terreno: {terreno}
                    </DialogDescription>
                </DialogHeader>

                <Table id="tablaDatos" className="shadow-sm max-w-[full] ">
                    <ScrollArea className=" h-[400px]  w-full border-0 border-transparent">
                        <TableCaption></TableCaption>
                        <TableHeader className="border border-slate-200 bg-red-700 text-white">
                            <TableRow>
                                <TableHead className="text-center uppercase text-white">Fecha</TableHead>
                                <TableHead className="text-center uppercase text-white">Usuario</TableHead>
                                <TableHead className="text-center uppercase text-white">Comentario</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <>
                                {comentarios.map((comentario) => (
                                    <TableRow
                                        key={`${comentario.fecha}-${comentario.nombre_asesor}`}
                                        className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer w-[100%]"
                                    >
                                        <TableCell className="text-center w-[full-content]">{comentario.fecha}</TableCell>
                                        <TableCell className="text-center w-[full-content] uppercase">{comentario.nombre_asesor}</TableCell>
                                        <TableCell className="text-left w-[full-content]">{comentario.comentario}</TableCell>
                                    </TableRow>
                                ))}
                            </>
                        </TableBody>
                    </ScrollArea>
                </Table>

                <DialogFooter>
                    <DialogClose asChild>{/* <Button type="button"> Eliminar </Button> */}</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
