"use client";

import { Label } from "@/components/ui/label";
import { useVentasMaduradasFiltrosConsultaStore } from "@/app/store/dashboard/reportes/ventasMaduradas/filtrosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import moment from "moment";

interface Asesor {
    id_usuario: string;
    nombre_asesor: string;
}

interface FiltrosConsultaProps {
    asesoresActivos: Asesor[];
}

export default function ListadoVentasMaduradas(
    { asesoresActivos }: FiltrosConsultaProps,
    { className }: React.HTMLAttributes<HTMLDivElement>
) {
    const Resultados = useVentasMaduradasFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);
    const mesInicio = useVentasMaduradasFiltrosConsultaStore((state: { setMesInicio: any }) => state.setMesInicio);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [chkVenta, setChkVenta] = useState<boolean>(false);
    const [chkPostVenta, setChkPostVenta] = useState<boolean>(false);
    const [chkCancelado, setChkCancelado] = useState<boolean>(false);
    const [asesorActivo, setAsesorActivo] = useState<string>("0");
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");

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
        setAsesorActivo(asesorActivo);
        // if (date?.from && date?.to) {
        //     // Check for both from and to dates
        //     setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
        //     setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
        // } else {
        //     setFInicio("");
        //     setFFin("");
        // }
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/ventasMaduradas/datosVentas?idAsesorActivo=${asesorActivo}&chkVenta=${chkVenta}&chkPostVenta=${chkPostVenta}&chkCancelado=${chkCancelado}&fInicio=${fInicio}&fFin=${fFin}&asesor=${asesorActivo}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                Resultados(data);
                mesInicio(fInicio);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    };
    // function handleCheckedChange() {}
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                <Label htmlFor="status">Asesor</Label>
                <Select onValueChange={setAsesorActivo}>
                    <SelectTrigger id="status" aria-label="Selecciona el asesor">
                        <SelectValue placeholder="Selecciona el asesor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0" id="0">
                            Todos
                        </SelectItem>
                        {asesoresActivos.map((asesor) => (
                            <SelectItem key={asesor.id_usuario} value={asesor.id_usuario}>
                                {asesor.nombre_asesor}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                <div className="items-top flex space-x-2">
                    <Checkbox id="chkVentas" onCheckedChange={(e) => setChkVenta(!chkVenta)} />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Venta
                        </label>
                    </div>
                </div>
                <div className="items-top flex space-x-2">
                    <Checkbox id="chkPostVenta" onCheckedChange={(e) => setChkPostVenta(!chkPostVenta)} />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Post-venta
                        </label>
                    </div>
                </div>
                <div className="items-top flex space-x-2">
                    <Checkbox id="chkCancelado" onCheckedChange={(e) => setChkCancelado(!chkCancelado)} />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Cancelado
                        </label>
                    </div>
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
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
            <Separator className="my-1 size-1 bg-white" />
            {/* <Button className="p-6" onClick={getDatos}>
                BUSCAR
            </Button> */}
            <Button className="p-4 " size={"sm"} variant="default" onClick={datos}>
                BUSCAR
            </Button>
            <Separator className="my-1 size-1 bg-white" />
        </>
    );
}
