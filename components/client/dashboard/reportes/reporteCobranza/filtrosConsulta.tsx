"use client";

import { Label } from "@/components/ui/label";
import { useReporteCobranzaResultadosConsultaStore } from "@/app/store/dashboard/reportes/reporteCobranza/resultadosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface Empresa {
    id_empresa: string;
    razon_social: string;
}
interface Fraccionamiento {
    id_fraccionamiento: string;
    fraccionamiento: string;
}
interface Manzana {
    id_manzana: string;
    no_manzana: string;
}

interface Terreno {
    id_terreno: string;
    no_terreno: string;
}

interface Estacion {
    id_estacion: string;
    nombre: string;
}
interface Usuario {
    id_usuario: string;
    nombre_usuario: string;
}

interface FiltrosConsultaProps {
    listaEmpresas: Empresa[];
    listaEstaciones: Estacion[];
    listaUsuarios: Usuario[];
    listaUsuariosInactivos: Usuario[];
}

export default function FiltrosConsultaReporteCobranza({
    listaEmpresas,
    listaEstaciones,
    listaUsuarios,
    listaUsuariosInactivos,
}: FiltrosConsultaProps) {
    const seleccionaResultados = useReporteCobranzaResultadosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [empresa, setEmpresa] = useState<string>("0");
    const [estacion, setEstacion] = useState<string>("0");
    const [fraccionamiento, setFraccionamiento] = useState<string>("0");
    const [manzana, setManzana] = useState<string>("0");
    const [terreno, setTerreno] = useState<string>("0");
    const [usuarioActivo, setUsuarioActivo] = useState<string>("0");
    const [usuarioInactivo, setUsuarioInactivo] = useState<string>("0");
    const [moneda, setMoneda] = useState<string>("0");
    const [notaCredito, setNotaCredito] = useState<boolean>(false);
    const [pagosCancelados, setPagosCancelados] = useState<boolean>(false);
    const [pagosActivos, setPagosActivos] = useState<boolean>(false);

    const [fraccionamientos, setFraccionamientos] = useState<Fraccionamiento[]>([]);
    const [manzanas, setManzanas] = useState<Manzana[]>([]);
    const [terrenos, setTerrenos] = useState<Terreno[]>([]);
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    // const [cliente, setCliente] = useState<string>("");
    // const [nombreCliente, setNombreCliente] = useState<string>("");

    useEffect(() => {
        setFraccionamientos([]);
        setFraccionamiento("0");
        setManzanas([]);
        setManzana("0");
        setTerrenos([]);
        setTerreno("0");

        const getFraccionamientos = async () => {
            try {
                const response = await fetch(`/api/dashboard/reportes/reporteCobranza/filtros/fraccionamientos?idEmpresa=${empresa}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setFraccionamientos(data);
            } catch (error) {
                console.error(error);
            }
        };
        getFraccionamientos();
        setManzanas([]);
        setTerrenos([]);
    }, [empresa]); // Update  whenever filters changes

    useEffect(() => {
        if (date?.from && date?.to) {
            // Check for both from and to dates
            setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
            setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
        } else {
            setFInicio("");
            setFFin("");
        }
    }, [date]); // Update fInicio and fFin whenever date changes

    useEffect(() => {
        setManzanas([]);
        setManzana("0");
        setTerrenos([]);
        setTerreno("0");
        const getManzanas = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/reporteCobranza/filtros/manzanas?idFraccionamiento=${fraccionamiento}`
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
                const response = await fetch(`/api/dashboard/reportes/reporteCobranza/filtros/terrenos?idManzana=${manzana}`);
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
        if (date?.from && date?.to) {
            // Check for both from and to dates
            setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
            setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
        } else {
            setFInicio("");
            setFFin("");
        }
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/reporteCobranza?idEmpresa=${empresa}&idFraccionamiento=${fraccionamiento}&idManzana=${manzana}&idTerreno=${terreno}&estacion=${estacion}&idUsuarioActivo=${usuarioActivo}&idUsuarioInactivo=${usuarioInactivo}&moneda=${moneda}&notaCredito=${notaCredito}&pagosCancelados=${pagosCancelados}&pagosActivos=${pagosActivos}&fInicio=${fInicio}&fFin=${fFin}`
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
                    <Label htmlFor="status">Empresa</Label>
                    <Select onValueChange={setEmpresa} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Empresa">
                            <SelectValue placeholder="Selecciona Empresa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                TODAS
                            </SelectItem>
                            {listaEmpresas.map((empresa) => (
                                <SelectItem key={empresa.id_empresa} value={empresa.id_empresa}>
                                    {empresa.razon_social}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
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
                            {fraccionamientos.map((fraccionamiento) => (
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
                    <Label htmlFor="status">Estaciones</Label>
                    <Select onValueChange={setEstacion} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Estacion">
                            <SelectValue placeholder="Selecciona Estacion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todas
                            </SelectItem>
                            {listaEstaciones.map((Estacion) => (
                                <SelectItem key={Estacion.id_estacion} value={Estacion.id_estacion}>
                                    {Estacion.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Usuarios Activos</Label>
                    <Select onValueChange={setUsuarioActivo} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Usuario">
                            <SelectValue placeholder="Selecciona Usuario" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {listaUsuarios.map((Usuario) => (
                                <SelectItem key={Usuario.id_usuario} value={Usuario.id_usuario}>
                                    {Usuario.nombre_usuario}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Usuarios Inactivos</Label>
                    <Select onValueChange={setUsuarioInactivo} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Usuario">
                            <SelectValue placeholder="Selecciona Usuario" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {listaUsuariosInactivos.map((Usuario) => (
                                <SelectItem key={Usuario.id_usuario} value={Usuario.id_usuario}>
                                    {Usuario.nombre_usuario}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Moneda</Label>
                    <Select onValueChange={setMoneda} defaultValue="0">
                        <SelectTrigger id="status" aria-label="PESOS">
                            <SelectValue placeholder="PESOS" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                PESOS
                            </SelectItem>
                            <SelectItem value="1" id="1">
                                DOLARES
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-2 lg:col-span-2 xl:col-span-1">
                    <div className="items-top flex space-x-2">
                        <Checkbox id="chkCancelado" onCheckedChange={(e) => setNotaCredito(!notaCredito)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Nota de Credito
                            </label>
                        </div>
                    </div>
                    <div className="items-top flex space-x-2 py-1">
                        <Checkbox id="chkCancelado" onCheckedChange={(e) => setNotaCredito(!notaCredito)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Cancelados
                            </label>
                        </div>
                    </div>
                    <div className="items-top flex space-x-2">
                        <Checkbox id="chkCancelado" onCheckedChange={(e) => setNotaCredito(!notaCredito)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Activos
                            </label>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                            >
                                <CalendarIcon />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                                            {format(date.to, "LLL dd, y", { locale: es })}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y", { locale: es })
                                    )
                                ) : (
                                    <span>Estalece un rango de fechas</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={4}
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-6" onClick={getDatos}>
                DATOS
            </Button>
        </>
    );
}
