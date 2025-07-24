"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useCallCenterFiltrosConsultaStore } from "@/app/store/dashboard/cobranza/callCenter/filtrosConsultaStore";
// import { useEffect, useState } from "react";
import { FileDown, Square, SquareCheck, SquareX } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { text } from "stream/consumers";
import { Tab } from "@headlessui/react";
import { AltaAgenda } from "@/components/client/dashboard/cobranza/callCenter/altaAgenda";
import { HistorialAgenda } from "@/components/client/dashboard/cobranza/callCenter/historialAgenda";

interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}

interface TablaDatosProps {
    idUsuario?: string;
    perfilUsuario?: string;
    listaClasificaciones: Clasificacion[];
}

export default function TablaDatos({ idUsuario, perfilUsuario, listaClasificaciones }: TablaDatosProps) {
    const clientes = useCallCenterFiltrosConsultaStore((state) => state.resultados);
    const router = useRouter();
    // const handleDetallesCliente = (id_cliente: string) => {
    //   if (id_cliente != "") {
    //     router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
    //   }
    // };
    let consecutivo = 0;
    return (
        <>
            <div className="flex justify-end">
                {/* <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button> */}
                <br />
            </div>

            {/* <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]"> */}
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[100px] p-0 text-white">#Cons</TableHead>
                        <TableHead className="text-center p-0 text-white">Terreno</TableHead>
                        <TableHead className="text-center p-0 text-white">Cliente</TableHead>
                        <TableHead className="text-center p-0 w-[100px] text-white">
                            Dia <br />
                            Vencimiento
                        </TableHead>
                        <TableHead className="text-center p-0 w-[100px] text-white">
                            Meses
                            <br />
                            Vencidos
                        </TableHead>
                        <TableHead className="text-center p-0 w-[150px] text-white">
                            Monto
                            <br />
                            Vencido
                        </TableHead>
                        <TableHead className="text-center p-0 w-[150px] text-white">
                            Tipo de
                            <br />
                            Vencimiento
                        </TableHead>
                        <TableHead className="text-center p-0 w-[170px] text-white">Clasificacion</TableHead>
                        <TableHead className="text-center p-0 w-[180px] text-white">Acciones</TableHead>
                        {/* <TableHead className="text-center">Clasificacion</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            consecutivo++;
                            const getSemaforoComponent = (semaforo: string) => {
                                switch (semaforo) {
                                    case "ROJO":
                                        return <Square className="bg-red-500 text-red-500 rounded ml-6" />;
                                    case "AMARILLO":
                                        return <Square className="bg-amber-500 text-amber-500 rounded ml-6" />;
                                    case "VERDE":
                                        return <Square className="bg-green-500 text-green-500 rounded ml-6" />;
                                    case "VERDE_PALOMA":
                                        return <SquareCheck className="bg-green-500 text-white rounded ml-6" />;
                                    default:
                                        return null; // Or a default component if needed
                                }
                            };
                            return (
                                <TableRow
                                    key={`${cliente.id_cliente}-${consecutivo}`}
                                    className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                                >
                                    <TableCell className="text-center w-[100px] uppercase text-xs p-3 flex items-center justify-center">
                                        {consecutivo}
                                        {getSemaforoComponent(cliente.semaforo)}
                                    </TableCell>
                                    <TableCell className="text-center max-w-[80px] uppercase text-xs p-1">
                                        {/* {cliente.nomenclatura}-{cliente.no_manzana}-{cliente.terreno} */}
                                        {cliente.terreno}
                                    </TableCell>
                                    <TableCell className="text-center max-w-[300px] text-xs p-1">{cliente.nombre}</TableCell>
                                    <TableCell className="text-center max-w-[100px] uppercase text-xs p-1">
                                        {cliente.dia_vencimiento}
                                    </TableCell>
                                    <TableCell className="text-center max-w-[100px] uppercase text-xs p-1">
                                        {cliente.mensualidades_vencidas}
                                    </TableCell>
                                    <TableCell className="text-center max-w-[100px] uppercase text-xs p-1">
                                        {/* {cliente.monto_vencido} */}
                                        {new Intl.NumberFormat("es-MX", {
                                            style: "currency",
                                            currency: "MXN",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(Number(cliente.monto_vencido))}
                                    </TableCell>
                                    <TableCell className="text-center max-w-[100px] uppercase text-xs p-1">
                                        {cliente.tipo_vencimiento}
                                    </TableCell>
                                    <TableCell className="text-center max-w-[100px] uppercase text-xs p-1">
                                        {cliente.clasificacion}
                                    </TableCell>
                                    <TableCell className="text-center max-w-[100px] uppercase text-xs p-1">
                                        <AltaAgenda
                                            idCliente={cliente.id_cliente}
                                            listaClasificacion={listaClasificaciones}
                                            idContrato={cliente.id_contrato}
                                            idUsuario={idUsuario}
                                            perfilUsuario={perfilUsuario}
                                            clienteNombre={cliente.nombre}
                                        />
                                        {/* <HistorialAgenda id={cita.id_cliente} /> */}
                                        <HistorialAgenda id={cliente.id_contrato} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        </>
    );
}
