"use client";

import { Label } from "@/components/ui/label";
import { useLecturasAguaFiltrosConsultaStore } from "@/app/store/dashboard/atencionCliente/lecturasAgua/filtrosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface fraccionamiento {
    id_fraccionamiento: string;
    fraccionamiento: string;
}

interface FiltrosConsultaProps {
    listaFraccionamientos: fraccionamiento[];
}
interface Manzana {
    id_manzana: string;
    no_manzana: string;
}
interface Terreno {
    id_terreno: string;
    no_terreno: string;
}

export default function FiltrosConsultaLecturasAgua({ listaFraccionamientos }: FiltrosConsultaProps) {
    const seleccionaResultados = useLecturasAguaFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [fraccionamiento, setFraccionamiento] = useState<string>("0");
    const [manzana, setManzana] = useState<string>("0");
    const [terreno, setTerreno] = useState<string>("0");
    const [anio, setAnio] = useState<string>("0");
    const [mes, setMes] = useState<string>("0");
    const [estatusToma, setEstatusToma] = useState<string>("0");

    const [manzanas, setManzanas] = useState<Manzana[]>([]);
    const [terrenos, setTerrenos] = useState<Terreno[]>([]);
    // const [cliente, setCliente] = useState<string>("");
    // const [nombreCliente, setNombreCliente] = useState<string>("");
    // seleccionaResultados([]);
    // const meses = [
    //     "ENERO",
    //     "FEBRERO",
    //     "MARZO",
    //     "ABRIL",
    //     "MAYO",
    //     "JUNIO",
    //     "JULIO",
    //     "AGOSTO",
    //     "SEPTIEMBRE",
    //     "OCTUBRE",
    //     "NOVIEMBRE",
    //     "DICIEMBRE",
    // ];

    const meses = [
        {
            id: "1",
            nombre: "ENERO",
        },
        {
            id: "2",
            nombre: "FEBRERO",
        },
        {
            id: "3",
            nombre: "MARZO",
        },
        {
            id: "4",
            nombre: "ABRIL",
        },
        {
            id: "5",
            nombre: "MAYO",
        },
        {
            id: "6",
            nombre: "JUNIO",
        },
        {
            id: "7",
            nombre: "JULIO",
        },
        {
            id: "8",
            nombre: "AGOSTO",
        },
        {
            id: "9",
            nombre: "SEPTIEMBRE",
        },
        {
            id: "10",
            nombre: "OCTUBRE",
        },
        {
            id: "11",
            nombre: "NOVIEMBRE",
        },
        {
            id: "12",
            nombre: "DICIEMBRE",
        },
    ];

    const anios = [2022, 2023, 2024, 2025];

    useEffect(() => {
        // console.log(estatus);
        // seleccionaResultados([]);
    }, [anio]);

    useEffect(() => {
        setManzanas([]);
        setManzana("0");
        setTerrenos([]);
        setTerreno("0");
        const getManzanas = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/catalogoClientes/filtros/manzanas?idFraccionamiento=${fraccionamiento}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setManzanas(data);
            } catch (error) {
                console.error(error);
            }
        };
        getManzanas();
        setTerrenos([]);
    }, [fraccionamiento]); // Update  whenever filters changes

    useEffect(() => {
        // if (manzana === "0") {
        setTerrenos([]);
        setTerreno("0");
        // }
        const getTerrenos = async () => {
            try {
                const response = await fetch(`/api/dashboard/reportes/catalogoClientes/filtros/terrenos?idManzana=${manzana}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setTerrenos(data);
            } catch (error) {
                console.error(error);
            }
        };
        getTerrenos();
    }, [manzana]); // Update  whenever filters changes

    function getDatos() {
        seleccionaResultados([]);
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/atencionCliente/lecturasAgua?idFraccionamiento=${fraccionamiento}&idManzana=${manzana}&idTerreno=${terreno}&anio=${anio}&mes=${mes}&estatusToma=${estatusToma}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                seleccionaResultados(data);
                // console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="fraccionamiento">Fraccionamiento</Label>
                    <Select onValueChange={setFraccionamiento} defaultValue="0">
                        <SelectTrigger id="fraccionamiento" aria-label="Selecciona el fraccionamiento">
                            <SelectValue placeholder="Selecciona el fraccionamiento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Selecciona el fraccionamiento
                            </SelectItem>
                            {listaFraccionamientos.map((fraccionamiento) => (
                                <SelectItem key={fraccionamiento.id_fraccionamiento} value={fraccionamiento.id_fraccionamiento}>
                                    {fraccionamiento.fraccionamiento}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="manzana">Manzana</Label>
                    <Select onValueChange={setManzana} defaultValue="0">
                        <SelectTrigger id="manzana" aria-label="Selecciona la manzana">
                            <SelectValue placeholder="Selecciona la manzana" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todas
                            </SelectItem>
                            {manzanas.map((manzana) => (
                                <SelectItem key={manzana.id_manzana} value={manzana.id_manzana}>
                                    {manzana.no_manzana}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="terreno">Terreno</Label>
                    <Select onValueChange={setTerreno} defaultValue="0">
                        <SelectTrigger id="terreno" aria-label="Selecciona el terreno">
                            <SelectValue placeholder="Selecciona el terreno" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {terrenos.map((terreno) => (
                                <SelectItem key={terreno.id_terreno} value={terreno.id_terreno}>
                                    {terreno.no_terreno}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="mes">Mes</Label>
                    <Select onValueChange={setMes} defaultValue="0">
                        <SelectTrigger id="mes" aria-label="Selecciona el terreno">
                            <SelectValue placeholder="Selecciona el terreno" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {meses.map((mes) => (
                                <SelectItem key={mes.id} value={mes.id}>
                                    {mes.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="anio">Año</Label>
                    <Select onValueChange={setAnio} defaultValue="0">
                        <SelectTrigger id="anio" aria-label="Selecciona el terreno">
                            <SelectValue placeholder="Selecciona el terreno" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {anios.map((anio) => (
                                <SelectItem key={anio} value={anio.toString()}>
                                    {anio}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="anio">Estatus</Label>
                    <Select onValueChange={setEstatusToma} defaultValue="0">
                        <SelectTrigger id="estatusToma" aria-label="Selecciona estatus">
                            <SelectValue placeholder="Selecciona estatus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="estatusTodas">
                                Todos
                            </SelectItem>
                            <SelectItem value="1" id="estatusActiva">
                                Activa
                            </SelectItem>
                            <SelectItem value="2" id="estatusSuspendida">
                                Suspendida
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Separator className="my-1 size-1 bg-white" />
            <Button className="p-4 " size={"sm"} variant="default" onClick={getDatos}>
                BUSCAR
            </Button>
            <Separator className="my-1 size-1 bg-white" />
        </>
    );
}
