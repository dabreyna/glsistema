"use client";

import * as React from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Concepto {
    concepto: string;
    monto: number;
}

interface FiltrosConsultaProps {
    conceptos: Concepto[];
}
export default function TablaConceptos({ conceptos }: FiltrosConsultaProps) {
    let consecutivo = 0;
    let totalTabla =
        Number(conceptos.reduce((total, concepto) => total + concepto.monto, 0).toFixed(2)) > 0
            ? conceptos.reduce((total, concepto) => total + concepto.monto, 0).toFixed(2)
            : 0;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-y-4 gap-x-8 text-black border border-primary-500 rounded-md p-2 bg-muted ">
                <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                    <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                    <TableHeader className="border border-slate-200 bg-red-700 text-white">
                        <TableRow>
                            <TableHead className="text-center p-0 text-white min-w-[300px]">Concepto</TableHead>
                            <TableHead className="text-center p-0 text-white min-w-[200px]">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {conceptos.map((concepto) => {
                                consecutivo++;
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className="hover:bg-slate-300 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center uppercase p-1">{concepto.concepto}</TableCell>
                                        <TableCell className="text-right uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(concepto.monto))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                        <TableRow>
                            <TableCell className="text-center uppercase p-1 text-right">Total: &nbsp;&nbsp;</TableCell>
                            <TableCell className="text-right uppercase p-1">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalTabla))}
                                {/* {conceptos.reduce((total, concepto) => total + concepto.monto, 0).toFixed(2)} */}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
