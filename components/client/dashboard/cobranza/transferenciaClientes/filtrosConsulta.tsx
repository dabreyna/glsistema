"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface Asesor {
    id_usuario: string;
    nombre_asesor: string;
}

interface Cliente {
    id_cliente: string;
    nombre_cliente: string;
}

interface FiltrosConsultaProps {
    listaAsesores: Asesor[];
}

export default function FiltrosTransferenciaClientes({ listaAsesores }: FiltrosConsultaProps) {
    const [asesorOrigen, setAsesorOrigen] = useState<string>("0");
    const [asesorDestino, setAsesorDestino] = useState<string>("0");
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

    /**
     * NUEVO: Función que maneja el cambio de estado de un checkbox.
     * Agrega o elimina el ID del cliente de la lista de seleccionados.
     * @param isChecked - Booleano que indica si el checkbox está marcado (true) o desmarcado (false).
     * @param clientId - El ID del cliente asociado al checkbox.
     */
    const handleCheckedChange = (isChecked: boolean, clientId: string) => {
        if (isChecked) {
            // Si el checkbox se marca, añade el ID del cliente a la lista
            setSelectedClientIds((prevIds) => [...prevIds, clientId]);
        } else {
            // Si el checkbox se desmarca, elimina el ID del cliente de la lista
            setSelectedClientIds((prevIds) => prevIds.filter((id) => id !== clientId));
        }
    };

    const muestraClientes = () => {
        // console.log(selectedClientIds);
        if (asesorDestino === "0") {
            alert("Falta seleccionar el asesor destino");
        } else {
            if (asesorDestino === asesorOrigen) {
                alert("El asesor origen y el asesor destino no pueden ser iguales");
            } else {
                if (selectedClientIds.length === 0) {
                    alert("Falta seleccionar al menos un cliente");
                } else {
                    console.log(selectedClientIds);
                    const transferir = async () => {
                        try {
                            const response = await fetch(`/api/dashboard/cobranza/transferenciaClientes/transferir`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    selectedClientIds: selectedClientIds,
                                    idAsesorOrigen: asesorOrigen,
                                    idAsesorDestino: asesorDestino,
                                }),
                            });
                            if (!response.ok) {
                                toast({
                                    // Llama a la función toast
                                    title: "Error",
                                    description: "Por favor, comprueba los datos, la transferencia no se pudo realizar",
                                    variant: "destructive",
                                });
                                throw new Error(`Failed to fetch data: ${response.status}`);
                            } else if (response.ok) {
                                //aqui va el toast
                                toast({
                                    // Llama a la función toast
                                    title: "Éxito",
                                    description: "Transferencia realizada correctamente",
                                    duration: 2500,
                                    variant: "default",
                                    style: {
                                        background: "#25D366",
                                        color: "#fff",
                                    },
                                });
                                setClientes([]);
                                setSelectedClientIds([]);
                                // router.push(`/private/dashboard/cobranza/transferenciaClientes/`);
                            } else {
                                toast({
                                    // Llama a la función toast
                                    title: "Error",
                                    description: "Por favor, comprueba los datos, el prospecto no puede ser agregado",
                                    variant: "destructive",
                                });
                            }

                            console.log(response);
                        } catch (error) {
                            console.log(error);
                        }
                    };
                    transferir();
                }
            }
        }
    };
    function getDatos() {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/cobranza/transferenciaClientes/listaClientes?idAsesorOrigen=${asesorOrigen}`);
                if (!response.ok) {
                    //throw new Error(`Failed to fetch data: ${response.json()}`);
                    const data = await response.json();
                    alert(data.error);
                }
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="asesorOrigen">Asesor Origen</Label>
                    <Select onValueChange={setAsesorOrigen} value={asesorOrigen}>
                        <SelectTrigger id="asesorOrigen" aria-label="Selecciona el Asesor">
                            <SelectValue placeholder="Selecciona el Asesor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="asesorOrigen0" key="asesorOrigen0">
                                Selecciona el Asesor
                            </SelectItem>
                            {listaAsesores.map((asesor) => (
                                <SelectItem
                                    key={`asesorOrigen-${asesor.id_usuario}`}
                                    value={asesor.id_usuario}
                                    onSelect={() => {
                                        console.log("asasasa");
                                    }}
                                >
                                    {asesor.nombre_asesor}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="asesorDestino">Asesor Destino</Label>
                    <Select onValueChange={setAsesorDestino} value={asesorDestino}>
                        <SelectTrigger id="asesorDestino" aria-label="Selecciona Asesor">
                            <SelectValue placeholder="Selecciona Asesor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="asesorDestino0" key="asesorDestino0">
                                Selecciona Asesor
                            </SelectItem>
                            {listaAsesores.map((asesor) => (
                                <SelectItem key={`asesorDestino-${asesor.id_usuario}`} value={asesor.id_usuario}>
                                    {asesor.nombre_asesor}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Separator className="my-2 size-0" />
            <div className="p-4">
                <Button className="p-4 " size={"sm"} variant="default" onClick={getDatos}>
                    BUSCAR
                </Button>
                &nbsp;&nbsp;
                <Button className="p-4 " size={"sm"} variant="default" onClick={muestraClientes}>
                    TRANSFERIR
                </Button>
            </div>
            <Separator className="my-2 size-0 bg-white" />
            <Separator className="my-2 size-0 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
                    <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[1000px]">
                        <TableCaption>GRUPO LOTIFICADORA - TRANSFERENCIA DE CLIENTES - </TableCaption>
                        <TableHeader className="border-2 border-slate-200 shadow-lg">
                            <TableRow className="sticky top-0 bg-slate-200 z-10">
                                <TableHead className="text-center w-[40px]">Clientes:</TableHead>
                                <TableHead className="text-left"> {clientes.length} </TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead className="text-center w-[0px]"></TableHead>
                                <TableHead className="text-center">Cliente</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientes.map((cliente) => (
                                <TableRow
                                    // La key puede ser solo id_cliente, ya que es único
                                    key={cliente.id_cliente}
                                    className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                                >
                                    <TableCell className="text-center">
                                        <Checkbox
                                            id={cliente.id_cliente}
                                            // Llama a la nueva función handleCheckedChange
                                            onCheckedChange={(isChecked: boolean) => handleCheckedChange(isChecked, cliente.id_cliente)}
                                            // El estado 'checked' del checkbox refleja si el ID está en la lista de seleccionados
                                            checked={selectedClientIds.includes(cliente.id_cliente)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-left">{cliente.nombre_cliente}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
