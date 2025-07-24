"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useFraccionamientoSelectedStore } from "@/app/store/dashboard/reportes/terrenosDisponibles/fraccionamientoSelectedStore";
import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Terreno {
    no_terreno: string;
    superficie: string;
    precio_m2: string;
    total_terreno: string;
    id_terreno: string;
}

interface Financiamiento {
    financiamiento: string;
    porcentaje: string;
    id_financiamiento: string;
    no_pagos: string;
}

interface Manzana {
    manzana: string;
    terrenos: Terreno[];
}

interface TotalesFraccionamiento {
    total_superficie: string;
    total_valor: string;
}

export default function TablaDatos() {
    const idFraccionamiento = useFraccionamientoSelectedStore((state) => state.idFraccionamiento);
    const nombreFraccionamiento = useFraccionamientoSelectedStore((state) => state.nombre);
    const [manzanas, setManzanas] = useState<Manzana[]>([]);
    const [financiamientos, setFinanciamientos] = useState<Financiamiento[]>([]);
    const [totalesFraccionamiento, setTotalesFraccionamiento] = useState<TotalesFraccionamiento>({
        total_superficie: "0",
        total_valor: "0",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/reportes/terrenosDisponibles/listadoFinanciamientos`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setFinanciamientos(data);
            } catch (error) {
                console.error(error);
            }
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/terrenosDisponibles/listadoTerrenos?idFraccionamiento=${idFraccionamiento}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setManzanas(data);
            } catch (error) {
                console.error(error);
            }
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/terrenosDisponibles/totalesFraccionamiento?idFraccionamiento=${idFraccionamiento}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setTotalesFraccionamiento(data[0]);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [idFraccionamiento]);

    function calculaMonto(porcentaje: string, no_pagos: string, total_terreno: string) {
        const porcentaje_num = Number(porcentaje) / 100;
        const precioTerreno = Number(Number(total_terreno) * porcentaje_num + Number(total_terreno));
        const mensualidad = Number((precioTerreno / Number(no_pagos)).toFixed(2));

        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(mensualidad);
    }
    let TotalLibres = 0;
    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE TERRENOS LIBRES - </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center" colSpan={12}>
                            {nombreFraccionamiento}
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="w-[100px]">Terreno</TableHead>
                        <TableHead className="text-right">Superficie</TableHead>
                        <TableHead className="text-right">Precio m2</TableHead>

                        {financiamientos ? (
                            <>
                                {financiamientos.map((financiamiento) => (
                                    <TableHead key={financiamiento.financiamiento} className="text-right">
                                        {financiamiento.financiamiento}
                                    </TableHead>
                                ))}
                            </>
                        ) : (
                            <>
                                <TableHead>cargando Financiamientos...</TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {manzanas.map((manzana) => (
                        <>
                            <TableRow key={manzana.manzana} className="shadownc-table__row my-row">
                                <TableCell colSpan={9} className="font-medium text-xs bg-slate-100" style={{ height: "10px", padding: 2 }}>
                                    Manzana: {manzana.manzana}
                                </TableCell>
                            </TableRow>
                            {manzana.terrenos.map((terreno) => {
                                TotalLibres++; //= manzana.terrenos.length;
                                return (
                                    <TableRow key={`${terreno.id_terreno}-${terreno.no_terreno}`}>
                                        <TableCell className="font-medium text-xs">{terreno.no_terreno}</TableCell>
                                        <TableCell className="text-right">{terreno.superficie}</TableCell>
                                        <TableCell className="text-right">{terreno.precio_m2}</TableCell>
                                        {financiamientos.map((financiamiento) => (
                                            <TableCell key={financiamiento.financiamiento} className="text-right">
                                                {calculaMonto(financiamiento.porcentaje, financiamiento.no_pagos, terreno.total_terreno)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                            <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                                <TableCell colSpan={1} className="font-semibold">
                                    Total: {manzana.terrenos.length}
                                </TableCell>
                            </TableRow>
                        </>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                        <TableCell colSpan={1} className="font-semibold">
                            Total: {TotalLibres}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "decimal",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(totalesFraccionamiento.total_superficie))}{" "}
                            m2
                        </TableCell>
                        <TableCell colSpan={5}></TableCell>
                        <TableCell className="text-right font-semibold">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(totalesFraccionamiento.total_valor))}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    );
}
