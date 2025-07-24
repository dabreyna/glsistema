"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

//import { useInventarioOcupacionFiltrosConsultaStore } from "@/app/store/dashboard/reportes/terrenosDisponibles/fraccionamientoSelectedStore";
import { useCanceladosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/cancelados/filtrosConsultaStore";
// import Link from "next/link";
// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

// import router from "next/router";
// import { useRouter } from "next/navigation";
// import { Estad} from "@/components/client/dashboard/reportes/estadoDeCuenta/estadoDeCuenta";

export default function TablaDatos() {
    // const idFraccionamiento = useCanceladosFiltrosConsultaStore((state) => state.idFraccionamiento);
    const contratos = useCanceladosFiltrosConsultaStore((state) => state.resultados);

    const handleExportarExcel = () => {
        // Crear una nueva hoja de cálculo
        const wb = XLSX.utils.book_new();
        const ws_name = "Reporte de Cancelados";

        // Obtener los encabezados de la tabla
        const headers = Array.from(document.querySelectorAll("#tablaDatosReporteCancelados thead tr:last-child th")).map(
            (th) => th.textContent
        );

        // Convertir los datos del contrato a un formato que xlsx pueda entender
        const data = contratos.map((contrato) => [
            contrato.id_contrato,
            `${contrato.nomenclatura}-${contrato.no_manzana}-${contrato.no_terreno}`,
            contrato.nombre_cliente,
            contrato.fraccionamiento,
            contrato.mensualidades_pagadas,
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(contrato.cargo_cancelacion)),
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(contrato.monto_devolucion)),
            contrato.monto_terreno_inicial,
            contrato.monto_terreno_actual,
            contrato.saldo_pendiente,
            contrato.capital_vencido,
            contrato.mensualidades_vencidas,
            contrato.mensualidad_actual,
            contrato.fecha_contrato,
            contrato.estatus_carta,
            contrato.superficie,
            contrato.fecha_cancelacion,
            contrato.nombre_vendedor,
            contrato.asesor_cobranza,
            contrato.asesor_carta_devolucion,
            contrato.comentarios_cancelacion,
        ]);

        // Crear la fila de totales
        const totalsRow = [
            contratos.length,
            "",
            "",
            "",
            "",
            totalCargoCancelacion,
            totalMontoDevolucion,
            totalMontoTerreno,
            totalMontoTerrenoActual,
            totalSaldoPendiente,
            totalCapitalVencido,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ];

        // Crear la hoja de cálculo con los encabezados y los datos
        // const ws_data = [headers, ...data];
        const ws_data = [headers, ...data, totalsRow.map((total) => (typeof total === "number" ? total : total.toString()))];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // Añadir la hoja de cálculo al libro de trabajo
        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(wb, "reporte_cancelados.xlsx");
    };

    // const router = useRouter();
    // const handleDetallesCliente = (id_cliente: string) => {
    //     if (id_cliente != "") {
    //         router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
    //     }
    // };
    // const totalCancelados = contratos.reduce((sum, contrato) => sum + Number(contrato.id_contrato), 0);
    const totalCargoCancelacion = contratos.reduce((sum, contrato) => sum + Number(contrato.cargo_cancelacion), 0);
    const totalMontoDevolucion = contratos.reduce((sum, contrato) => sum + Number(contrato.monto_devolucion), 0);
    const totalMontoTerreno = contratos.reduce((sum, contrato) => sum + Number(contrato.monto_terreno_inicial), 0);
    const totalMontoTerrenoActual = contratos.reduce((sum, contrato) => sum + Number(contrato.monto_terreno_actual), 0);
    const totalSaldoPendiente = contratos.reduce((sum, contrato) => sum + Number(contrato.saldo_pendiente), 0);
    const totalCapitalVencido = contratos.reduce((sum, contrato) => sum + Number(contrato.capital_vencido), 0);
    return (
        <>
            <div className="flex justify-end">
                <Button id="toExcel" className="p-6" onClick={handleExportarExcel}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    Exportar
                </Button>
            </div>

            <Table id="tablaDatosReporteCancelados" className="rounded-md border-2 border-slate-200 shadow-sm ">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE CANCELADOS - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg ">
                    <TableRow>
                        <TableCell colSpan={12} className="" style={{ height: "10px", padding: 2 }}>
                            Total de Cancelados: {contratos.length}
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center text-xs p-1"># Contrato</TableHead>
                        <TableHead className="text-center text-xs p-1">Terreno</TableHead>
                        <TableHead className="text-center text-xs p-1 w-[200px]">Cliente</TableHead>
                        <TableHead className="text-center text-xs p-1">Fraccionamiento</TableHead>
                        <TableHead className="text-center text-xs p-1">Mens. pagadas</TableHead>
                        <TableHead className="text-center text-xs p-1">Cargo cancelacion</TableHead>
                        <TableHead className="text-center text-xs p-1">Monto devolucion</TableHead>
                        <TableHead className="text-center text-xs p-1">Precio original contrato</TableHead>
                        <TableHead className="text-center text-xs p-1">Precio actual</TableHead>
                        <TableHead className="text-center text-xs p-1">Saldo para liquidar</TableHead>
                        <TableHead className="text-center text-xs p-1">Capital vencido</TableHead>
                        <TableHead className="text-center text-xs p-1">Meses vencidos</TableHead>
                        <TableHead className="text-center text-xs p-1">Mensualidad</TableHead>
                        <TableHead className="text-center text-xs p-1">Fecha contrato</TableHead>
                        <TableHead className="text-center text-xs p-1">Estatus carta devolucion</TableHead>
                        <TableHead className="text-center text-xs p-1">Superficie</TableHead>
                        <TableHead className="text-center text-xs p-1">Fecha cancelacion</TableHead>
                        <TableHead className="text-center text-xs p-1">Asesor Ventas</TableHead>
                        <TableHead className="text-center text-xs p-1">Asesor Cobranza</TableHead>
                        <TableHead className="text-center text-xs p-1">Motivo cancelacion</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {contratos.map((contrato) => (
                            <TableRow
                                key={`${contrato.id_contrato}-${contrato.no_terreno}`}
                                className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                            >
                                <TableCell className="text-center text-xs p-1">{contrato.id_contrato}</TableCell>
                                <TableCell className="text-center text-xs p-1">
                                    {contrato.nomenclatura}-{contrato.no_manzana}-{contrato.no_terreno}
                                </TableCell>
                                <TableCell className="text-center text-xs p-1 w-[200px]">{contrato.nombre_cliente}</TableCell>
                                <TableCell className="text-center text-xs p-1">{contrato.fraccionamiento}</TableCell>
                                <TableCell className="text-center text-xs p-1">{contrato.mensualidades_pagadas}</TableCell>
                                <TableCell className="text-right text-xs p-1">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(contrato.cargo_cancelacion))}
                                </TableCell>
                                <TableCell className="text-right text-xs p-1">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(contrato.monto_devolucion))}
                                </TableCell>
                                <TableCell className="text-right text-xs p-1">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(contrato.monto_terreno_inicial))}
                                </TableCell>
                                <TableCell className="text-right text-xs p-1">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(contrato.monto_terreno_actual))}
                                    {/* {contrato.monto_terreno_actual} */}
                                </TableCell>
                                <TableCell className="text-right text-xs p-1">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(contrato.saldo_pendiente))}
                                    {/* {contrato.saldo_pendiente} */}
                                </TableCell>
                                <TableCell className="text-right text-xs p-1">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(contrato.capital_vencido))}
                                    {/* {contrato.capital_vencido} */}
                                </TableCell>
                                <TableCell className="text-right text-xs p-1">{contrato.mensualidades_vencidas}</TableCell>
                                <TableCell className="text-right text-xs p-1">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(contrato.mensualidad_actual))}
                                    {/* {contrato.mensualidad_actual} */}
                                </TableCell>
                                <TableCell className="text-right text-xs p-1">{contrato.fecha_contrato}</TableCell>
                                <TableCell className="text-right text-xs p-1">{contrato.estatus_carta}</TableCell>
                                <TableCell className="text-right text-xs p-1">{contrato.superficie}</TableCell>
                                <TableCell className="text-right text-xs p-1">{contrato.fecha_cancelacion}</TableCell>
                                <TableCell className="text-right text-xs p-1">{contrato.nombre_vendedor}</TableCell>
                                <TableCell className="text-right text-xs p-1">{contrato.asesor_cobranza}</TableCell>
                                <TableCell className="text-right text-xs p-1">{contrato.comentarios_cancelacion}</TableCell>

                                <TableCell className="text-right text-xs p-1">
                                    {/* <EstadoDeCuentaDetalles id={contrato.id_contrato} /> */}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    // style: "currency",
                                    // currency: "MXN",
                                    // minimumFractionDigits: 2,
                                    // maximumFractionDigits: 2,
                                }).format(Number(contratos.length))}
                            </TableCell>
                            <TableCell className="text-right" colSpan={4}></TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalCargoCancelacion))}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalMontoDevolucion))}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalMontoTerreno))}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalMontoTerrenoActual))}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalSaldoPendiente))}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalCapitalVencido))}
                            </TableCell>
                        </TableRow>
                    </>
                </TableBody>
            </Table>
        </>
    );
}
