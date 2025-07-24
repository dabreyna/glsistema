"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useReporteDevolucionProgramadaResultadosConsultaStore } from "@/app/store/dashboard/reportes/devolucionProgramada/resultadosConsultaStore";
// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// interface Cartera {
//     id_empresa: string;
//     razon_social: string;
//     fraccionamiento: string;
//     exigible: string;
//     cobranza_real: string;
//     cobranza_otros: string;
// }

export default function TablaDatos() {
    const resultados = useReporteDevolucionProgramadaResultadosConsultaStore((state) => state.resultados);
    let total1 = 0;
    let total2 = 0;
    // let total3 = 0;
    console.log(resultados);
    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm max-w-[full] mx-auto border-2">
                <TableCaption>GRUPO LOTIFICADORA - CORTE CAJA- </TableCaption>
                <TableHeader>
                    {/* <TableRow>
                        <TableHead className="text-center" colSpan={12}></TableHead>
                    </TableRow> */}
                    <TableRow>
                        <TableHead className="text-center">Folio</TableHead>
                        <TableHead className="text-center">Terreno</TableHead>
                        <TableHead className="text-center">Cliente</TableHead>
                        <TableHead className="text-center">Monto</TableHead>
                        <TableHead className="text-center">Usuario</TableHead>
                        <TableHead className="text-center">Hora</TableHead>
                        <TableHead className="text-center">Fecha contrato</TableHead>
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
                            {razon_social.devoluciones.map((devolucion) => {
                                total1 += Number(devolucion.saldo);
                                total2 += Number(devolucion.monto);
                                return (
                                    <TableRow key={`${devolucion.id_contrato}-${devolucion.terreno}`}>
                                        <TableCell className="font-medium text-xs">{devolucion.nombre_cliente}</TableCell>
                                        <TableCell className="font-medium text-xs">{devolucion.terreno}</TableCell>

                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(devolucion.saldo))}
                                        </TableCell>
                                        <TableCell className="font-medium text-xs text-center">{devolucion.no_pago}</TableCell>
                                        <TableCell className="font-medium text-xs">{devolucion.fecha_pago}</TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(devolucion.monto))}
                                        </TableCell>
                                        <TableCell className="font-medium text-xs text-center">{devolucion.fecha_contrato}</TableCell>
                                        <TableCell className="font-medium text-xs text-center">{devolucion.fecha_cancelacion}</TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow style={{ color: "#b31c45" }} className="bg-yellow-50">
                                <TableCell colSpan={2} className="font-semibold text-center">
                                    Subtotal:
                                    {/* {razon_social.pagos.length} */}
                                </TableCell>

                                <TableCell className="text-right font-semibold">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(razon_social.devoluciones.reduce((acc, curr) => acc + Number(curr.saldo), 0))}
                                </TableCell>
                                <TableCell className="text-right font-semibold" colSpan={2}></TableCell>
                                <TableCell className="text-right font-semibold">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(razon_social.devoluciones.reduce((acc, curr) => acc + Number(curr.monto), 0))}
                                </TableCell>
                                {/* <TableCell colSpan={1}></TableCell> */}
                            </TableRow>
                        </>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow style={{ color: "#b31c45", fontWeight: "bold" }} className="bg-yellow-200">
                        <TableCell colSpan={2} className="font-semibold text-center">
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
                        <TableCell className="text-right font-semibold" colSpan={2}></TableCell>
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
