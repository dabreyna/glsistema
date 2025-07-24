"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

//import { useInventarioOcupacionFiltrosConsultaStore } from "@/app/store/dashboard/reportes/terrenosDisponibles/fraccionamientoSelectedStore";
// import { useEstadoDeCuentaFiltrosConsultaStore } from "@/app/store/dashboard/reportes/estadoDeCuenta/filtrosConsultaStore";
import { useReporteAsignacionCargaResultadosConsultaStore } from "@/app/store/dashboard/reportes/asignacionCarga/resultadosConsultaStore";
// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import Link from "next/link";
// import { Estad} from "@/components/client/dashboard/reportes/estadoDeCuenta/estadoDeCuenta";

export default function TablaDatos() {
    // const idFraccionamiento = useEstadoDeCuentaFiltrosConsultaStore((state) => state.idFraccionamiento);
    const atenciones = useReporteAsignacionCargaResultadosConsultaStore((state) => state.resultados);
    const router = useRouter();
    const handleDetallesCliente = (id_cliente: string) => {
        if (id_cliente != "") {
            router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
        }
    };
    const totalAdeudo = atenciones.reduce((sum, atencion) => sum + Number(atencion.monto_vencido), 0);
    const totalPagado = atenciones.reduce((sum, atencion) => sum + Number(atencion.monto_pagado), 0);
    const totalMensualidades = atenciones.reduce((sum, atencion) => sum + Number(atencion.mensualidades_vencidas), 0);
    const totalDia = atenciones.reduce((sum, atencion) => sum + Number(atencion.dia_vencimiento), 0);
    const totalPagadoMes = atenciones.reduce((sum, atencion) => sum + Number(atencion.monto_pagado_mes), 0);
    // const totalAtendido = atenciones.reduce((sum, atencion) => sum + Number(atencion.atendido), 0);
    const totalAtendido = atenciones.reduce((count, atencion) => {
        if (atencion.atendido && atencion.atendido.toLowerCase() === "si") {
            return count + 1;
        }
        return count;
    }, 0);
    const totalPuntuacion = atenciones.reduce((sum, atencion) => sum + Number(atencion.puntuacion), 0);

    return (
        <>
            {/* <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div> */}

            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE ASIGNACION DE CARGA - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center">Consecutivo</TableHead>
                        <TableHead className="text-center">Terreno</TableHead>
                        <TableHead className="text-center">Cliente</TableHead>
                        <TableHead className="text-center">Fecha contrato</TableHead>
                        <TableHead className="text-center">Adeudo total</TableHead>
                        <TableHead className="text-center">Total pagado</TableHead>
                        <TableHead className="text-center">Meses vencidos</TableHead>
                        <TableHead className="text-center">Dia Vencimiento</TableHead>
                        <TableHead className="text-center">Pagado este mes</TableHead>
                        <TableHead className="text-center">Atendido</TableHead>
                        <TableHead className="text-center">Puntuacion</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {atenciones.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center">
                                No existen datos.
                            </TableCell>
                        </TableRow>
                    ) : null}
                    <>
                        {atenciones.map((atencion) => (
                            <TableRow
                                key={`${atencion.consecutivo}-${atencion.id_contrato}`}
                                className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                            >
                                <TableCell className="text-right">{atencion.consecutivo}</TableCell>
                                <TableCell className="text-right">{atencion.terreno}</TableCell>
                                <TableCell className="text-right">
                                    {atencion.nombre_cliente}
                                    {/* <Link
                    href={`/private/dashboard/reportes/estadoDeCuenta/detalles/${atencion.id_contrato}`}
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    {atencion.nombre_cliente}
                  </Link> */}
                                </TableCell>
                                <TableCell className="text-right">{atencion.fecha_contrato}</TableCell>
                                <TableCell colSpan={1} className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(atencion.monto_vencido))}
                                </TableCell>
                                {/* <TableCell className="text-right">{atencion.monto_vencido}</TableCell> */}
                                <TableCell colSpan={1} className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(atencion.monto_pagado))}
                                </TableCell>
                                {/* <TableCell className="text-right">{atencion.monto_pagado}</TableCell> */}
                                <TableCell className="text-right">{atencion.mensualidades_vencidas}</TableCell>
                                <TableCell className="text-right">{atencion.dia_vencimiento}</TableCell>
                                <TableCell colSpan={1} className="text-right">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(atencion.monto_pagado_mes))}
                                </TableCell>
                                {/* <TableCell className="text-right">{atencion.monto_pagado_mes}</TableCell> */}
                                <TableCell className="text-right">{atencion.atendido}</TableCell>
                                <TableCell className="text-right font-semibold">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "decimal",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(atencion.puntuacion))}
                                </TableCell>
                                {/* <TableCell className="text-right">{atencion.puntuacion}</TableCell> */}
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4} className="" style={{ height: "10px", padding: 2 }}></TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalAdeudo))}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalPagado))}
                            </TableCell>
                            <TableCell className="text-right">
                                {/* {new Intl.NumberFormat("es-MX", {}).format(Number(totalMensualidades))} */}
                            </TableCell>
                            <TableCell className="text-right">
                                {/* {new Intl.NumberFormat("es-MX", {}).format(Number(totalDia))} */}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalPagadoMes))}
                            </TableCell>
                            <TableCell className="text-right">
                                {totalAtendido}/{atenciones.length}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "decimal",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(totalPuntuacion))}
                            </TableCell>
                        </TableRow>
                    </>
                </TableBody>
            </Table>
        </>
    );
}
