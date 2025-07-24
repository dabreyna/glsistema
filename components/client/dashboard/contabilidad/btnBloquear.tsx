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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { bn } from "date-fns/locale";
import { Router } from "next/router";
import { useEffect, useState } from "react";
import { text } from "stream/consumers";
import { redirect } from "next/navigation";

interface BtnBloquearProps {
    id: string;
    bndContabilizado: string;
    textobtn: string;
}

export function BtnBloquear({ id, bndContabilizado, textobtn }: BtnBloquearProps) {
    const toast = useToast();
    const [recargar, setRecargar] = useState(false);

    function estatusBloqueo() {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/contabilidad/estatusBloqueo?id=${id}&bndContabilizado=${bndContabilizado}`);
                if (!response.ok) {
                    toast.toast({
                        title: "ERROR",
                        description: "Algo sucedio y la poliza no se pudo eliminar, intentalo de nuevo.",
                        variant: "destructive",
                        duration: 1600,
                    });
                    throw new Error(`Failed to fetch data: ${response.status}`);
                } else {
                    toast.toast({
                        title: `ORDEN EJECUTADA`,
                        description: `Poliza ${bndContabilizado === "True" ? "bloqueada" : "desbloqueada"} exitosamente.`,
                        variant: "destructive",
                        duration: 1600,
                    });
                    setRecargar(true);
                }
                // const data = await response.json();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }
    useEffect(() => {
        if (recargar) {
            // redirect("/private/dashboard/contabilidad/");
        }
    }, [recargar]);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" itemID={id}>
                    {textobtn}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{textobtn} Poliza</DialogTitle>
                    <DialogDescription>Esta seguro que deseas {textobtn} esta poliza?</DialogDescription>
                </DialogHeader>
                {/* <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" />
                    </div>
                </div> */}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={estatusBloqueo} type="button">
                            {" "}
                            {textobtn}{" "}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
