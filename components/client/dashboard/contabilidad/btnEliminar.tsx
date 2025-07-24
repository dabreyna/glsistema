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

interface BtnEliminarProps {
    id: string;
    poliza: string;
    empresa: string;
    fInicio: string;
    fFin: string;
}

export function BtnEliminar({ id, poliza, empresa, fInicio, fFin }: BtnEliminarProps) {
    const toast = useToast();

    function eliminarPoliza() {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/contabilidad/eliminar?id=${id}`);
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
                        description: `Poliza ${poliza} de ${empresa} eliminada exitosamente.`,
                        variant: "destructive",
                        duration: 1600,
                    });
                }
                // const data = await response.json();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Eliminar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Eliminar Poliza</DialogTitle>
                    <DialogDescription>Esta seguro que desea eliminar esta poliza?</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Poliza
                        </Label>
                        <Input id="name" value={id} className="col-span-5" disabled />
                    </div>
                    <div className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Empresa
                        </Label>
                        <Input id="name" value={empresa} className="col-span-5" disabled />
                    </div>
                    <div className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Periodo
                        </Label>
                        <Input id="name" value={`${fInicio} - ${fFin}`} className="col-span-5" disabled />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={eliminarPoliza} type="button">
                            {" "}
                            Eliminar{" "}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
