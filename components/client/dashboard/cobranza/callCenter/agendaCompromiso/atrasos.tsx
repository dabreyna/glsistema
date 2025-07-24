"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface AtrasosProps {
    idContrato: string;
}
interface Atraso {
    mensualidades: number;
    monto_vencido: number;
    dias_vencimiento: number;
    interes: number;
    saldo_total: number;
}

export function Atrasos({ idContrato }: AtrasosProps) {
    const [datosCliente, setDatosCliente] = useState<Atraso[]>([]);
    // const [isOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/callCenter/atrasos?idContrato=${idContrato}`);
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
                            <TableHead className="text-center p-0 text-white">Mensualidades</TableHead>
                            <TableHead className="text-center p-0 text-white">Importe</TableHead>
                            <TableHead className="text-center p-0 text-white">Dias de atraso</TableHead>
                            <TableHead className="text-center p-0 text-white">Intereses</TableHead>
                            <TableHead className="text-center p-0 text-white">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {datosCliente.map((atraso) => {
                                consecutivo++;
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center uppercase p-1">
                                            {atraso.mensualidades}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(atraso.monto_vencido))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">{atraso.dias_vencimiento}</TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {" "}
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(atraso.interes))}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {" "}
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(atraso.saldo_total))}
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
