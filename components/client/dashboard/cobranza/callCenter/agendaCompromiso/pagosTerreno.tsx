"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface PagosTerrenoProps {
    idContrato: string;
}
interface PagoTerreno {
    operacion: string;
    no_pago: number;
    fecha_pago: string;
    tipo_pago: string;
    fecha_vencimiento: string;
    no_recibo: number;
    estatus_movimiento: string;
    monto: number;
}

export function PagosTerreno({ idContrato }: PagosTerrenoProps) {
    const [datosCliente, setDatosCliente] = useState<PagoTerreno[]>([]);
    // const [isOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/callCenter/pagosTerreno?idContrato=${idContrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setDatosCliente(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (idContrato != "0" && idContrato != undefined) {
            fetchData();
        }
    }, [idContrato]);
    let consecutivo = 0;
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-y-4 gap-x-8 text-black border border-primary-500 rounded-md p-2 bg-muted">
                <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                    <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                    <TableHeader className="border border-slate-200 bg-red-700 text-white">
                        <TableRow>
                            <TableHead className="text-center p-0 text-white">Operacion</TableHead>
                            <TableHead className="text-center p-0 text-white"># de Pago</TableHead>
                            <TableHead className="text-center p-0 text-white">Fecha Pago</TableHead>
                            <TableHead className="text-center p-0 text-white">Tipo de Pago</TableHead>
                            <TableHead className="text-center p-0 text-white">Fecha Vencimiento</TableHead>
                            <TableHead className="text-center p-0 text-white">No. de recibo</TableHead>
                            <TableHead className="text-center p-0 text-white">Estatus Recibo</TableHead>
                            <TableHead className="text-center p-0 text-white">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {datosCliente.map((pago) => {
                                consecutivo++;
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center uppercase p-1">
                                            {pago.operacion}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {pago.no_pago}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {pago.fecha_pago}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {pago.tipo_pago}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {pago.fecha_vencimiento}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {pago.no_recibo}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {pago.estatus_movimiento}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(pago.monto))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
