"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useDetalladoVentasFiltrosConsultaStore } from "@/app/store/dashboard/reportes/detalladoVentas/filtrosConsultaStore";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Contrato } from "../../../../../app/private/dashboard/buscarCliente/resultados";

interface VentasDetalladas {
    consecutivo: string;
    fraccionamiento: string;
    nomenclatura: string;
    no_manzana: string;
    no_terreno: string;
    nombre_asesor: string;
    superficie: string;
    mediopublicitario: string;
    nombre_cliente: string;
    tel_cel: string;
    mensualidad_actual: string;
    fecha_contrato: string;
    monto_terreno_actual: string;
    estatus: string;
    financiamiento: string;
    id_contrato: string;
    enganche: string;
    pagado: string;
    mens_pagadas: string;
    mens_pendientes: string;
    fecha_estatus: string;
}

interface DetalladoAsesores {
    nombre_asesor: string;
    ventas: VentasDetalladas[];
}
export default function TablaDatosDetallada() {
    const resultadoDetallado = useDetalladoVentasFiltrosConsultaStore((state: { detallado: any }) => state.detallado);

    return (
        <>
            {/* <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div> */}
            <div className="flex justify-center w-full items-center">
                <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full] mx-auto">
                    {/* <TableCaption>GRUPO LOTIFICADORA - REPORTE DE COMISIONES - </TableCaption> */}
                    <TableHeader className="border-2 border-slate-200 shadow-lg">
                        <TableRow>
                            <TableHead className="text-center">Consecutivo</TableHead>
                            <TableHead className="text-right">Ubicacion</TableHead>
                            <TableHead className="text-right">Cliente</TableHead>
                            <TableHead className="text-right">Tel.Celular</TableHead>
                            <TableHead className="text-right">Fecha Contrato</TableHead>
                            <TableHead className="text-right">Superficie</TableHead>
                            <TableHead className="text-right">Monto Terreno</TableHead>
                            <TableHead className="text-right">Pago inicial</TableHead>
                            <TableHead className="text-right">Mensualidad</TableHead>
                            <TableHead className="text-right">Pagado</TableHead>
                            <TableHead className="text-right">Mens. Pagadas</TableHead>
                            <TableHead className="text-right">Mens. Vencidas</TableHead>
                            <TableHead className="text-right">Estatus</TableHead>
                            <TableHead className="text-right">Fecha estatus</TableHead>
                            <TableHead className="text-right">Financiamiento</TableHead>
                            <TableHead className="text-right">Medio Publicitario</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resultadoDetallado.map((asesor: DetalladoAsesores) => {
                            return (
                                <>
                                    <TableRow key={`${asesor.nombre_asesor}`}>
                                        <TableCell className="font-medium" colSpan={12}>
                                            {asesor.nombre_asesor}
                                        </TableCell>
                                    </TableRow>
                                    {asesor.ventas.map((venta: VentasDetalladas) => {
                                        return (
                                            <>
                                                <TableRow key={`${venta.fraccionamiento}`} className="text-xs">
                                                    <TableCell className="text-right">{venta.consecutivo}</TableCell>
                                                    <TableCell className="text-right">{venta.nomenclatura}</TableCell>
                                                    <TableCell className="text-right">{venta.nombre_cliente}</TableCell>
                                                    <TableCell className="text-right">{venta.tel_cel}</TableCell>
                                                    <TableCell className="text-right">{venta.fecha_contrato}</TableCell>
                                                    <TableCell className="text-right">{venta.superficie}</TableCell>
                                                    <TableCell className="text-right">
                                                        {new Intl.NumberFormat("es-MX", {
                                                            style: "currency",
                                                            currency: "MXN",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }).format(Number(venta.monto_terreno_actual))}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {new Intl.NumberFormat("es-MX", {
                                                            style: "currency",
                                                            currency: "MXN",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }).format(Number(venta.enganche))}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {new Intl.NumberFormat("es-MX", {
                                                            style: "currency",
                                                            currency: "MXN",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }).format(Number(venta.mensualidad_actual))}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {new Intl.NumberFormat("es-MX", {
                                                            style: "currency",
                                                            currency: "MXN",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }).format(Number(venta.pagado))}
                                                    </TableCell>
                                                    <TableCell className="text-right">{venta.mens_pagadas}</TableCell>
                                                    <TableCell className="text-right">{venta.mens_pendientes}</TableCell>
                                                    <TableCell className="text-right">{venta.estatus}</TableCell>
                                                    <TableCell className="text-right">{venta.fecha_estatus}</TableCell>
                                                    <TableCell className="text-right">{venta.financiamiento}</TableCell>
                                                    <TableCell className="text-right">{venta.mediopublicitario}</TableCell>
                                                </TableRow>
                                            </>
                                        );
                                    })}
                                </>
                            );
                        })}
                    </TableBody>
                    <TableFooter></TableFooter>
                </Table>
            </div>
        </>
    );
}
