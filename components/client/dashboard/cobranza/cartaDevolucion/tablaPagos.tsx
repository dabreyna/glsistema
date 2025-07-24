"use client";

import * as React from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Pago {
    nopago_texto: string;
    no_pago: number;
    fecha: string;
    monto: number;
    comentarios: string;
}

interface FiltrosConsultaProps {
    pagos: Pago[];
}
export default function TablaPagos({ pagos }: FiltrosConsultaProps) {
    let consecutivo = 0;
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-y-4 gap-x-8 text-black border border-primary-500 rounded-md p-2 bg-muted ">
                <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                    <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                    <TableHeader className="border border-slate-200 bg-red-700 text-white">
                        <TableRow>
                            <TableHead className="text-center p-0 text-white min-w-[300px]">No. Pago</TableHead>
                            <TableHead className="text-center p-0 text-white min-w-[200px]">Fecha</TableHead>
                            <TableHead className="text-center p-0 text-white min-w-[200px]">Pago</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {pagos.map((pago) => {
                                consecutivo++;
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className="hover:bg-slate-300 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center uppercase p-1">{pago.nopago_texto}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{pago.fecha}</TableCell>
                                        <TableCell className="text-right uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(pago.monto))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                        <TableRow>
                            <TableCell className="text-center uppercase p-1 text-right" colSpan={2}>Total: &nbsp;&nbsp;</TableCell>
                            <TableCell className="text-right uppercase p-1">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(pagos.reduce((total, pago) => total + pago.monto, 0).toFixed(2)))} 
                                {/* {conceptos.reduce((total, concepto) => total + concepto.monto, 0).toFixed(2)} */}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
