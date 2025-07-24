"use client";

import { Label } from "@/components/ui/label";
import { useDescuentosAplicadosResultadosConsultaStore } from "@/app/store/dashboard/reportes/descuentosAplicados/resultadosConsultaStore";
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

interface Fraccionamiento {
    id_fraccionamiento: string;
    fraccionamiento: string;
}

interface Usuario {
    id_usuario: string;
    nombre_usuario: string;
}

interface FiltrosConsultaProps {
    listaFraccionamientos: Fraccionamiento[];
    listaUsuarios: Usuario[];
}

export default function FiltrosConsultaReporteCobranza({ listaFraccionamientos, listaUsuarios }: FiltrosConsultaProps) {
    const seleccionaResultados = useDescuentosAplicadosResultadosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [fraccionamiento, setFraccionamiento] = useState<string>("0");
    const [tipoDescuento, setTipoDescuento] = useState<string>("0");
    const [usuarioActivo, setUsuarioActivo] = useState<string>("0");

    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    // const [cliente, setCliente] = useState<string>("");
    // const [nombreCliente, setNombreCliente] = useState<string>("");

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
            seleccionaResultados([]);
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/descuentosAplicados?idFraccionamiento=${fraccionamiento}&tipoDescuento=${tipoDescuento}&idUsuarioActivo=${usuarioActivo}&fInicio=${fInicio}&fFin=${fFin}`
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
                    <Label htmlFor="status">Asesor</Label>
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

                <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
                    <Label htmlFor="status">Fecha Inicio-Fin</Label>
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
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Tipo</Label>
                    <Select onValueChange={setTipoDescuento} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Usuario">
                            <SelectValue placeholder="Selecciona Usuario" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            <SelectItem value="6" id="INTERES">
                                INTERES
                            </SelectItem>
                            <SelectItem value="5" id="MENSUALIDAD">
                                MENSUALIDAD
                            </SelectItem>
                            <SelectItem value="nota" id="NOTA DE CREDITO">
                                NOTA DE CREDITO
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-6" onClick={getDatos}>
                DATOS
            </Button>
        </>
    );
}
