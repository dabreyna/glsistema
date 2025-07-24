"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface MensualidadVencida {
    no_pago: number;
    fecha: string;
    fecha2: string;
    deposito: string;
    deposito_preferente: string;
    intereses: string;
    dias?: string;
}

export default function TablaDeSaldosVencidos({ datosSaldosVencidos }: { datosSaldosVencidos: MensualidadVencida[] }) {
    const calcularTotales = () => {
        let totalIntereses = 0;
        let totalDepositoPreferente = 0;
        let totalDepositos = 0;

        if (datosSaldosVencidos && datosSaldosVencidos.length > 0) {
            datosSaldosVencidos.forEach((resultado) => {
                // Usamos forEach para calcular totales
                const intereses = parseFloat(resultado.intereses);
                const depPreferentes = parseFloat(resultado.deposito_preferente);
                const deposito = parseFloat(resultado.deposito);

                totalIntereses += intereses || 0; // Usamos || 0 para manejar valores inválidos
                totalDepositoPreferente += depPreferentes || 0;
                totalDepositos += deposito || 0;
            });
        }

        return { totalIntereses, totalDepositoPreferente, totalDepositos };
    };

    const { totalIntereses, totalDepositoPreferente, totalDepositos } = calcularTotales();

    return (
        <>
            <Table id={`tablaMensualidadesVencidas`} className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]">
                <TableHeader className="border-2 border-slate-200 shadow-lg g-1">
                    <TableRow>
                        <TableHead className="text-center">No. Pago</TableHead>
                        <TableHead className="text-center">Fecha</TableHead>
                        <TableHead className="text-right">Depósito</TableHead>
                        <TableHead className="text-right">Depósito preferente</TableHead>
                        <TableHead className="text-right">Intereses</TableHead>
                        <TableHead className="text-center">Días de atraso</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* {datosSaldosVencidos.length > 0 ? ( */}
                    {datosSaldosVencidos && datosSaldosVencidos.length > 0 ? (
                        <>
                            {datosSaldosVencidos.map((resultado) => {
                                const intereses = parseFloat(resultado.intereses);
                                const depPreferentes = parseFloat(resultado.deposito_preferente);
                                // const deposito = parseFloat(resultado.deposito);
                                // totalIntereses = totalIntereses + intereses;
                                // totalDepositoPreferente = totalDepositoPreferente + depPreferentes;
                                // totalDepositos = parseFloat(resultado.deposito);
                                return (
                                    <TableRow
                                        key={`${resultado.no_pago}`}
                                        className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center">{resultado.no_pago}</TableCell>
                                        <TableCell className="text-center">{resultado.fecha2}</TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(resultado.deposito))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(resultado.deposito_preferente))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(resultado.intereses))}
                                        </TableCell>
                                        <TableCell className="text-center">{resultado.dias}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center">
                                No existen datos.
                            </TableCell>
                            <TableCell colSpan={1} className="text-right">
                                0.00
                            </TableCell>
                            <TableCell colSpan={1} className="text-right">
                                0.00
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2} className="text-center">
                            SUBTOTALES
                        </TableCell>
                        <TableCell colSpan={1} className="text-right">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(totalDepositos))}
                        </TableCell>
                        <TableCell colSpan={1} className="text-right">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(totalDepositoPreferente))}
                        </TableCell>
                        <TableCell colSpan={1} className="text-right">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(totalIntereses))}
                        </TableCell>
                        <TableCell colSpan={1}></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    );
}
