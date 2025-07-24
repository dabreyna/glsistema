"use client";

import { Label } from "@/components/ui/label";
import { useHistoricoTraspasosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/historicoTraspasos/filtrosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";

export default function FiltrosConsultaCancelados({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const seleccionaResultados = useHistoricoTraspasosFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [chkFechaRecibo, setChkFechaRecibo] = useState<boolean>(false);
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    const [date, setDate] = useState<DateRange | undefined>(undefined);

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
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/historicoTraspasos?fInicio=${fInicio}&fFin=${fFin}&chkFechaRecibo=${chkFechaRecibo}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                seleccionaResultados(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 ">
                {/* <div className="md:col-span-3 lg:col-span-3 xl:col-span-3"></div> */}
                {/* <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <div className={cn("grid gap-2 item", className)}>
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
                </div> */}
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
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <div className="items-center flex space-x-2 p-4">
                        <Checkbox id="chkDolares" onCheckedChange={(e) => setChkFechaRecibo(!chkFechaRecibo)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Fecha de recibo
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12"></div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-6" onClick={getDatos}>
                DATOS
            </Button>
        </>
    );
}
