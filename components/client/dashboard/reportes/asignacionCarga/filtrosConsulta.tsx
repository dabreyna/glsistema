"use client";

import { Label } from "@/components/ui/label";
import { useReporteAsignacionCargaResultadosConsultaStore } from "@/app/store/dashboard/reportes/asignacionCarga/resultadosConsultaStore";
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
import { Checkbox } from "@/components/ui/checkbox";
import { set } from "lodash";
import moment from "moment";
import { Input } from "@/components/ui/input";

interface AsesorCobranza {
    id_usuario: string;
    nombre_asesor: string;
}

interface FiltrosConsultaProps {
    listaAsesores: AsesorCobranza[];
}

export default function FiltrosConsultaReporteAsignacionCarga({ listaAsesores }: FiltrosConsultaProps) {
    const seleccionaResultados = useReporteAsignacionCargaResultadosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [usuarioActivo, setUsuarioActivo] = useState<string>("0");
    const [servicios, setServicios] = useState<boolean>(false);
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");

    useEffect(() => {
        if (date?.from && date?.to) {
            // Check for both from and to dates
            setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
            setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
        } else {
            setFInicio("");
            setFFin("");
            seleccionaResultados([]);
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
        //     seleccionaResultados([]);
        // }
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/asignacionCarga?idUsuarioActivo=${usuarioActivo}&chkServicios=${servicios}&fInicio=${fInicio}&fFin=${fFin}`
                );
                if (!response.ok) {
                    seleccionaResultados([]);
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
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
                            {listaAsesores.map((Usuario) => (
                                <SelectItem key={Usuario.id_usuario} value={Usuario.id_usuario}>
                                    {Usuario.nombre_asesor}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-1 items-center">
                    {/* <Label htmlFor="status">Usuarios Activos</Label> */}
                    <br />
                    <div className="items-center flex space-x-2">
                        <Checkbox id="chkServicios" onCheckedChange={(e) => setServicios(!servicios)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Servicios
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-4 " size={"sm"} variant="default" onClick={getDatos}>
                BUSCAR
            </Button>
            <Separator className="my-4 size-1 bg-white" />
        </>
    );
}
