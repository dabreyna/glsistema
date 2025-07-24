"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface ServiciosHistorialProps {
    idContrato: string;
}
interface ServicioHistorial {
    servicio: string;
    monto: number;
    estatus: number;
    fecha_movimiento: string;
    fecha_pago: string;
    lectura_anterior: number;
    lectura_actual: number;
    consumo_m3: number;
}

export function ServiciosHistorial({ idContrato }: ServiciosHistorialProps) {
    const [datosCliente, setDatosCliente] = useState<ServicioHistorial[]>([]);
    // const [isOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/callCenter/serviciosHistorial?idContrato=${idContrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setDatosCliente(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (idContrato != "0" && idContrato != undefined) {
            fetchData();
        }
    }, [idContrato]);
    let consecutivo = 0;
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-y-4 gap-x-8 text-black border border-primary-500 rounded-md p-2 bg-muted">
                <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                    <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                    <TableHeader className="border border-slate-200 bg-red-700 text-white">
                        <TableRow>
                            <TableHead className="text-center p-0 text-white">Servicio</TableHead>
                            <TableHead className="text-center p-0 text-white">Monto</TableHead>
                            <TableHead className="text-center p-0 text-white">Estatus</TableHead>
                            <TableHead className="text-center p-0 text-white">Fecha Movimiento</TableHead>
                            <TableHead className="text-center p-0 text-white">Fecha Pago</TableHead>
                            <TableHead className="text-center p-0 text-white">Lecturas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {datosCliente.map((servicio) => {
                                consecutivo++;
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center uppercase p-1">
                                            {servicio.servicio}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(servicio.monto))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">{servicio.estatus}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{servicio.fecha_movimiento}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{servicio.fecha_pago}</TableCell>
                                    <TableCell className="text-center uppercase p-1">
                                        <span>Lectura Anterior: {servicio.lectura_anterior}</span><br />
                                        <span>Lectura Actual: {servicio.lectura_actual}</span><br />
                                        <span>Total Consumo M3: {servicio.consumo_m3}</span>

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
