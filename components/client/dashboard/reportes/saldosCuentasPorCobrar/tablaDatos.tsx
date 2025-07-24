"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useSaldosCuentasPorCobrarConsultaStore } from "@/app/store/dashboard/reportes/saldosCuentasPorCobrar/resultadosConsultaStore";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Saldo {
    consecutivo: string;
    id_contrato: string;
    terreno: string;
    nombre_cliente: string;
    precio_original: string;
    precio_actual: string;
    pagado: string;
    saldo: string;
    fecha_contrato: string;
}

export default function TablaDatos() {
    const resultados = useSaldosCuentasPorCobrarConsultaStore((state) => state.resultados);

    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm max-w-[full] mx-auto">
                <TableCaption>GRUPO LOTIFICADORA - SALDOS CUENTAS POR COBRAR - </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center" colSpan={12}></TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-left max-w-[90px]">Consecutivo</TableHead>
                        <TableHead className="text-left">Terreno</TableHead>
                        <TableHead className="text-center">Cliente</TableHead>
                        <TableHead className="text-center">Precio Original</TableHead>
                        <TableHead className="text-center">Valor Actual</TableHead>
                        <TableHead className="text-center">Monto Pagado</TableHead>
                        <TableHead className="text-center">Saldo por pagar</TableHead>
                        <TableHead className="text-center">Fecha de contrato</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resultados.map((saldo) => (
                        <>
                            <TableRow key={`${saldo.consecutivo}-${saldo.id_contrato}`} className="text-xs">
                                <TableCell className="font-medium text-xs text-center">{saldo.consecutivo}</TableCell>
                                <TableCell className="text-left">{saldo.terreno}</TableCell>
                                <TableCell className="text-left">{saldo.nombre_cliente}</TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldo.precio_original))}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldo.precio_actual))}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldo.pagado))}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldo.saldo))}
                                </TableCell>
                                <TableCell className="text-center">{saldo.fecha_contrato}</TableCell>
                            </TableRow>
                        </>
                    ))}
                    <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                        <TableCell colSpan={3} className="font-semibold text-center">
                            Total:
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(resultados.reduce((acc, curr) => acc + Number(curr.precio_original), 0))}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(resultados.reduce((acc, curr) => acc + Number(curr.precio_actual), 0))}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(resultados.reduce((acc, curr) => acc + Number(curr.pagado), 0))}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(resultados.reduce((acc, curr) => acc + Number(curr.saldo), 0))}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
}
