"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface CompromisosPagoProps {
    idContrato: string;
}
interface CompromisosPago {
    fecha_compromiso: string;
    monto: string;
    pagado: string;
    fecha_pago: string;
    no_recibo: string;
    comentarios: string;
    estatus: string;
    bnd_activo: string;
}

export function CompromisosPago({ idContrato }: CompromisosPagoProps) {
    const [datosCliente, setDatosCliente] = useState<CompromisosPago[]>([]);
    // const [isOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/callCenter/compromisosPago?idContrato=${idContrato}`);
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
                            <TableHead className="text-center w-[100px] p-0 text-white">Fecha Compromiso</TableHead>
                            <TableHead className="text-center p-0 text-white">Monto</TableHead>
                            <TableHead className="text-center p-0 text-white">Pagado</TableHead>
                            <TableHead className="text-center p-0 text-white">Fecha Pago</TableHead>
                            <TableHead className="text-center p-0 text-white">No Recibo</TableHead>
                            <TableHead className="text-center p-0 text-white">Comentarios</TableHead>
                            <TableHead className="text-center p-0 text-white">Estatus</TableHead>
                            <TableHead className="text-center p-0 text-white">Cancelar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {datosCliente.map((compromiso) => {
                                consecutivo++;
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center w-[100px] uppercase p-3 flex items-center justify-center">
                                            {compromiso.fecha_compromiso}
                                        </TableCell>
                                        <TableCell className="text-center max-w-[100px] uppercase p-1">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(compromiso.monto))}
                                        </TableCell>
                                        <TableCell className="text-center max-w-[100px] uppercase p-1">{compromiso.pagado}</TableCell>
                                        <TableCell className="text-center max-w-[100px] uppercase p-1">{compromiso.fecha_pago}</TableCell>
                                        <TableCell className="text-center max-w-[100px] uppercase p-1">{compromiso.no_recibo}</TableCell>
                                        <TableCell className="text-balance max-w-[250px] uppercase p-1">{compromiso.comentarios}</TableCell>
                                        <TableCell className="text-center max-w-[100px] uppercase p-1">{compromiso.estatus}</TableCell>
                                        <TableCell className="text-center max-w-[100px] uppercase p-1"></TableCell>
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
