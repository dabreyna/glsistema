"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

//import { useInventarioOcupacionFiltrosConsultaStore } from "@/app/store/dashboard/reportes/terrenosDisponibles/fraccionamientoSelectedStore";
import { useBitacoraDeLlamadasFiltrosConsultaStore } from "@/app/store/dashboard/reportes/bitacoraDeLlamadas/filtrosConsultaStore";
import Link from "next/link";
// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import router from "next/router";
import { useRouter } from "next/navigation";

import { BitacoraDeLlamadasDetalle } from "@/components/client/dashboard/reportes/bitacoraDeLlamadas/bitacoraDetalle";

export default function TablaDatos() {
    const bitacoras = useBitacoraDeLlamadasFiltrosConsultaStore((state) => state.resultados);
    const router = useRouter();

    //const totalCont = bitacoras.reduce((sum, bitacora) => sum + bitacora.cont, 0);
    const totalCont = bitacoras.reduce((sum, bitacora) => sum + Number(bitacora.cont), 0);

    return (
        <>
            {/* <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div> */}

            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[800px]">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE BITACORA DE LLAMADAS - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center">Asesor</TableHead>
                        <TableHead className="text-center">Clasificacion</TableHead>
                        <TableHead className="text-center">Atenciones</TableHead>
                        <TableHead className="text-center">Tipo comentario</TableHead>
                        <TableHead className="text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {bitacoras.map((bitacora) => (
                            <TableRow
                                key={`${bitacora.id_usuario}-${bitacora.id_clasificacion}-${bitacora.id_tipo_comentario}`}
                                className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                            >
                                <TableCell className="text-left py-1 uppercase">{bitacora.nombre_asesor}</TableCell>
                                <TableCell className="text-right">{bitacora.clasificacion}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("es-MX", {}).format(Number(bitacora.cont))}
                                </TableCell>
                                <TableCell className="text-right">{bitacora.tipo}</TableCell>
                                <TableCell className="text-right">
                                    <BitacoraDeLlamadasDetalle
                                        id_asesor={bitacora.id_usuario}
                                        fil_asesor={bitacora.nombre_asesor}
                                        fil_fecha_ini={bitacora.fil_fecha_inicio}
                                        fil_fecha_fin={bitacora.fil_fecha_fin}
                                        fil_cliente={bitacora.fil_cliente}
                                        fil_clasificacion={bitacora.fil_clasificacion}
                                        asesor={bitacora.nombre_asesor}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={2} className="" style={{ height: "10px", padding: 2 }}></TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat("es-MX", {}).format(Number(totalCont))}</TableCell>
                        </TableRow>
                    </>
                </TableBody>
            </Table>
        </>
    );
}
