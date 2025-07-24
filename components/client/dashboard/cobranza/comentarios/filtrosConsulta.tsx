"use client";

import { Label } from "@/components/ui/label";
import { useComentariosFiltrosConsultaStore } from "@/app/store/dashboard/cobranza/comentarios/filtrosConsultaStore";
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
import { es, se } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import moment from "moment";

interface Usuario {
    id_usuario: string;
    nombre_asesor: string;
}

interface FiltrosConsultaProps {
    listaUsuarios: Usuario[];
    listaUsuariosInactivos: Usuario[];
}

export default function FiltrosConsulta({ listaUsuarios, listaUsuariosInactivos }: FiltrosConsultaProps) {
    const seleccionaResultados = useComentariosFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [usuarioActivo, setUsuarioActivo] = useState<string>("0");
    const [usuarioInactivo, setUsuarioInactivo] = useState<string>("0");

    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    const [nombreCliente, setNombreCliente] = useState<string>("");

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

    function getDatos() {
        // seleccionaResultados([]);
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
                // const response = await fetch(
                //     `/api/dashboard/cobranza/comentarios?idUsuarioActivo=${usuarioActivo}&idUsuarioInactivo=${usuarioInactivo}&fInicio=${fInicio}&fFin=${fFin}&nombreCliente=${nombreCliente}`
                // );
                // console.log(fInicio);
                // console.log(fFin);
                const response = await fetch(
                    `/api/dashboard/cobranza/comentarios?fInicio=${fInicio}&fFin=${fFin}&nombreCliente=${nombreCliente}`
                );
                if (!response.ok) {
                    // seleccionaResultados([]);
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

    const handleFInicio = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setFInicio(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
    };
    const handleFFin = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setFFin(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
    };
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                        placeholder="Ej. Jorge Perez"
                        id="cliente"
                        className="uppercase"
                        onChange={(event) => setNombreCliente(event.target.value)}
                    />
                </div>
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
                {/* <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="status">Asesores Activos</Label>
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
                                    {Usuario.nombre_asesor}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="status">Asesores Inactivos</Label>
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
                                    {Usuario.nombre_asesor}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
                    <Label htmlFor="date">Fecha Inicio - Fecha Fin</Label>
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
            <Button className="p-4 " size={"sm"} variant="default" onClick={getDatos}>
                BUSCAR
            </Button>
        </>
    );
}
