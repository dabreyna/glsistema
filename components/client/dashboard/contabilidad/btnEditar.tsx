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
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import DatosPoliza from "./datosPoliza";
import { da } from "date-fns/locale";

interface BtnEliminarProps {
    id: string;
}
interface Poliza {
    id_poliza: string;
    finicio: string;
    ffin: string;
    concepto_poliza: string;
    concepto_movimiento: string;
    tipo_cambio: string;
    folio: string;
    id_empresa: string;
}

interface Empresa {
    id_empresa: string;
    razon_social: string;
}

export function BtnEditar({ id }: BtnEliminarProps) {
    const toast = useToast();
    const [datosPoliza, setDatosPoliza] = useState<Poliza[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/contabilidad/datosPoliza?id=${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setDatosPoliza(data);
        } catch (error) {
            console.error(error);
        }
        try {
            const response = await fetch(`/api/dashboard/contabilidad/empresas`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setEmpresas(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={fetchData}>
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Editar Poliza</DialogTitle>
                    <DialogDescription>Valida los datos antes de modificar esta poliza!</DialogDescription>
                </DialogHeader>
                <DatosPoliza listaEmpresas={empresas} poliza={datosPoliza} />
                <DialogFooter>
                    <DialogClose asChild>{/* <Button type="button"> Eliminar </Button> */}</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
