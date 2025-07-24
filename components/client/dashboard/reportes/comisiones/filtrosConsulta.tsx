"use client";

import { Label } from "@/components/ui/label";
import { useComisionesFiltrosConsultaStore } from "@/app/store/dashboard/reportes/comisiones/filtrosConsultaStore";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import moment from "moment";
import { Input } from "@/components/ui/input";
// import FiltrosConsulta from "@/components/client/dashboard/reportes/catalogoClientes/filtrosConsulta";

interface Asesor {
    id_usuario: string;
    nombre_asesor: string;
}
interface TotalesComisiones {
    total_generado: string;
    total_pagado: string;
}
interface asesor {
    asesor: string;
}

interface FiltrosConsultaProps {
    id_usuario: string | undefined | null;
    perfil_usuario: string | undefined | null;
}

export default function FiltrosConsultaComisiones(
    { id_usuario, perfil_usuario }: FiltrosConsultaProps,
    { className }: React.HTMLAttributes<HTMLDivElement>
) {
    const tablaResumen = useComisionesFiltrosConsultaStore((state: { setResumen: any }) => state.setResumen);
    const tablaDetallados = useComisionesFiltrosConsultaStore((state: { setDetallado: any }) => state.setDetallado);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    const [totalesComisiones, setTotalesComisiones] = useState<TotalesComisiones>({ total_generado: "0", total_pagado: "0" });

    // useEffect(() => {
    //     if (date?.from && date?.to) {
    //         // Check for both from and to dates
    //         setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
    //         setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
    //     } else {
    //         setFInicio("");
    //         setFFin("");
    //     }
    // }, [date]); // Update fInicio and fFin whenever date changes

    const datos = () => {
        // if (date?.from && date?.to) {
        //     // Check for both from and to dates
        //     setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
        //     setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
        // } else {
        //     setFInicio("");
        //     setFFin("");
        // }

        const fetchResumen = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/comisiones/resumen?fInicio=${fInicio}&fFin=${fFin}&idUsuario=${id_usuario}&perfil=${perfil_usuario}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                tablaResumen(data);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchDetallado = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/comisiones/detallado?fInicio=${fInicio}&fFin=${fFin}&usuario=${id_usuario}&perfil=${perfil_usuario}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                tablaDetallados(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchResumen();
        fetchDetallado();
    };

    const handleFInicio = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const parsedDate = moment(inputValue, "DD/MM/YYYY", true); // El 'true' fuerza la validación estricta del formato

        if (parsedDate.isValid()) {
            setFInicio(parsedDate.format("YYYY-MM-DD"));
        } else if (inputValue !== "") {
            // Si el valor no está vacío y no es una fecha válida, limpia el input
            event.target.value = ""; // Limpia el valor del input directamente
            setFInicio(""); // Actualiza el estado a vacío también (opcional, depende de tu lógica)
            alert("Por favor, introduce una fecha válida en formato DD/MM/YYYY."); // O muestra un mensaje de error
        } else {
            // Si el input está vacío, simplemente actualiza el estado a vacío
            setFInicio("");
        }
        // const newData = event.target.value;
        // setFInicio(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
    };

    const handleFFin = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const parsedDate = moment(inputValue, "DD/MM/YYYY", true); // El 'true' fuerza la validación estricta del formato

        if (parsedDate.isValid()) {
            setFFin(parsedDate.format("YYYY-MM-DD"));
        } else if (inputValue !== "") {
            // Si el valor no está vacío y no es una fecha válida, limpia el input
            event.target.value = ""; // Limpia el valor del input directamente
            setFFin(""); // Actualiza el estado a vacío también (opcional, depende de tu lógica)
            alert("Por favor, introduce una fecha válida en formato DD/MM/YYYY."); // O muestra un mensaje de error
        } else {
            // Si el input está vacío, simplemente actualiza el estado a vacío
            setFFin("");
        }
        // const newData = event.target.value;
        // setFFin(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
    };
    return (
        <>
            <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                <Label htmlFor="">Fecha Inicio</Label>
                <Input
                    id="fechaInicio"
                    placeholder={fInicio ? moment(fInicio, "YYYY-MM-DD").format("DD/MM/YYYY") : "dd/mm/aaaa"}
                    className="uppercase"
                    onBlur={handleFInicio}
                />
            </div>
            <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                <Label htmlFor="">Fecha Fin</Label>

                <Input
                    id="fechaFin"
                    placeholder={fFin ? moment(fFin, "YYYY-MM-DD").format("DD/MM/YYYY") : "dd/mm/aaaa"}
                    className="uppercase"
                    onBlur={handleFFin}
                />
            </div>
            {/* <div className={cn("grid gap-2", className)}>
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
                                        {format(date.from, "LLL dd, y", { locale: es })} - {format(date.to, "LLL dd, y", { locale: es })}
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
            <Separator className="my-1 size-1 bg-white" />
            {/* <Button className="p-6" onClick={getDatos}>
                BUSCAR
            </Button> */}
            <Button className="p-4 " size={"sm"} variant="default" onClick={datos}>
                BUSCAR
            </Button>
            <Separator className="my-1 size-1 bg-white" />
            {/* <Label>Totales</Label>
            <Separator className="my-4 size-1 bg-white" />
            <Label>Generado: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(totalesComisiones.total_generado))}</Label>
            <Separator className="h-0 bg-white" />
            <Label>Pagado: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(totalesComisiones.total_pagado))}</Label> */}
        </>
    );
}
