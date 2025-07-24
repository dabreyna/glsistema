"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useHistoricoTerrenosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/historicoTerrenos/filtrosConsultaStore";
// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
// import { Estad} from "@/components/client/dashboard/reportes/estadoDeCuenta/estadoDeCuenta";

export default function TablaDatos() {
    // const idFraccionamiento = useEstadoDeCuentaFiltrosConsultaStore((state) => state.idFraccionamiento);
    const terrenos = useHistoricoTerrenosFiltrosConsultaStore((state) => state.resultados);

    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>

            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full] text-sm">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE HISTORICO DE TERRENOS - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center text-sm">Terreno</TableHead>
                        <TableHead className="text-center text-sm">Superficie</TableHead>
                        <TableHead className="text-center text-sm">Precio m2</TableHead>
                        <TableHead className="text-center text-sm">Precio Terreno</TableHead>
                        <TableHead className="text-center text-sm">Clientes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {terrenos.map((terreno) => (
                            <TableRow
                                key={`${terreno.id_terreno}-${terreno.terreno}`}
                                className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer text-xs"
                            >
                                <TableCell className="text-right text-xs">{terreno.terreno}</TableCell>
                                <TableCell className="text-right text-xs">{terreno.superficie} m2</TableCell>
                                <TableCell className="text-right text-xs">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(terreno.precio_m2))}
                                </TableCell>
                                <TableCell className="text-right text-xs">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(terreno.total_terreno))}
                                </TableCell>
                                <TableCell className="text-left text-xs">
                                    {terreno.contratos.map((contrato) => (
                                        <>
                                            <b>Cliente: </b>
                                            {contrato.nombre_cliente} <b>Fecha contrato: </b>
                                            {contrato.fecha_contrato} <b>Fecha cancelacion: </b>
                                            {contrato.fecha_cancelacion} <b>Precio m2: </b>
                                            {contrato.precio_m2_inicial} <b>Precio Terreno: </b>
                                            {contrato.precio_terreno}
                                            <br />
                                        </>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </>
                </TableBody>
            </Table>
        </>
    );
}
