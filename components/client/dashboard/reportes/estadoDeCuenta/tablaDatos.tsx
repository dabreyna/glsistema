"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

//import { useInventarioOcupacionFiltrosConsultaStore } from "@/app/store/dashboard/reportes/terrenosDisponibles/fraccionamientoSelectedStore";
import { useEstadoDeCuentaFiltrosConsultaStore } from "@/app/store/dashboard/reportes/estadoDeCuenta/filtrosConsultaStore";
// import { useCitatoriosFiltrosConsultaStore } from "@/app/store/dashboard/cobranza/citatorios/filtrosConsultaStore";

// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
// import { Estad} from "@/components/client/dashboard/reportes/estadoDeCuenta/estadoDeCuenta";
import { EstadoDeCuentaDetalles } from "./estadoDeCuenta";
//import Link from "next/link";
//import GeneraDOC from "../../cobranza/citatorios/documentos/generaDoc";

export default function TablaDatos() {
    const idFraccionamiento = useEstadoDeCuentaFiltrosConsultaStore((state) => state.idFraccionamiento);
    const contratos = useEstadoDeCuentaFiltrosConsultaStore((state) => state.resultados);
    // const clientes = useCitatoriosFiltrosConsultaStore((state) => state.resultados);
    const router = useRouter();
    const handleDetallesCliente = (id_cliente: string) => {
        if (id_cliente != "") {
            router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
        }
    };
    return (
        <>
            <div className="flex justify-end">
                {/* <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button> */}
            </div>

            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[1000px]">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE ESTADO DE CUENTA - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center">Terreno</TableHead>
                        <TableHead className="text-center">Cliente</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {contratos.map((terreno) => (
                            <TableRow
                                key={`${terreno.id_contrato}-${terreno.no_terreno}`}
                                className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                            >
                                <TableCell className="text-right">
                                    {" "}
                                    {terreno.nomenclatura}-{terreno.no_manzana}-{terreno.no_terreno}
                                </TableCell>
                                <TableCell className="text-right">
                                    {terreno.nombre_cliente}
                                    {/* <Link
                      href={`/private/dashboard/reportes/estadoDeCuenta/detalles/${terreno.id_contrato}`}
                      className="text-blue-500 underline"
                      target="_blank"
                    >
                    </Link> */}
                                </TableCell>
                                <TableCell className="text-right">
                                    <EstadoDeCuentaDetalles id={terreno.id_contrato} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </>
                </TableBody>
            </Table>
        </>
    );
}
