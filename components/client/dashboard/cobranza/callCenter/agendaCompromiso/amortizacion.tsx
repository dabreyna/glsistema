"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface AmortizacionProps {
    idContrato: string;
}
interface Amortizacion {
    no_pago: number;
    fecha_movimiento: string;
    monto: number;
    intereses: number;
    bnd_atrasado: number;
}

export function Amortizacion({ idContrato }: AmortizacionProps) {
    const [datosCliente, setDatosCliente] = useState<Amortizacion[]>([]);
    // const [isOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/callCenter/amortizacion?idContrato=${idContrato}`);
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
    let mensualidades = datosCliente.length;
    let saldoInicial = 0;
    let saldoFinal = 0;
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-y-4 gap-x-8 text-black border border-primary-500 rounded-md p-2 bg-muted">
                <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                    <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                    <TableHeader className="border border-slate-200 bg-red-700 text-white">
                        <TableRow>
                            <TableHead className="text-center p-0 text-white"># Pago</TableHead>
                            <TableHead className="text-center p-0 text-white">Fecha Mensualidad</TableHead>
                            <TableHead className="text-center p-0 text-white">Saldo Inicial</TableHead>
                            <TableHead className="text-center p-0 text-white">Capital</TableHead>
                            <TableHead className="text-center p-0 text-white">Intereses</TableHead>
                            <TableHead className="text-center p-0 text-white">Total</TableHead>
                            <TableHead className="text-center p-0 text-white">Saldo Final</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {datosCliente.map((amortizacion) => {
                                consecutivo++;
                                saldoInicial = Number(amortizacion.monto) * mensualidades;
                                saldoFinal = saldoInicial - Number(amortizacion.monto);
                                mensualidades--;
                                const atrasado = amortizacion.bnd_atrasado === 1 ? "bg-red-300" : "";
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className={`hover:bg-slate-300 hover:font-semibold hover:cursor-pointer ${atrasado}`}
                                    >
                                        <TableCell className="text-center uppercase p-1">{amortizacion.no_pago}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{amortizacion.fecha_movimiento}</TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(saldoInicial))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(amortizacion.monto))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(amortizacion.intereses))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(Number(amortizacion.intereses) + Number(amortizacion.monto)))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(saldoFinal))}
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
