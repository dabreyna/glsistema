"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useSaldosVencidosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/saldosVencidos/filtrosConsultaStore";
import { useContratosEntregadosFiltrosConsultaStore } from "@/app/store/dashboard/atencionCliente/contratosEntregados/filtrosConsultaStore";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function TablaDatos() {
    const contratosEntregados = useContratosEntregadosFiltrosConsultaStore((state) => state.resultados);
    const handleExportarExcel = () => {
        // Crear una nueva hoja de cálculo
        const wb = XLSX.utils.book_new();
        const ws_name = "Reporte de Cancelados";

        // Obtener los encabezados de la tabla
        const headers = Array.from(document.querySelectorAll("#tablaServiciosVencidos thead tr:last-child th")).map((th) => th.textContent);

        // Convertir los datos del contrato a un formato que xlsx pueda entender
        const data = contratosEntregados.map((contrato) => [
            contrato.id_contrato,
            contrato.id_cliente,
            contrato.terreno,
            contrato.nombre_cliente,
            contrato.fecha_contrato,
            contrato.fecha_firma,
            contrato.contrato_entregado,
            contrato.estatus_contrato,
        ]);

        // Crear la hoja de cálculo con los encabezados y los datos
        // const ws_data = [headers, ...data];
        const ws_data = [headers, ...data];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // Añadir la hoja de cálculo al libro de trabajo
        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(wb, "reporte_Contratos_Entregados.xlsx");
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
                <TableCaption>GRUPO LOTIFICADORA - CONTRATOS ENTREGADOS - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center p-2"># Contrato</TableHead>
                        <TableHead className="text-center p-2"># Cliente</TableHead>
                        <TableHead className="text-center p-2">Terreno</TableHead>
                        <TableHead className="text-center p-2">Cliente</TableHead>
                        <TableHead className="text-center p-2">Fecha contrato</TableHead>
                        <TableHead className="text-center p-2">Fecha firma</TableHead>
                        <TableHead className="text-center p-2">Contrato Entregado</TableHead>
                        <TableHead className="text-center p-2">Estatus Contrato</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {contratosEntregados.map((contrato) => (
                            <TableRow key={`${contrato.terreno}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                                <TableCell className="text-center">{contrato.id_contrato}</TableCell>
                                <TableCell className="text-center">{contrato.id_cliente}</TableCell>
                                <TableCell className="text-right">{contrato.terreno}</TableCell>
                                <TableCell className="text-center">{contrato.nombre_cliente}</TableCell>
                                <TableCell className="text-center">{contrato.fecha_contrato}</TableCell>
                                <TableCell className="text-center">{contrato.fecha_firma}</TableCell>
                                <TableCell className="text-center">{contrato.contrato_entregado}</TableCell>
                                <TableCell className="text-center">{contrato.estatus_contrato}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                            <TableCell colSpan={1} className="font-semibold">
                                Total:{" " + contratosEntregados.length}
                            </TableCell>
                        </TableRow>
                    </>
                </TableBody>
            </Table>
        </>
    );
}
