"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface CorridaPago {
    num_pago: number;
    mensualidad: string;
    saldo: string;
    fecha: string;
}
interface CorridaDePagosProps {
    tablaPagos: CorridaPago[];
}

export default function CorridaDePagos({ tablaPagos }: CorridaDePagosProps) {
    return (
        <>
            <Table id={`tablaMensualidadesVencidas`} className="rounded-md border-2 border-slate-200 shadow-sm min-w-[800px]">
                <TableHeader className="border-2 border-slate-200 shadow-lg g-1">
                    <TableRow>
                        <TableHead className="text-center">No. Pago</TableHead>
                        <TableHead className="text-center">Fecha</TableHead>
                        <TableHead className="text-right">Mensualidad</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tablaPagos.map((pago) => (
                        <TableRow>
                            <TableCell className="text-center">{pago.num_pago}</TableCell>
                            <TableCell className="text-center">{pago.fecha}</TableCell>
                            <TableCell className="text-right">{pago.mensualidad}</TableCell>
                            <TableCell className="text-right">{pago.saldo}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter></TableFooter>
            </Table>
        </>
    );
}
