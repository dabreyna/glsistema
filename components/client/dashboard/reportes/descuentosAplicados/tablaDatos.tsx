"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useDescuentosAplicadosResultadosConsultaStore } from "@/app/store/dashboard/reportes/descuentosAplicados/resultadosConsultaStore";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Descuento {
    consecutivod: string;
    consecutivo: string;
    nombre_cliente: string;
    terreno: string;
    recibo: string;
    fecha_movimiento: string;
    mensualidadcubierta: string;
    monto: string;
    porcentaje: string;
    tipo: string;
    justificacion: string;
    asesor: string;
    ejecutivo: string;
}

export default function TablaDatos() {
    const resultados = useDescuentosAplicadosResultadosConsultaStore((state) => state.resultados);

    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm">
                <TableCaption>GRUPO LOTIFICADORA - DESCUENTOS APLICADOS - </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center" colSpan={12}></TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-left">Consecutivo</TableHead>
                        <TableHead className="text-center">Cliente</TableHead>
                        <TableHead className="text-center">Terreno</TableHead>
                        <TableHead className="text-center">Folio</TableHead>
                        <TableHead className="text-center">Fecha movimiento</TableHead>
                        <TableHead className="text-center">Mensualidad</TableHead>
                        <TableHead className="text-center">Descuento</TableHead>
                        <TableHead className="text-center">Tipo</TableHead>
                        <TableHead className="text-center">Porcentaje</TableHead>
                        <TableHead className="text-center">Justificacion</TableHead>
                        <TableHead className="text-center">Ejecutivo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resultados.map((descuento) => (
                        <>
                            <TableRow key={`${descuento.consecutivo}-${descuento.consecutivod}`} className="text-xs">
                                <TableCell className="font-medium text-xs">{descuento.consecutivo}</TableCell>
                                <TableCell className="text-left">{descuento.nombre_cliente}</TableCell>
                                <TableCell className="text-left">{descuento.terreno}</TableCell>
                                <TableCell className="text-center">{descuento.recibo}</TableCell>
                                <TableCell className="text-center">{descuento.fecha_movimiento}</TableCell>
                                <TableCell className="text-center">{descuento.mensualidadcubierta}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(descuento.monto))}
                                </TableCell>
                                <TableCell className="text-right">{descuento.tipo}</TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "percent",
                                        // currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(descuento.porcentaje) / 100)}
                                </TableCell>
                                <TableCell className="text-center">{descuento.justificacion}</TableCell>
                                <TableCell className="text-left">{descuento.ejecutivo}</TableCell>
                            </TableRow>
                        </>
                    ))}
                    <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                        <TableCell colSpan={6} className="font-semibold text-center">
                            Total:
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(resultados.reduce((acc, curr) => acc + Number(curr.monto), 0))}
                        </TableCell>
                    </TableRow>
                </TableBody>
                {/* <TableFooter>
                    <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                        <TableCell colSpan={1} className="font-semibold">
                            Total: {total}
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
                        <TableCell className="text-right font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(total3))}
                        </TableCell>
                    </TableRow>
                </TableFooter> */}
            </Table>
        </>
    );
}
