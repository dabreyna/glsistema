"use client";

import { Label } from "@/components/ui/label";
import { useDetalladoVentasFiltrosConsultaStore } from "@/app/store/dashboard/reportes/detalladoVentas/filtrosConsultaStore";

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
import moment from "moment";
import { Input } from "@/components/ui/input";

interface Empresa {
    id_empresa: string;
    razon_social: string;
}
interface Asesor {
    id_usuario: string;
    nombre: string;
}
interface EstatusContrato {
    id_estatus: string;
    estatus: string;
}

interface FiltrosConsultaProps {
    listaEmpresas: Empresa[];
    listaAsesoresActivos: Asesor[];
    listaAsesoresInactivos: Asesor[];
    listaEstatusContrato: EstatusContrato[];
    id_usuario: string | undefined | null;
    perfil_usuario: string | undefined | null;
}

export default function FiltrosConsultaDetalladoVentas({
    listaEmpresas,
    listaAsesoresActivos,
    listaAsesoresInactivos,
    listaEstatusContrato,
    id_usuario,
    perfil_usuario,
}: FiltrosConsultaProps) {
    const tablaResumenAsesores = useDetalladoVentasFiltrosConsultaStore((state: { setResumenAsesores: any }) => state.setResumenAsesores);
    const tablaResumenEmpresas = useDetalladoVentasFiltrosConsultaStore((state: { setResumenEmpresas: any }) => state.setResumenEmpresas);
    const tablaDetallados = useDetalladoVentasFiltrosConsultaStore((state: { setDetallado: any }) => state.setDetallado);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [empresa, setEmpresa] = useState<string>("0");
    const [estatus, setEstatus] = useState<string>("0");
    const [usuarioActivo, setUsuarioActivo] = useState<string>("0");
    const [usuarioInactivo, setUsuarioInactivo] = useState<string>("0");
    const [chkReubicacion, setChkReubicacion] = useState<boolean>(false);
    const [chkCancelacion, setChkCancelacion] = useState<boolean>(false);

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

    const getDatos = () => {
        if (date?.from && date?.to) {
            // Check for both from and to dates
            setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
            setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
        } else {
            setFInicio("");
            setFFin("");
        }

        const fetchResumen = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/detalladoVentas/resumen/asesores?idEmpresa=${empresa}&fInicio=${fInicio}&fFin=${fFin}&estatus=${estatus}&idUsuario=${id_usuario}&perfil=${perfil_usuario}&usuarioActivo=${usuarioActivo}&usuarioInactivo=${usuarioInactivo}&chkReubicacion=${chkReubicacion}&chkCancelacion=${chkCancelacion}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                tablaResumenAsesores(data);
            } catch (error) {
                console.error(error);
            }
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/detalladoVentas/resumen/empresas?idEmpresa=${empresa}&fInicio=${fInicio}&fFin=${fFin}&estatus=${estatus}&idUsuario=${id_usuario}&perfil=${perfil_usuario}&usuarioActivo=${usuarioActivo}&usuarioInactivo=${usuarioInactivo}&chkReubicacion=${chkReubicacion}&chkCancelacion=${chkCancelacion}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                tablaResumenEmpresas(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchDetallado = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/reportes/detalladoVentas/detallado?idEmpresa=${empresa}&fInicio=${fInicio}&fFin=${fFin}&estatus=${estatus}&idUsuario=${id_usuario}&perfil=${perfil_usuario}&usuarioActivo=${usuarioActivo}&usuarioInactivo=${usuarioInactivo}&chkReubicacion=${chkReubicacion}&chkCancelacion=${chkCancelacion}`
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="empresa">Empresa</Label>
                    <Select onValueChange={setEmpresa} defaultValue="0">
                        <SelectTrigger id="empresa" aria-label="Selecciona Empresa">
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
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Estatus</Label>
                    <Select onValueChange={setEstatus} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Estatus">
                            <SelectValue placeholder="Selecciona Estatus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                TODOS
                            </SelectItem>
                            {listaEstatusContrato.map((estatus) => (
                                <SelectItem key={estatus.id_estatus} value={estatus.id_estatus}>
                                    {estatus.estatus}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="status">Asesor Activo</Label>
                    <Select onValueChange={setUsuarioActivo} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Asesor">
                            <SelectValue placeholder="Selecciona Asesor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                TODOS
                            </SelectItem>
                            {listaAsesoresActivos.map((asesor) => (
                                <SelectItem key={asesor.id_usuario} value={asesor.id_usuario}>
                                    {asesor.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="status">Asesor Inactivo</Label>
                    <Select onValueChange={setUsuarioInactivo} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Asesor">
                            <SelectValue placeholder="Selecciona Asesor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                TODOS
                            </SelectItem>
                            {listaAsesoresInactivos.map((asesor) => (
                                <SelectItem key={asesor.id_usuario} value={asesor.id_usuario}>
                                    {asesor.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 items-center flex space-x-2">
                    <div className="items-center flex space-x-2">
                        <Checkbox id="chkCancelado" onCheckedChange={(e) => setChkReubicacion(!chkReubicacion)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Altas por reubicacion
                            </label>
                        </div>
                    </div>
                    <div className="items-center flex space-x-2 py-1">
                        <Checkbox id="chkCancelado" onCheckedChange={(e) => setChkCancelacion(!chkCancelacion)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Altas por cancelacion
                            </label>
                        </div>
                    </div>
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
