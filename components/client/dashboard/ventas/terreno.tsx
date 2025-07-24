"use client";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useVentaStore } from "@/app/store/dashboard/ventas/prospecto";
// import { useEstadoDeCuentaFiltrosConsultaStore } from "@/app/store/dashboard/reportes/estadoDeCuenta/filtrosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { Presupuesto } from "./presupuesto";
import { Button } from "@/components/ui/button";
import { fr } from "date-fns/locale";
import moment, { duration } from "moment";
import { useToast, toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface Fraccionamiento {
    id_fraccionamiento: string;
    fraccionamiento: string;
}

interface MedioPublicitario {
    id_medio: string;
    medio: string;
}
interface Financiamiento {
    id_financiamiento: string;
    financiamiento: string;
    bnd_ajuste_anual: string;
    porcentaje_ajuste_anual: string;
    bnd_activo: string;
    no_pagos: string;
    porcentaje: string;
    bnd_cotizador: string;
}
interface TipoVenta {
    id_estatus: string;
    estatus: string;
}
interface TipoCambio {
    tipo_cambio: string;
}
interface ProspectoProps {
    idCliente: string;
    listaFraccionamientos: Fraccionamiento[];
    listaFinanciamientos: Financiamiento[];
    listaMediosPublicitarios: MedioPublicitario[];
    listaTipoVenta: TipoVenta[];
    editarNumeroPagos: boolean;
    tipoCambio: TipoCambio[];
    idUsuario: string;
    perfilUsuario: string;
}

interface Manzana {
    id_manzana: string;
    no_manzana: string;
}
interface Terreno {
    id_terreno: string;
    no_terreno: string;
    total_terreno: string;
}

function generarFechas(): string[] {
    const hoy = moment();
    const dia = hoy.date();
    const mes = hoy.month() + 1; // Los meses en Moment.js también empiezan desde 0
    // const anio = hoy.year();

    const fechas: string[] = [];

    if (dia >= 1 && dia <= 8) {
        fechas.push(hoy.clone().date(1).format("DD/MM/YYYY"));
        fechas.push(hoy.clone().date(15).format("DD/MM/YYYY"));
        fechas.push(hoy.clone().month(mes).date(1).format("DD/MM/YYYY"));
    } else if (dia >= 9 && dia <= 22) {
        fechas.push(hoy.clone().date(15).format("DD/MM/YYYY"));
        fechas.push(hoy.clone().month(mes).date(1).format("DD/MM/YYYY"));
        fechas.push(hoy.clone().month(mes).date(15).format("DD/MM/YYYY"));
    } else if (dia >= 23 && dia <= 31) {
        fechas.push(hoy.clone().month(mes).date(1).format("DD/MM/YYYY"));
        fechas.push(hoy.clone().month(mes).date(15).format("DD/MM/YYYY"));
    }

    return fechas;
}

export default function TerrenoProspecto({
    idCliente,
    listaFraccionamientos,
    listaFinanciamientos,
    listaMediosPublicitarios,
    listaTipoVenta,
    editarNumeroPagos,
    tipoCambio,
    idUsuario,
    perfilUsuario,
}: ProspectoProps) {
    const { prospecto, setProspecto } = useVentaStore();
    const [fraccionamiento, setFraccionamiento] = useState<string>("0");
    const [manzana, setManzana] = useState<string>("0");
    const [terreno, setTerreno] = useState<string>("0");
    const [manzanas, setManzanas] = useState<Manzana[]>([]);
    const [terrenos, setTerrenos] = useState<Terreno[]>([]);
    const [monto, setMonto] = useState<string>("0");
    const [financiamiento, setFinanciamiento] = useState<string>("0");
    const [costoFinanciero, setCostoFinanciero] = useState<string>("0");
    const [medioPublicitario, setMedioPublicitario] = useState<string>("");
    const [tipoVenta, setTipoVenta] = useState<string>("0");
    const [numeroPagos, setNumeroPagos] = useState<string>("0");
    const [pagoInicial, setPagoInicial] = useState<string>("0");
    const [fechas, setFechas] = useState<string[]>(generarFechas);
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [mensualidad, setMensualidad] = useState<string>("");
    const [tasaInteresDiario, setTasaInteresDiario] = useState<string>("0.20");
    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<string>("0");
    const [descuentoDinero, setDescuentoDinero] = useState<string>("0");
    const [moneda, setMoneda] = useState<string>("0");
    const [descuento, setDescuento] = useState<Number>(0);
    const { toast } = useToast();
    const router = useRouter();
    const admin = perfilUsuario === "1" ? "visible" : "hidden";

    function calculaMonto() {
        let total = 0;
        const montoInicial = terrenos.find((montoTerreno) => montoTerreno.id_terreno === terreno)?.total_terreno;
        setMonto(montoInicial ? montoInicial : "0");
        const cf = Number(Number(montoInicial) * Number(costoFinanciero)) / 100;
        total = Number(montoInicial) + cf;

        if (moneda == "1") {
            total = Number(total) / Number(tipoCambio[0].tipo_cambio);
            total -= Number(descuentoDinero);
            setMonto(total.toFixed(2).toString());
        } else {
            total -= Number(descuentoDinero);
            setMonto(total.toFixed(2).toString());
        }
        calculaMensualidad();
    }

    function calculaMensualidad() {
        //let subtotal = 0;
        const m = Number(monto);
        const pI = Number(pagoInicial);
        const numPagos = Number(numeroPagos != "" ? Number(numeroPagos) : 1);
        //subtotal = (m-pI)/numPagos;
        setMensualidad(Number((m - pI) / numPagos).toFixed(2));
        // console.log("Mensualidad: " + mensualidad);
    }

    useEffect(() => {
        setManzanas([]);
        setManzana("0");
        setTerrenos([]);
        setTerreno("0");
        const getManzanas = async () => {
            try {
                const response = await fetch(`/api/dashboard/ventas/prospecto/manzanasLibres?idFraccionamiento=${fraccionamiento}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setManzanas(data);
            } catch (error) {
                console.error(error);
            }
        };
        getManzanas();
        setTerrenos([]);
    }, [fraccionamiento]); // Update  whenever filters changes

    useEffect(() => {
        setTerrenos([]);
        setTerreno("0");
        const getTerrenos = async () => {
            try {
                const response = await fetch(`/api/dashboard/ventas/prospecto/terrenosLibres?idManzana=${manzana}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setTerrenos(data);
            } catch (error) {
                console.error(error);
            }
        };
        getTerrenos();
    }, [manzana]); // Update  whenever filters changes

    useEffect(() => {
        const perce = listaFinanciamientos.find((financia) => financia.id_financiamiento === financiamiento)?.porcentaje;
        const nopagos = listaFinanciamientos.find((pagos) => pagos.id_financiamiento === financiamiento)?.no_pagos;
        const porcentaje = perce ? perce : "0";
        setCostoFinanciero(porcentaje);
        setNumeroPagos(nopagos ? nopagos : "0");
    }, [financiamiento]);

    useEffect(() => {
        calculaMonto();
    }, [terreno, financiamiento, numeroPagos, pagoInicial, moneda, monto]);

    useEffect(() => {
        calculaMonto();
    }, [descuentoPorcentaje]);

    useEffect(() => {
        calculaMonto();
    }, [descuentoDinero]);
    useEffect(() => {
        calculaMonto();
    }, [costoFinanciero]);
    useEffect(() => {
        calculaMonto();
    }, [descuento]);
    useEffect(() => {
        setDescuento(0);
        setDescuentoDinero("0");
        setDescuentoPorcentaje("0");
    }, [financiamiento, moneda]);

    function getDatos() {
        // const fInicio=moment(fechaInicio,'DD/MM/YYYY').format('YYYY-MM-DD');
        const data = {
            id_cliente: idCliente,
            id_usuario: idUsuario,
            pagoInicial: pagoInicial,
            descuentoDinero: descuentoDinero,
            moneda: moneda,
            fraccionamiento: fraccionamiento,
            manzana: manzana,
            terreno: terreno,
            numeroPagos: numeroPagos,
            mensualidad: mensualidad,
            tasaInteresDiario: tasaInteresDiario,
            descuentoPorcentaje: descuentoPorcentaje,
            tipoVenta: tipoVenta == "0" ? null : tipoVenta,
            fechaInicio: moment(fechaInicio, "DD/MM/YYYY").format("YYYY-MM-DD"),
            medioPublicitario: medioPublicitario,
            monto: monto,
            financiamiento: financiamiento,
            costoFinanciero: costoFinanciero,
        };
        console.log("fechaInicio: " + data.fechaInicio);
        const crearContrato = async () => {
            try {
                // const response = await fetch(`/`, {
                const response = await fetch(`/api/dashboard/ventas/prospecto/creaContrato`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    toast({
                        // Llama a la función toast
                        title: "Error",
                        description: "Por favor, comprueba los datos, el contrato no puede ser generado",
                        duration: 1500,
                        variant: "destructive",
                    });
                    const errorData = await response.json(); // Intenta obtener detalles del error
                    throw new Error(`${response.status} ${response.statusText}: ${errorData.message || "Error en la solicitud"}`);
                    // throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const result = await response.json();
                if (result) {
                    //aqui va el toast
                    toast({
                        // Llama a la función toast
                        title: "Éxito",
                        description: "Contrato generado correctamente",
                        duration: 2500,
                        variant: "default",
                        style: {
                            background: "#25D366",
                            color: "#fff",
                        },
                    });
                    console.log("IDCONTRATO: " + result);
                    router.push(`/private/dashboard/ventas/altaSeguimiento/${idCliente}/${result}`);
                    // redirect(`/private/dashboard/ventas/alta/${result}`);
                } else {
                    toast({
                        // Llama a la función toast
                        title: "Error",
                        description: "Por favor, comprueba los datos, el contrato no puede ser generado",
                        variant: "destructive",
                    });
                }
                // console.log("ESTO PASO: " + result);
            } catch (error) {
                console.error(error);
            }
        };
        crearContrato();
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 text-center my-3">DATOS DEL CLIENTE</div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="status">Fraccionamiento</Label>
                    <Select onValueChange={setFraccionamiento} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona el fraccionamiento">
                            <SelectValue placeholder="Selecciona el fraccionamiento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Selecciona el fraccionamiento
                            </SelectItem>
                            {listaFraccionamientos.map((fraccionamiento) => (
                                <SelectItem key={fraccionamiento.id_fraccionamiento} value={fraccionamiento.id_fraccionamiento}>
                                    {fraccionamiento.fraccionamiento}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Manzana</Label>
                    <Select onValueChange={setManzana} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona la manzana">
                            <SelectValue placeholder="Selecciona la manzana" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todas
                            </SelectItem>
                            {manzanas.map((manzana) => (
                                <SelectItem key={manzana.id_manzana} value={manzana.id_manzana}>
                                    {manzana.no_manzana}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="status">Terreno</Label>
                    <Select onValueChange={setTerreno} defaultValue="0">
                        <SelectTrigger id="status" aria-label="Selecciona el terreno">
                            <SelectValue placeholder="Selecciona el terreno" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Todos
                            </SelectItem>
                            {terrenos.map((terreno) => (
                                <SelectItem key={terreno.id_terreno} value={terreno.id_terreno}>
                                    {terreno.no_terreno}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="monto">Monto</Label>
                    <Input
                        id="monto"
                        value={new Intl.NumberFormat("es-MX", {
                            style: "decimal",
                            // currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(monto))}
                        placeholder={monto}
                        className="uppercase"
                        disabled
                        // onChange={(event) => setMonto(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="costoFinanciero">% costo financiero</Label>
                    <Input
                        id="costoFinanciero"
                        value={new Intl.NumberFormat("es-MX", {
                            style: "decimal",
                            currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(costoFinanciero))}
                        placeholder={monto}
                        className="uppercase"
                        disabled
                        onChange={(event) => setCostoFinanciero(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="financiamiento">Financiamiento</Label>
                    <Select onValueChange={setFinanciamiento} defaultValue="0">
                        <SelectTrigger id="financiamiento" aria-label="Selecciona financiamiento">
                            <SelectValue placeholder="Selecciona financiamiento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Selecciona el fraccionamiento
                            </SelectItem>
                            {listaFinanciamientos.map((tipoFinanciamiento) => (
                                <SelectItem key={tipoFinanciamiento.id_financiamiento} value={tipoFinanciamiento.id_financiamiento}>
                                    {tipoFinanciamiento.financiamiento}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="medioPublicitario">Medio Publicitario</Label>
                    <Select onValueChange={setMedioPublicitario} defaultValue="0">
                        <SelectTrigger id="medioPublicitario">
                            <SelectValue placeholder="Selecciona el medio" />
                        </SelectTrigger>
                        <SelectContent>
                            {listaMediosPublicitarios.map((medio) => {
                                return (
                                    <SelectItem key={medio.id_medio} value={medio.id_medio}>
                                        {medio.medio}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className={`md:col-span-2 lg:col-span-2 xl:col-span-2 ${admin}`}>
                    <Label htmlFor="tipoVenta">Tipo de Venta</Label>
                    <Select onValueChange={setTipoVenta} defaultValue="0">
                        <SelectTrigger id="tipoVenta">
                            <SelectValue placeholder="Selecciona el tipo de venta" />
                        </SelectTrigger>
                        <SelectContent>
                            {listaTipoVenta.map((tipo) => {
                                return (
                                    <SelectItem key={tipo.id_estatus} value={tipo.id_estatus}>
                                        {tipo.estatus}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="noPagos">No. Pagos</Label>
                    <Input
                        id="noPagos"
                        value={new Intl.NumberFormat("es-MX", {
                            style: "decimal",
                            // currency: "MXN",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(Number(numeroPagos))}
                        placeholder={monto}
                        className="uppercase"
                        disabled={!editarNumeroPagos}
                        onChange={(event) => setNumeroPagos(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="pagoInicial">Pago Inicial</Label>
                    <Input
                        id="pagoInicial"
                        placeholder={pagoInicial}
                        onChange={(event) => setPagoInicial(event.target.value)}
                        onBlur={(event) =>
                            (event.target.value = new Intl.NumberFormat("es-MX", {
                                style: "decimal",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            }).format(Number(event.target.value)))
                        }
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                    <Select onValueChange={setFechaInicio} defaultValue={fechas[0]} value={fechaInicio}>
                        <SelectTrigger id="fechaInicio">
                            <SelectValue placeholder="Selecciona fecha inicio" />
                        </SelectTrigger>
                        <SelectContent>
                            {fechas.map((fecha) => {
                                return (
                                    <SelectItem key={fecha} value={fecha}>
                                        {fecha}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="mensualidad">Mensualidad</Label>
                    <Input
                        id="mensualidad"
                        value={new Intl.NumberFormat("es-MX", {
                            style: "decimal",
                            // currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(mensualidad))}
                        placeholder={mensualidad}
                        className="uppercase"
                        disabled
                        // onChange={(event) => setMensualidad(event.target.value)}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="interesDiario">Interes diario</Label>
                    <Input
                        id="interesDiario"
                        value={new Intl.NumberFormat("es-MX", {
                            style: "decimal",
                            // currency: "MXN",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(Number(tasaInteresDiario))}
                        placeholder={tasaInteresDiario}
                        className="uppercase"
                        disabled
                        // onChange={(event) => setMensualidad(event.target.value)}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="descuentoPorcentaje">% Descuento</Label>
                    <Input
                        id="descuentoPorcentaje"
                        placeholder={descuentoPorcentaje}
                        value={descuentoPorcentaje}
                        onChange={(event) => setDescuentoPorcentaje(event.target.value)}
                        onBlur={(event) => {
                            event.target.value = new Intl.NumberFormat("es-MX", {
                                style: "decimal",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            }).format(Number(event.target.value));

                            const d = (Number(monto) * Number(descuentoPorcentaje)) / 100;
                            const m = Number(monto) - (Number(monto) * Number(descuentoPorcentaje)) / 100;
                            setDescuentoDinero(d.toString());
                            // setDescuento(Number(descuentoDinero));
                        }}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="descuentoDinero">$ Descuento</Label>
                    <Input
                        id="descuentoDinero"
                        placeholder={descuentoDinero}
                        value={descuentoDinero}
                        onChange={(event) => setDescuentoDinero(event.target.value)}
                        onBlur={(event) => {
                            event.target.value = new Intl.NumberFormat("es-MX", {
                                style: "decimal",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            }).format(Number(event.target.value));

                            const d = Number(monto) - Number(descuentoDinero);
                            const p = Number(Number(descuentoDinero) * 100) / Number(monto);
                            const m = Number(monto) - Number(descuentoDinero);
                            setDescuentoPorcentaje(p.toString());
                            // setDescuento(Number(descuentoDinero));
                        }}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="moneda">Moneda</Label>
                    <Select onValueChange={setMoneda} defaultValue="0" value={moneda}>
                        <SelectTrigger id="fechaInicio">
                            <SelectValue placeholder="Selecciona fecha inicio" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" id="0">
                                Pesos
                            </SelectItem>
                            <SelectItem value="1" id="1">
                                Dólares
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Presupuesto
                        idU={idUsuario}
                        ab={prospecto?.abreviatura ?? ""}
                        nombre={prospecto?.nombre ?? ""}
                        aP={prospecto?.ap_paterno ?? ""}
                        aM={prospecto?.ap_materno ?? ""}
                        email={prospecto?.email ?? ""}
                        idFraccionamiento={fraccionamiento}
                        manzana={manzana}
                        idTerreno={terreno}
                        precio={monto}
                        numPagos={numeroPagos}
                        mensualidad={mensualidad}
                        pinicial={pagoInicial}
                        idFinanciamiento={financiamiento}
                        fechaInicial={fechaInicio}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Button className="p-6" onClick={getDatos}>
                        VENTA
                    </Button>
                </div>
            </div>
        </>
    );
}
