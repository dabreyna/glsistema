"use client";

import { Label } from "@/components/ui/label";
import { useReporteCobranzaResultadosConsultaStore } from "@/app/store/dashboard/reportes/reporteCobranza/resultadosConsultaStore";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";
// import FiltrosContabilidad from "@/components/client/dashboard/contabilidad/filtrosConsulta";

interface Empresa {
    id_empresa: string;
    razon_social: string;
}

interface FiltrosConsultaProps {
    listaEmpresas: Empresa[];
}

export default function FiltrosContabilidad({ listaEmpresas }: FiltrosConsultaProps) {
    const toast = useToast();
    // const seleccionaResultados = useReporteCobranzaResultadosConsultaStore((state: { setResultados: any }) => state.setResultados);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [empresa, setEmpresa] = useState<string>("0");
    const [fInicio, setFInicio] = useState("");
    const [fFin, setFFin] = useState("");
    // const [cliente, setCliente] = useState<string>("");
    const [folio, setFolio] = useState<string>("");
    const [tipoCambio, setTipoCambio] = useState<string>("");
    const [conceptoPoliza, setConceptoPoliza] = useState<string>("");
    const [conceptoMovimiento, setConceptoMovimiento] = useState<string>("");

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
            try {
                const response = await fetch(
                    `/api/dashboard/contabilidad/guardarPoliza?&fInicio=${fInicio}&fFin=${fFin}&concepto_poliza=${conceptoPoliza}&concepto_movimiento=${conceptoMovimiento}&tipo_cambio=${tipoCambio}&folio=${folio}&id_empresa=${empresa}`
                );
                if (!response.ok) {
                    toast.toast({
                        title: "ERROR",
                        description: "Algo sucedio y la poliza no se pudo generar, intentalo de nuevo.",
                        variant: "destructive",
                        duration: 1600,
                    });
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                toast.toast({
                    title: `ORDEN EJECUTADA`,
                    description: `Poliza grabada exitosamente.`,
                    variant: "destructive",
                    duration: 1600,
                });
                const data = await response.json();
                // seleccionaResultados(data);
                // console.log(data);
                if (data) {
                    redirect("/private/dashboard/reportes/contabilidad/");
                }
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
                    <Label htmlFor="status">Empresa</Label>
                    <Select onValueChange={setEmpresa} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona Empresa">
                            <SelectValue placeholder="Selecciona Empresa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Selecciona Empresa
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
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="folio">Folio</Label>
                    <Input id="folio" className="uppercase" onChange={(event) => setFolio(event.target.value)} />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="tipo_cambio">Tipo Cambio</Label>
                    <Input id="tipo_cambio" className="uppercase" onChange={(event) => setTipoCambio(event.target.value)} />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="concepto_poliza">Concepto Poliza</Label>
                    <Input id="concepto_poliza" className="uppercase" onChange={(event) => setConceptoPoliza(event.target.value)} />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="concepto_movimiento">Concepto Movimiento</Label>
                    <Input id="concepto_movimiento" className="uppercase" onChange={(event) => setConceptoMovimiento(event.target.value)} />
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-6" onClick={getDatos}>
                GUARDAR
            </Button>
        </>
    );
}
