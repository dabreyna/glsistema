"use client";

import { Label } from "@/components/ui/label";
import { useCallCenterFiltrosConsultaStore } from "@/app/store/dashboard/cobranza/callCenter/filtrosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";

interface Usuario {
    id_usuario: string;
    nombre_asesor: string;
}
interface Fraccionamiento {
    id_fraccionamiento: string;
    fraccionamiento: string;
}
interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}
interface Vencimiento {
    id_tipo_vencimiento: string;
    vencimiento: string;
}

interface FiltrosConsultaProps {
    listaUsuarios: Usuario[];
    listaFraccionamientos: Fraccionamiento[];
    listaClasificaciones: Clasificacion[];
    listaVencimientos: Vencimiento[];
}

export default function FiltrosConsulta({
    listaUsuarios,
    listaFraccionamientos,
    listaClasificaciones,
    listaVencimientos,
}: FiltrosConsultaProps) {
    const seleccionaResultados = useCallCenterFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [fraccionamiento, setFraccionamiento] = useState<string>("0");
    const [clasificacion, setClasificacion] = useState<string>("0");
    const [asesor, setAsesor] = useState<string>("0");
    const [diaPago, setDiaPago] = useState<string>("0");
    const [mensualidadMinima, setMensualidadMinima] = useState<string>("");
    const [mensualidadMaxima, setMensualidadMaxima] = useState<string>("");
    const [tipoVencimiento, setTipoVencimiento] = useState<string>("0");
    const [nuevos, setNuevos] = useState<boolean>(false);
    const [postventa, setPostVenta] = useState<boolean>(false);

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
        // if (date?.from && date?.to) {
        //     // Check for both from and to dates
        //     setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
        //     setFFin(format(date.to, "yyyy-MM-dd", { locale: es }));
        // } else {
        //     setFInicio("");
        //     setFFin("");
        // }
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
                    `/api/dashboard/cobranza/callCenter?fInicio=${fInicio}&fFin=${fFin}&nombreCliente=${nombreCliente}&idFraccionamiento=${fraccionamiento}&idClasificacion=${clasificacion}&idAsesor=${asesor}&diaPago=${diaPago}&mensualidadMinima=${mensualidadMinima}&mensualidadMaxima=${mensualidadMaxima}&tipoVencimiento=${tipoVencimiento}&nuevos=${nuevos}&postventa=${postventa}`
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
        const newData = event.target.value;
        setFInicio(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
    };
    const handleFFin = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setFFin(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                        placeholder="Ej. Jorge Perez"
                        id="cliente"
                        className="uppercase"
                        onChange={(event) => setNombreCliente(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Fraccionamiento</Label>
                    <Select onValueChange={setFraccionamiento} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Fraccionamiento">
                            <SelectValue placeholder="Selecciona Fraccionamiento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {listaFraccionamientos.map((Fraccionamiento) => (
                                <SelectItem key={Fraccionamiento.id_fraccionamiento} value={Fraccionamiento.id_fraccionamiento}>
                                    {Fraccionamiento.fraccionamiento}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Clasificacion</Label>
                    <Select onValueChange={setClasificacion} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona opcion">
                            <SelectValue placeholder="Selecciona opcion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {listaClasificaciones.map((Clasificacion) => (
                                <SelectItem key={Clasificacion.id_clasificacion} value={Clasificacion.id_clasificacion}>
                                    {Clasificacion.clasificacion}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Asesores Activos</Label>
                    <Select onValueChange={setAsesor} defaultValue="0">
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
                {/* <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
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
                    <Label htmlFor="status">Dia de pago</Label>
                    <Select onValueChange={setDiaPago} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Usuario">
                            <SelectValue placeholder="Selecciona Usuario" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            <SelectItem value="1" id="dia1">
                                1
                            </SelectItem>
                            <SelectItem value="15" id="dia15">
                                15
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="cliente">Mensualidad Minima</Label>
                    <Input
                        placeholder="Ej. 1"
                        id="cliente"
                        className="uppercase"
                        onChange={(event) => setMensualidadMinima(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="cliente">Mensualidad Maxima</Label>
                    <Input
                        placeholder="Ej. 4"
                        id="cliente"
                        className="uppercase"
                        onChange={(event) => setMensualidadMaxima(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Tipo Vencimiento</Label>
                    <Select onValueChange={setTipoVencimiento} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Vencimiento">
                            <SelectValue placeholder="Selecciona Vencimiento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {listaVencimientos.map((Vencimiento) => (
                                <SelectItem key={Vencimiento.id_tipo_vencimiento} value={Vencimiento.id_tipo_vencimiento}>
                                    {Vencimiento.vencimiento}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <div className="items-top flex space-x-2 py-1">
                        <Checkbox id="chkNuevos" onCheckedChange={(e) => setNuevos(!nuevos)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Solo clientes nuevos
                            </label>
                        </div>
                    </div>
                    <div className="items-top flex space-x-2 py-1">
                        <Checkbox id="chkPostVenta" onCheckedChange={(e) => setPostVenta(!postventa)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Solo clientes PostVenta
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-4 " size={"sm"} variant="default" onClick={getDatos}>
                BUSCAR
            </Button>
        </>
    );
}
