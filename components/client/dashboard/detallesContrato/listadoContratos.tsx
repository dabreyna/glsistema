"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";
import { useEffect, useState } from "react";
import { te } from "date-fns/locale";

interface Contrato {
    id_cliente: string;
    id_contrato: string;
    terreno: string;
    id_terreno: string;
}

interface ListadoContratosProps {
    Contratos: Contrato[];
}

export default function ListadoContratos({ Contratos }: ListadoContratosProps) {
    // const idContrato = useContratoSelectedStore((state) => state).idContrato;
    // const idCliente = useContratoSelectedStore((state) => state).idCliente;

    const seleccionaContrato = useContratoSelectedStore((state) => state.setContrato);
    const seleccionaCliente = useContratoSelectedStore((state) => state.setCliente);
    const seleccionaTerreno = useContratoSelectedStore((state) => state.setTerreno);

    const handleContratoElegido = (value: string) => {
        seleccionaCliente(Contratos[0].id_cliente);
        seleccionaContrato(value);
        seleccionaTerreno(Contratos[0].id_terreno);
        // console.log("-----CC-->" + Contratos);
        // console.log("***>" + value);
        // Contratos.forEach((contrato) => {
        //     // console.log("-----Contrato-->", JSON.stringify(contrato, null, 2));

        // });
    };
    return (
        <>
            <Label htmlFor="status">Terrenos</Label>
            <Select onValueChange={handleContratoElegido}>
                <SelectTrigger id="status" aria-label="Selecciona el terreno">
                    <SelectValue placeholder="Selecciona el terreno" />
                </SelectTrigger>
                <SelectContent>
                    {Contratos.map((contrato) => (
                        <SelectItem key={contrato.id_contrato} value={contrato.id_contrato}>
                            {contrato.terreno}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}
