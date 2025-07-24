"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { ReferenceArea } from "recharts";

interface ReferenciasProps {
    idContrato: string;
}
interface Referencias {
    nombre: string;
    domicilio: string;
    tel_casa: string;
    tel_cel: string;
    observaciones: string;
    parentesco: string;
}

export function Referencias({ idContrato }: ReferenciasProps) {
    const [datosCliente, setDatosCliente] = useState<Referencias[]>([]);
    // const [isOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/callCenter/referencias?idContrato=${idContrato}`);
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
                            <TableHead className="text-center p-0 text-white">Nombre</TableHead>
                            <TableHead className="text-center p-0 text-white">Domicilio</TableHead>
                            <TableHead className="text-center p-0 text-white">Parentesco</TableHead>
                            <TableHead className="text-center p-0 text-white">Tel Casa</TableHead>
                            <TableHead className="text-center p-0 text-white">Tel Cel</TableHead>
                            <TableHead className="text-center p-0 text-white">Observaciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {datosCliente.map((referencia) => {
                                consecutivo++;
                                return (
                                    <TableRow
                                        key={`Row-${consecutivo}`}
                                        className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                                    >
                                        <TableCell className="text-center uppercase p-1">
                                            {referencia.nombre}
                                        </TableCell>
                                        <TableCell className="text-center uppercase p-1">{referencia.domicilio}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{referencia.parentesco}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{referencia.tel_casa}</TableCell>
                                        <TableCell className="text-center uppercase p-1">{referencia.tel_cel}</TableCell>
                                        <TableCell className="text-center max-w-[250px] uppercase text-xs p-1">
                                            {referencia.observaciones}
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
