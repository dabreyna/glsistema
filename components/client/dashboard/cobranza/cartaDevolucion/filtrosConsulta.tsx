"use client";

import * as React from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
// import { Cliente } from "../callCenter/tablaDatos2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DatosCartaCancelacion } from "@/components/client/dashboard/cobranza/cartaDevolucion/datosCartaCancelacion";

interface Cliente {
    nombre_cliente: string;
    id_contrato: number;
    empresa: string;
    terreno: string;
    monto_devolucion: number;
    estatus_contrato: string;
    saldo: number;
    fecha_contrato: string;
    fecha_cancelacion: string;
    precio_inicial: number;
}

interface FiltrosConsultaProps {
    idUsuario: number;
    perfilUsuario: number;
}
export default function FiltrosConsulta({ idUsuario, perfilUsuario }: FiltrosConsultaProps) {
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [listado, setListado] = useState<Cliente[]>([]);

    function getDatos() {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/cobranza/cartaDevolucion?nombreCliente=${nombreCliente}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setListado(data);
                // console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }

    let consecutivo = 0;
    return (
        <>
            {" "}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                        placeholder="Ej. Jorge Perez"
                        id="cliente"
                        className="uppercase"
                        onChange={(event) => setNombreCliente(event.target.value)}
                    />
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-4 " size={"sm"} variant="default" onClick={getDatos}>
                BUSCAR
            </Button>
            <Separator className="my-4 size-1 bg-white" />
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-y-4 gap-x-8 text-black border border-primary-500 rounded-md p-2 bg-muted">
                <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                    <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                    <TableHeader className="border border-slate-200 bg-red-700 text-white">
                        <TableRow>
                            <TableHead className="text-center p-0 text-white">Cliente</TableHead>
                            <TableHead className="text-center p-0 text-white">Contrato</TableHead>
                            <TableHead className="text-center p-0 text-white">Emrpesa</TableHead>
                            <TableHead className="text-center p-0 text-white">Terreno</TableHead>
                            <TableHead className="text-center p-0 text-white">Monto a devolver</TableHead>
                            <TableHead className="text-center p-0 text-white">Estatus contrato</TableHead>
                            <TableHead className="text-center p-0 text-white">Saldo</TableHead>
                            <TableHead className="text-center p-0 text-white">Fecha Contrato</TableHead>
                            <TableHead className="text-center p-0 text-white">Fecha Cancelacion</TableHead>
                            <TableHead className="text-center p-0 text-white"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {listado.map((carta) => {
                                consecutivo++;
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className="hover:bg-slate-300 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center uppercase p-1">{carta.nombre_cliente}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{carta.id_contrato}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{carta.empresa}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{carta.terreno}</TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(carta.monto_devolucion))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">{carta.estatus_contrato}</TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(carta.saldo))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">{carta.fecha_contrato}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{carta.fecha_cancelacion}</TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            <DatosCartaCancelacion
                                                id_contrato={carta.id_contrato}
                                                id_usuario={idUsuario}
                                                perfil_usuario={perfilUsuario}
                                                nombre_cliente={carta.nombre_cliente}
                                                precio_inicial={carta.precio_inicial}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
