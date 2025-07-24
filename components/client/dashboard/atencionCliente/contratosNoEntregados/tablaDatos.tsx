"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useSaldosVencidosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/saldosVencidos/filtrosConsultaStore";
import { useServiciosVencidosFiltrosConsultaStore } from "@/app/store/dashboard/atencionCliente/serviciosVencidos/filtrosConsultaStore";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function TablaDatos() {
    const saldosVencidos = useServiciosVencidosFiltrosConsultaStore((state) => state.resultados);
    const handleExportarExcel = () => {
        // Crear una nueva hoja de cálculo
        const wb = XLSX.utils.book_new();
        const ws_name = "Reporte de Cancelados";

        // Obtener los encabezados de la tabla
        const headers = Array.from(document.querySelectorAll("#tablaServiciosVencidos thead tr:last-child th")).map((th) => th.textContent);

        // Convertir los datos del contrato a un formato que xlsx pueda entender
        const data = saldosVencidos.map((saldo) => [
            saldo.terreno,
            saldo.nombre_cliente,
            saldo.fecha_contrato,
            saldo.servicio,
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(saldo.mes1)),
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(saldo.mes2)),
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(saldo.mes3)),
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(saldo.mes4)),
            saldo.dia_vencimiento,
            saldo.mensualidades_vencidas,
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(saldo.monto_vencido)),
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(saldo.monto_pagado)),
        ]);

        const totalMes1 = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.mes1), 0)));

        const totalMes2 = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.mes2), 0)));
        const totalMes3 = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.mes3), 0)));
        const totalMes4 = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.mes4), 0)));
        const totalAdeudo = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.monto_vencido), 0)));
        const totalPagado = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.monto_pagado), 0)));

        // const totalMes2 = saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.mes2), 0);
        // const totalMes3 = saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.mes3), 0);
        // const totalMes4 = saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.mes4), 0);
        // const totalAdeudo = saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.monto_vencido), 0);
        // const totalPagado = saldosVencidos.reduce((sum, contrato) => sum + Number(contrato.monto_pagado), 0);
        // Crear la fila de totales
        const totalsRow = [saldosVencidos.length, "", "", "", totalMes1, totalMes2, totalMes3, totalMes4, "", "", totalAdeudo, totalPagado];

        // Crear la hoja de cálculo con los encabezados y los datos
        // const ws_data = [headers, ...data];
        const ws_data = [headers, ...data, totalsRow.map((total) => (typeof total === "number" ? total : total.toString()))];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // Añadir la hoja de cálculo al libro de trabajo
        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(wb, "reporte_Servicios_Vencidos.xlsx");
    };

    return (
        <>
            <div className="flex justify-end">
                <Button id="toExcel" className="p-6" onClick={handleExportarExcel}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    Exportar
                </Button>
            </div>

            <Table id="tablaServiciosVencidos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>GRUPO LOTIFICADORA - SERVICIOS VENCIDOS - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center p-2">Terreno</TableHead>
                        <TableHead className="text-center p-2">Cliente</TableHead>
                        <TableHead className="text-center p-2">Fecha contrato</TableHead>
                        <TableHead className="text-center p-2">Servicio</TableHead>
                        <TableHead className="text-center p-2">Mes1</TableHead>
                        <TableHead className="text-center p-2">Mes2</TableHead>
                        <TableHead className="text-center p-2">Mes3</TableHead>
                        <TableHead className="text-center p-2">Mes4</TableHead>
                        <TableHead className="text-center p-2 sm:w-[50px] md:w-[50px] lg:w-[50px]">Dia vencimiento</TableHead>
                        <TableHead className="text-center sm:w-[50px] md:w-[50px] lg:w-[50px] p-2">Mensualidades vencidas</TableHead>
                        <TableHead className="text-center p-2">Adeudo total</TableHead>
                        <TableHead className="text-center p-2">Total pagado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {saldosVencidos.map((saldoVencido) => (
                            <TableRow
                                key={`${saldoVencido.terreno}`}
                                className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                            >
                                <TableCell className="text-right">{saldoVencido.terreno}</TableCell>
                                <TableCell className="text-right">{saldoVencido.nombre_cliente}</TableCell>
                                <TableCell className="text-center">{saldoVencido.fecha_contrato}</TableCell>
                                <TableCell className="text-center">{saldoVencido.servicio}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldoVencido.mes1))}
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldoVencido.mes2))}
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldoVencido.mes3))}
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldoVencido.mes4))}
                                </TableCell>
                                <TableCell className="text-center">{saldoVencido.dia_vencimiento}</TableCell>
                                <TableCell className="text-center">{saldoVencido.mensualidades_vencidas}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldoVencido.monto_vencido))}
                                    {/* {saldoVencido.monto_vencido} */}
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldoVencido.monto_pagado))}
                                    {/* {saldoVencido.monto_pagado} */}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                            <TableCell colSpan={1} className="font-semibold">
                                Total:{" " + saldosVencidos.length}
                            </TableCell>
                            <TableCell className="text-right font-semibold" colSpan={3}></TableCell>
                            <TableCell className="text-right font-semibold">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.mes1), 0)))}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.mes2), 0)))}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.mes3), 0)))}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.mes4), 0)))}
                            </TableCell>
                            <TableCell className="text-center font-semibold" colSpan={2}></TableCell>

                            <TableCell className="text-right font-semibold">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.monto_vencido), 0)))}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.monto_pagado), 0)))}
                            </TableCell>
                        </TableRow>
                    </>
                </TableBody>
            </Table>
        </>
    );
}
