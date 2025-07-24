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
import { MessageSquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import TerrenoProspecto from "../ventas/terreno";
import { Textarea } from "@/components/ui/textarea";
import { now } from "moment";
import moment from "moment";
import flashy from "@pablotheblink/flashyjs";

interface BtnComentariosProps {
    idContrato: number;
    idUsuario: string;
    terreno: string;
    nombreCliente: string;
}

export function BtnNuevoComentarioCaja({ idContrato, idUsuario, nombreCliente, terreno }: BtnComentariosProps) {
    const toast = useToast();
    const [comentario, setComentario] = useState<string>("");
    const limpiaCaja = () => {
        setComentario("");
    };

    const handleComentario = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComentario(event.target.value);
    };
    const GuardaComentario = async () => {
        try {
            const response = await fetch(`/api/dashboard/caja/registrarComentario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comentario: comentario,
                    id_contrato: idContrato,
                    id_usuario: idUsuario,
                }),
            });
            if (!response.ok) {
                // const errorData = await response.json(); // Intenta obtener detalles del error
                // throw new Error(`${response.status} ${response.statusText}: ${errorData.message || "Error en la solicitud"}`);
            }
            const data = await response.json();
            // console.log(data);
            if (data === "OK") {
                flashy.success("¡Comentario guardado correctamente!");
                limpiaCaja();
            } else {
                flashy.error("¡Error al guardar comentario!");
            }
        } catch (error) {}
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={limpiaCaja}>
                    <MessageSquarePlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <DialogTitle className="uppercase text-center bg-slate-200">agregar comentario: - {nombreCliente} -</DialogTitle>
                    <DialogDescription className="uppercase border-orange-400 border-l-4 text-left">
                        {/* Cliente: {nombreCliente}  */}
                        {"  "}&nbsp; Terreno: {terreno}
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="comentario">Comentario:</Label>
                <Textarea
                    id="comentario"
                    className="w-full h-full"
                    placeholder="Escribe un comentario"
                    onChange={handleComentario}
                    value={comentario}
                    // onChange={(event) => setComentarios(event.target.value)}
                />
                <Button className="p-6 uppercase w-[200px]" variant="default" onClick={GuardaComentario}>
                    guardar comentario
                </Button>
                <DialogFooter>
                    <DialogClose asChild>{/* <Button type="button"> Eliminar </Button> */}</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
