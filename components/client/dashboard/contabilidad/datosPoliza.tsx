"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { id } from "date-fns/locale";
import { set } from "lodash";
import { Value } from "@radix-ui/react-select";
// import FiltrosContabilidad from "@/components/client/dashboard/contabilidad/filtrosConsulta";

interface Empresa {
    id_empresa: string;
    razon_social: string;
}
interface Poliza {
    id_poliza: string;
    finicio: string;
    ffin: string;
    concepto_poliza: string;
    concepto_movimiento: string;
    tipo_cambio: string;
    folio: string;
    id_empresa: string;
}

interface FiltrosConsultaProps {
    listaEmpresas: Empresa[];
    poliza: Poliza[];
}

export default function DatosPoliza({ listaEmpresas, poliza }: FiltrosConsultaProps) {
    const toast = useToast();
    //const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [empresa, setEmpresa] = useState<string>(poliza[0]?.id_empresa);
    const [fInicio, setFInicio] = useState(poliza[0]?.finicio);
    const [fFin, setFFin] = useState(poliza[0]?.ffin);
    const [conceptoPoliza, setConceptoPoliza] = useState(poliza[0]?.concepto_poliza);
    const [conceptoMovimiento, setConceptoMovimiento] = useState(poliza[0]?.concepto_movimiento);
    const [folio, setFolio] = useState<string>(poliza[0]?.folio);
    const [tipoCambio, setTipoCambio] = useState<string>(poliza[0]?.tipo_cambio);

    useEffect(() => {
        setEmpresa(empresa === undefined ? poliza[0]?.id_empresa : empresa);
        setFInicio(fInicio === undefined ? poliza[0]?.finicio : fInicio);
        setFFin(fFin === undefined ? poliza[0]?.ffin : fFin);
        setConceptoPoliza(conceptoPoliza === undefined ? poliza[0]?.concepto_poliza : conceptoPoliza);
        setConceptoMovimiento(conceptoMovimiento === undefined ? poliza[0]?.concepto_movimiento : conceptoMovimiento);
        setFolio(folio === undefined ? poliza[0]?.folio : folio);
        setTipoCambio(tipoCambio === undefined ? poliza[0]?.tipo_cambio : tipoCambio);
    }, [poliza]);

    function getDatos() {
        const fetchData = async () => {
            try {
                setEmpresa(empresa === undefined ? poliza[0]?.id_empresa : empresa);
                setFInicio(fInicio === undefined ? poliza[0]?.finicio : fInicio);
                setFFin(fFin === undefined ? poliza[0]?.ffin : fFin);
                setConceptoPoliza(conceptoPoliza === undefined ? poliza[0]?.concepto_poliza : conceptoPoliza);
                setConceptoMovimiento(conceptoMovimiento === undefined ? poliza[0]?.concepto_movimiento : conceptoMovimiento);
                setFolio(folio === undefined ? poliza[0]?.folio : folio);
                setTipoCambio(tipoCambio === undefined ? poliza[0]?.tipo_cambio : tipoCambio);
                const response = await fetch(
                    `/api/dashboard/contabilidad/updatePoliza?&fInicio=${fInicio}&fFin=${fFin}&id=${
                        poliza[0]?.id_poliza
                    }&concepto_poliza=${conceptoPoliza}&concepto_movimiento=${conceptoMovimiento}&tipo_cambio=${tipoCambio}&folio=${folio}${
                        empresa !== undefined ? `&id_empresa=${empresa}` : ""
                    }`
                );
                if (!response.ok) {
                    toast.toast({
                        title: "ERROR",
                        description: "Algo sucedio y la poliza no se pudo actualizar, intentalo de nuevo.",
                        variant: "destructive",
                        duration: 1600,
                    });
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                // seleccionaResultados(data);
                toast.toast({
                    title: `ORDEN EJECUTADA`,
                    description: `Poliza ${poliza[0]?.concepto_poliza} de ${poliza[0]?.id_empresa} actualizada exitosamente.`,
                    variant: "destructive",
                    duration: 1600,
                });
                // console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Fecha Inicio (dd/mm/aaaa)
                    </Label>
                    <Input
                        id="fInicio"
                        placeholder={poliza[0]?.finicio}
                        value={fInicio}
                        className="col-span-5"
                        onChange={(event) => setFInicio(event.target.value)}
                    />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Fecha Fin (dd/mm/aaaa)
                    </Label>
                    <Input
                        id="fFin"
                        placeholder={poliza[0]?.ffin}
                        value={fFin}
                        className="col-span-5"
                        onChange={(event) => setFFin(event.target.value)}
                    />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Concepto Poliza
                    </Label>
                    <Input
                        id="Poliza"
                        placeholder={poliza[0]?.concepto_poliza}
                        value={conceptoPoliza}
                        className="col-span-5"
                        onChange={(event) => setConceptoPoliza(event.target.value)}
                    />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Concepto Movimiento
                    </Label>
                    <Input
                        id="name"
                        value={conceptoMovimiento}
                        placeholder={poliza[0]?.concepto_movimiento}
                        className="col-span-5"
                        onChange={(event) => setConceptoMovimiento(event.target.value)}
                    />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Empresa
                    </Label>
                    <div className="md:col-span-5 lg:col-span-5 xl:col-span-5">
                        <Select onValueChange={setEmpresa} defaultValue={empresa} value={empresa}>
                            <SelectTrigger id="status" aria-label="Selecciona Empresa">
                                <SelectValue placeholder="Selecciona Empresa" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* <SelectItem value={poliza[0]?.id_empresa} id="0"></SelectItem> */}
                                {listaEmpresas.map((empresa) => (
                                    <SelectItem
                                        key={empresa.id_empresa}
                                        value={empresa.id_empresa}
                                        {...(empresa.id_empresa === poliza[0]?.id_empresa && { selected: true })}
                                    >
                                        {empresa.razon_social}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Tipo Cambio
                    </Label>
                    <Input
                        id="tipo_cambio"
                        placeholder={poliza[0]?.tipo_cambio}
                        value={tipoCambio}
                        className="col-span-5"
                        onChange={(event) => setTipoCambio(event.target.value)}
                    />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="folio" className="text-right">
                        Folio
                    </Label>
                    <Input
                        id="name"
                        placeholder={poliza[0]?.folio}
                        value={folio}
                        className="col-span-5"
                        onChange={(event) => setFolio(event.target.value)}
                    />
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <Button className="p-6" onClick={getDatos}>
                GUARDAR
            </Button>
        </>
    );
}
