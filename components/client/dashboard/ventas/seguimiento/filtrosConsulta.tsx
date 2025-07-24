"use client";

import { Label } from "@/components/ui/label";
import { useSeguimientoFiltrosConsultaStore } from "@/app/store/dashboard/ventas/seguimiento/filtrosConsultaStore";
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

interface asesorVenta {
    id_usuario: string;
    nombre_asesor: string;
}
interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}

interface FiltrosConsultaProps {
    listaAsesores: asesorVenta[];
    listaClasificacion: Clasificacion[];
    idUsuario: string;
    perfilUsuario: string;
}

export default function FiltrosConsultaSeguimiento(
    { listaAsesores, listaClasificacion, idUsuario, perfilUsuario }: FiltrosConsultaProps,
    { className }: React.HTMLAttributes<HTMLDivElement>
) {
    const seleccionaResultados = useSeguimientoFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [asesorVenta, setAsesorVenta] = useState<string>("0");
    const [tipoDeClasificacion, setTipoDeClasificacion] = useState<string>("0");
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    console.log(idUsuario);
    console.log(perfilUsuario);
    useEffect(() => {
        seleccionaResultados([]);
    }, []);

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
                    `/api/dashboard/ventas/prospecto/seguimiento?idAsesor=${asesorVenta}&fInicio=${fInicio}&fFin=${fFin}&nombreCliente=${nombreCliente}&tipoDeClasificacion=${tipoDeClasificacion}&idUsuario=${idUsuario}&perfilUsuario=${perfilUsuario}`
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
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="status">Asesor</Label>
                    <Select onValueChange={setAsesorVenta}>
                        <SelectTrigger id="status" aria-label="Selecciona el asesor">
                            <SelectValue placeholder="Selecciona el asesor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Selecciona el Asesor
                            </SelectItem>
                            {listaAsesores.map((asesorCobranza) => (
                                <SelectItem key={asesorCobranza.id_usuario} value={asesorCobranza.id_usuario}>
                                    {asesorCobranza.nombre_asesor}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="status">Clasificacion</Label>
                    <Select onValueChange={setTipoDeClasificacion}>
                        <SelectTrigger id="status" aria-label="Selecciona clasificacion">
                            <SelectValue placeholder="Selecciona clasificacion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Selecciona el Asesor
                            </SelectItem>
                            {listaClasificacion.map((tipoClasificacion) => (
                                <SelectItem key={tipoClasificacion.id_clasificacion} value={tipoClasificacion.id_clasificacion}>
                                    {tipoClasificacion.clasificacion}
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

                <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
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
