"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useReporteRecuperacionDeCarteraResultadosConsultaStore } from "@/app/store/dashboard/reportes/recuperacionDeCartera/resultadosConsultaStore";
// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { set } from "lodash";

interface Cartera {
    id_empresa: string;
    razon_social: string;
    fraccionamiento: string;
    exigible: string;
    cobranza_real: string;
    cobranza_otros: string;
}

export default function TablaDatos() {
    const resultados = useReporteRecuperacionDeCarteraResultadosConsultaStore((state) => state.resultados);

    function calculaMonto(porcentaje: string, no_pagos: string, total_terreno: string) {
        const porcentaje_num = Number(porcentaje) / 100;
        const precioTerreno = Number(Number(total_terreno) * porcentaje_num + Number(total_terreno));
        const mensualidad = Number((precioTerreno / Number(no_pagos)).toFixed(2));

        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(mensualidad);
    }
    let total = 0;
    let total1 = 0;
    let total2 = 0;
    // let total3 = 0;
    const tt = resultados.map((razon_social) => {
        // total += Number(razon_social.cartera.length);
    });
    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm max-w-[700px] mx-auto border-2">
                <TableCaption>GRUPO LOTIFICADORA - RECUPERACION DE CARTERA - </TableCaption>
                <TableHeader>
                    {/* <TableRow>
                        <TableHead className="text-center" colSpan={12}></TableHead>
                    </TableRow> */}
                    <TableRow>
                        <TableHead className="text-center">Fraccionamiento</TableHead>
                        <TableHead className="text-center">Exigible del mes</TableHead>
                        <TableHead className="text-center">Real del mes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resultados.map((razon_social) => (
                        <>
                            <TableRow key={razon_social.razon_social} className="shadownc-table__row my-row">
                                <TableCell colSpan={11} className="font-medium text-xs bg-slate-100" style={{ height: "10px", padding: 2 }}>
                                    {razon_social.razon_social}
                                </TableCell>
                            </TableRow>
                            {razon_social.cartera.map((datos) => {
                                total1 += Number(datos.exigible);
                                total2 += Number(datos.cobranza_real);
                                // total3 += Number(pago.monto_dlls);
                                return (
                                    <TableRow key={`${datos.id_empresa}-${datos.fraccionamiento}`}>
                                        <TableCell className="font-medium text-xs">{datos.fraccionamiento}</TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(datos.exigible))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(datos.cobranza_real))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow style={{ color: "#b31c45" }} className="bg-yellow-50">
                                <TableCell colSpan={1} className="font-semibold text-center">
                                    Subtotal:
                                    {/* {razon_social.pagos.length} */}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(razon_social.cartera.reduce((acc, curr) => acc + Number(curr.exigible), 0))}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(razon_social.cartera.reduce((acc, curr) => acc + Number(curr.cobranza_real), 0))}
                                </TableCell>
                                {/* <TableCell colSpan={1}></TableCell> */}
                            </TableRow>
                        </>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow style={{ color: "#b31c45", fontWeight: "bold" }} className="bg-yellow-200">
                        <TableCell colSpan={1} className="font-semibold text-center">
                            Total:
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(total1))}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(total2))}
                        </TableCell>
                        {/* <TableCell className="text-right font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(total3))}
                        </TableCell> */}
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    );
}
