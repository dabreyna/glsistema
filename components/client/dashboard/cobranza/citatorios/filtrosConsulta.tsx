"use client";

import { Label } from "@/components/ui/label";
import { useCitatoriosFiltrosConsultaStore } from "@/app/store/dashboard/cobranza/citatorios/filtrosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

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

export default function FiltrosConsultaCitatorios({ listaFraccionamientos }: FiltrosConsultaProps) {
    const seleccionaResultados = useCitatoriosFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [fraccionamiento, setFraccionamiento] = useState<string>("0");
    const [manzana, setManzana] = useState<string>("0");
    const [terreno, setTerreno] = useState<string>("0");
    const [mensualidades, setMensualidades] = useState<string>("0");

    const [manzanas, setManzanas] = useState<Manzana[]>([]);
    const [terrenos, setTerrenos] = useState<Terreno[]>([]);
    // const [cliente, setCliente] = useState<string>("");
    const [nombreCliente, setNombreCliente] = useState<string>("");

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
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/cobranza/citatorios?idFraccionamiento=${fraccionamiento}&idManzana=${manzana}&idTerreno=${terreno}&nombreCliente=${nombreCliente}&mensualidades=${mensualidades}`
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
                <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
                    <Label htmlFor="status">Fraccionamiento</Label>
                    <Select onValueChange={setFraccionamiento} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona el fraccionamiento">
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
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Manzana</Label>
                    <Select onValueChange={setManzana} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona la manzana">
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
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Terreno</Label>
                    <Select onValueChange={setTerreno} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona el terreno">
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
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Mensualidades atrasadas</Label>
                    <Select onValueChange={setMensualidades} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona una opcion">
                            <SelectValue placeholder="Selecciona una opcion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="op0">
                                Selecciona una opcion
                            </SelectItem>
                            <SelectItem value="1" id="op1">
                                1 mensualidad
                            </SelectItem>
                            <SelectItem value="2" id="op2">
                                2 mensualidades
                            </SelectItem>
                            <SelectItem value="3" id="op3">
                                3 mensualidades
                            </SelectItem>
                            <SelectItem value="4" id="op4">
                                4 o mas mensualidades
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                        placeholder="Ej. Jorge Perez"
                        id="cliente"
                        className="uppercase"
                        onChange={(event) => setNombreCliente(event.target.value)}
                    />
                </div>
            </div>
            <Separator className="my-1 size-1 bg-white" />
            {/* <Button className="p-6" onClick={getDatos}>
                BUSCAR
            </Button> */}
            <Button className="p-4 " size={"sm"} variant="default" onClick={getDatos}>
                BUSCAR
            </Button>
            <Separator className="my-1 size-1 bg-white" />
        </>
    );
}
