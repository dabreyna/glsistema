"use client";

import { Label } from "@/components/ui/label";
// import { useReporteCobranzaResultadosConsultaStore } from "@/app/store/dashboard/reportes/reporteCobranza/resultadosConsultaStore";
import { useReporteDevolucionProgramadaResultadosConsultaStore } from "@/app/store/dashboard/reportes/devolucionProgramada/resultadosConsultaStore";

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
import { Input } from "@/components/ui/input";

interface Empresa {
    id_empresa: string;
    razon_social: string;
}
interface Fraccionamiento {
    id_fraccionamiento: string;
    fraccionamiento: string;
}

interface FiltrosConsultaProps {
    listaEmpresas: Empresa[];
    listaFraccionamientos: Fraccionamiento[];
}

export default function FiltrosConsultaReporteRecuperacionDeCartera({ listaEmpresas, listaFraccionamientos }: FiltrosConsultaProps) {
    const seleccionaResultados = useReporteDevolucionProgramadaResultadosConsultaStore(
        (state: { setResultados: any }) => state.setResultados
    );

    // const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [date, setDate] = React.useState<Date>();
    const [fecha, setFecha] = useState<string>("");
    const [empresa, setEmpresa] = useState<string>("0");
    const [fraccionamiento, setFraccionamiento] = useState<string>("0");
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    const [tipoCambio, setTipoCambio] = useState<string>("20");

    useEffect(() => {
        if (date) {
            // Check for both from and to dates
            setFecha(format(date, "yyyy-MM-dd", { locale: es }));
        } else {
            setFecha("");
        }
    }, [date]); // Update fInicio and fFin whenever date changes

    function getDatos() {
        // if (date?.from && date?.to) {
        //     // Check for both from and to dates
        //     setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
        //     setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
        // } else {
        //     setFInicio("");
        //     setFFin("");
        // }
        const fetchData = async () => {
            seleccionaResultados([]);
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/carteraVencida?idEmpresa=${empresa}&fecha=${fecha}&idFraccionamiento=${fraccionamiento}&tipoCambio=${tipoCambio}`
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
                    <Label htmlFor="status">Fraccionamiento</Label>
                    <Select onValueChange={setFraccionamiento} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Empresa">
                            <SelectValue placeholder="Selecciona Empresa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                TODOS
                            </SelectItem>
                            {listaFraccionamientos.map((fraccionamiento) => (
                                <SelectItem key={fraccionamiento.id_fraccionamiento} value={fraccionamiento.id_fraccionamiento}>
                                    {fraccionamiento.fraccionamiento}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="status">Fecha</Label>
                    <br />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                            >
                                <CalendarIcon />
                                {date ? format(date, "LLL dd, y", { locale: es }) : <span>Elige el dia</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="status">Moneda</Label>
                    <Select onValueChange={setFraccionamiento} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Moneda">
                            <SelectValue placeholder="Selecciona Moneda" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="pesos">
                                PESOS
                            </SelectItem>
                            <SelectItem value="1" id="dlls">
                                DOLARES
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
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
                </div> */}
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-6" onClick={getDatos}>
                DATOS
            </Button>
        </>
    );
}
