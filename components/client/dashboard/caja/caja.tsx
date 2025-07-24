"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UltimoMensajeCobranza from "@/components/client/dashboard/caja/ultimoMensajeCobranza";
import UltimoMensajeCaja from "@/components/client/dashboard/caja/ultimoMensajeCaja";
import { use, useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader, TableCaption } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, intlFormat } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import flashy from "@pablotheblink/flashyjs";
import moment from "moment";
import { forEach, set } from "lodash";
import { Textarea } from "@/components/ui/textarea";
import { BtnVerComentariosCaja } from "./btnVerComentariosCaja";
import { BtnNuevoComentarioCaja } from "./btnNuevoComentarioCaja";
import Image from "next/image";
import { getDatos } from "@/lib/reportes/terrenosDisponibles/montosGenerales";
import { BtnMostrarRecibo } from "./mostrarRecibo";
import { BtnReciboPDF } from "./btnReciboPDF";

interface Cliente {
    id_cliente: number;
    abreviatura?: string;
    nombre: string;
    ap_paterno?: string;
    ap_materno?: string;
    fecha_nacimiento?: string;
    sexo?: string;
    lugar_nacimiento?: string;
    ocupacion?: string;
    calle?: string;
    numero?: string;
    entre?: string;
    ciudad?: string;
    cp?: number;
    colonia?: string;
    estado?: string;
    pais?: string;
    tel_casa?: string;
    tel_cel?: string;
    tel_trabajo?: string;
    email?: string;
    lugar_trabajo?: string;
    domicilio_trabajo?: string;
    conyuge?: string;
    estado_civil?: string;
    nacionalidad?: string;
    fecha_alta: string;
    tel_cod_casa?: string;
    tel_cod_cel?: string;
    tel_cod_trabajo?: string;
    id_usuario: number;
    bnd_activo: boolean;
    ultima_modificacion: string;
    id_estatus_prospecto: number;
    bnd_interesado_prospecto: boolean;
    id_medio_publicitario: number;
    tel_usa_cel: boolean;
    tel_usa_casa: boolean;
    tel_usa_oficina: boolean;
    notas?: string;
    fecha_correo: string;
    id_asesor_cobranza: number;
}
interface TRecibo {
    idRecibo: number;
    idContrato: number;
    data_recibo: r_TPago;
}
interface Tabla {
    id_pago: number;
    id_contrato: number;
    fecha_movimiento: string;
    monto_pago: number;
    interes: number;
    servicios: number;
    mensualidad: number;
}

interface servicio {
    nombre: string;
    monto?: number;
}

interface r_TablaUI {
    no_pago?: number;
    fecha_movimiento: string;
    pago_inicial?: number;
    intereses?: number;
    servicios?: servicio[];
    mensualidad?: number;
}

interface DatosCaja {
    id_contrato: number;
    tPagos: Tabla[];
    gVencido: number;
    gDInteres: number;
    gIntereses: number;
    gdMensualidad: number;
    gServicios: number;
    gMontoParaDescuento: number;
    gPagoInicial: number;
    gCompromisoPago: number;
    gTotalAbonar: number;
    gActual: number;
    indica_monto: boolean;
    indica_mensualidad: boolean;
    tPagosPdescuento: number;
    tMontoPdescuento: number;
}

interface tPago {
    [key: string]: any[];
}
interface r_TPago {
    id_contrato: number;
    id_cabecera: number;
    monto_cobrar: number;
    monto_total: number;
    terreno: string;
    manzana: string;
    fraccionamiento: string;
    moneda: string;
    dinteres: number;
    dmensualidad: number;
    justificacion_descuento: string;
    tipo_pago: number;
    referencia: string;
    pagoPesos: number;
    pagoDolares: number;
    pagoCheque: number;
    pago_inicial: number;
    tipo_movimiento?: number;
    monto?: number;
}
interface tPagoActual {
    id_movimiento_detalle: number;
    monto: number;
    monto_saldo: number;
    bnd_activo: boolean;
    id_tipo_movimiento: number;
    fecha_movimiento: string;
    tasa_interes_diario: number;
    bnd_pagado: boolean;
    id_contrato: number;
    no_pago: number | null;
    intereses: number;
    servicio: string | null;
    id_estatus_contrato: number;
}
interface r_Movimiento {
    id_movimiento_detalle: number;
    monto: number;
    monto_saldo: number;
    bnd_activo: boolean;
    id_tipo_movimiento: number;
    fecha_movimiento: string;
    tasa_interes_diario: number;
    bnd_pagado: boolean;
    id_contrato: number;
    no_pago: number | null;
    intereses: number;
    servicio: string | null;
    id_estatus_contrato: number;
}
interface Usuario {
    email?: string | null;
    perfil_usuario?: string;
    nombre?: string;
    id_usuario?: string;
}
interface Contrato {
    id_cliente: number;
    id_contrato: number;
    terreno: string;
    id_terreno: number;
    id_estatus_contrato: number;
}

interface DatosContratoSeleccionado {
    saldo: string;
    fecha_contrato: string;
    mensualidades: number;
    financiamiento: string;
    precio_original: string;
    estatus: string;
    ajuste_anual: string;
    asesor_venta: string;
    asesor_cobranza?: string;
    contrato_entregado: boolean;
    bnd_bloqueo_caja: boolean;
    bnd_descuentos: boolean;
    id_movimiento_cabecera: number;
    moneda: number;
    no_terreno: string;
    no_manzana: string;
    fraccionamiento: string;
}

interface ListadoContratosProps {
    ContratosLista: Contrato[];
    DatosUsuario: Usuario;
    Cliente: Cliente;
}

let columnTotals: number[] = [];
export default function Caja({ ContratosLista, DatosUsuario, Cliente }: ListadoContratosProps) {
    // const [columnTotals, setColumnTotals] = useState<number[]>([]);
    const [contrato, setContrato] = useState<number | null>(ContratosLista[0]?.id_contrato ?? null);
    const [diasGracia, setDiasGracia] = useState<number>(9);
    const [datosContrato, setDatosContrato] = useState<DatosContratoSeleccionado | null>(null);
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [fecha, setFecha] = useState<string>(format(new Date(), "yyyy-MM-dd", { locale: es }));
    const [txtMensualidades, setTxtMensualidades] = useState<string>("0");
    const [txtMontoPesos, setTxtMontoPesos] = useState<string>("");
    const [txtMontoDolares, setTxtMontoDolares] = useState<string>("");
    const [txtMontoCheque, setTxtMontoCheque] = useState<string>("");
    const [txtMontoAbonar, setTxtMontoAbonar] = useState<string>("");
    const [txtMontoRecibido, setTxtMontoRecibido] = useState<string>("");
    const [formaPago, setFormaPago] = useState<string>("1");
    const [txtRefrerencia, setTxtRefrerencia] = useState<string>("");
    const [tipoBusqueda, setTipoBusqueda] = useState<string>("default");
    const [tPagos, setTPagos] = useState<r_TPago[]>([]);
    const [gMoneda, setGMoneda] = useState<string>("");
    const [gid_contrato, setGid_contrato] = useState<string>("");
    const [btnPagarPressed, setBtnPagarPressed] = useState<boolean>(false);
    const [serviciosFraccionamiento, setServiciosFraccionamiento] = useState<string[]>([]);
    const [gVencido, setGVencido] = useState<number>(0);
    const [gDInteres, setGDInteres] = useState<number>(0);
    const [gintereses, setGIntereses] = useState<number>(0);
    const [gdMensualidad, setGDMensualidad] = useState<number>(0);
    const [gServicios, setGServicios] = useState<number>(0);
    const [gMontoParaDescuento, setGMontoParaDescuento] = useState<number>(0);
    const [gPagoInicial, setGPagoInicial] = useState<number>(0);
    const [gCompromisoPago, setGCompromisoPago] = useState<number>(0);
    const [gTotalAbonar, setGTotalAbonar] = useState<number>(0);
    const [gActual, setGActual] = useState<number>(0);
    const [indicaMonto, setIndicaMonto] = useState<boolean>(false);
    const [indicaMensualidad, setIndicaMensualidad] = useState<boolean>(false);
    const [tPagosPdescuento, setTPagosPdescuento] = useState<number>(0);
    const [tMontoPdescuento, setTMontoPdescuento] = useState<number>(0);
    const [gIdCabecera, setGIdCabecera] = useState<number>(0);
    const [justificacionDescuento, setJustificacionDescuento] = useState<string>("");
    const [justificacionNota, setJustificacionNota] = useState<string>("");
    const [gbloqueo, setGbloqueo] = useState<boolean>(false);

    const [tPagosActual, setTPagosActual] = useState<r_Movimiento[]>([]);
    const [tRecibos, setTRecibos] = useState<TRecibo[]>([]);
    const [tPagosFinal, setTPagosFinal] = useState<tPagoActual[]>([]);
    const [soloServicios, setSoloServicios] = useState<boolean>(false);
    const [tablaDesgloce, setTablaDesgloce] = useState<tPago[]>([]);
    const [precioDolar, setPrecioDolar] = useState<number>(18.5);
    const [lblTipoCambio, setLblTipoCambio] = useState<string>(precioDolar.toString());
    const [tArray, setTArray] = useState<any[][]>([]);
    const [lblMontoCambio, setLblMontoCambio] = useState<string>("0");
    const [lblMontoFaltante, setLblMontoFaltante] = useState<string>("0");
    const [nuevoCambio, setNuevoCambio] = useState<number>(0);
    const [descMensualidad, setDescMensualidad] = useState<number>(0);
    const [descInteres, setDescInteres] = useState<number>(0);
    const [descMensualidadCalculado, setDescMensualidadCalculado] = useState<string>("");
    const [descInteresCalculado, setDescInteresCalculado] = useState<string>("");
    const [mensualidadAnterior, setMensualidadAnterior] = useState<string>("");
    const [mensualidadActual, setMensualidadActual] = useState<string>("");
    const [porcentajeAnual, setPorcentajeAnual] = useState<string>("");

    const handleEntregaContrato = (checked: boolean) => {
        if (datosContrato) {
            setDatosContrato((prevState) => ({ ...prevState!, contrato_entregado: checked }));
        }
    };
    const handleDescuentoMensualidadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = parseFloat(event.target.value);
        setDescMensualidad(newData);
    };
    const handleDescuentoMensualidad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = parseFloat(event.target.value);
        if (newData > 0) {
            setDescMensualidad(newData);
        } else {
            setDescMensualidad(0);
        }
        llenaDescuentos("otros");
        generaCambio();
        generaFaltante();
    };
    const handleDescuentoInteresChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = parseFloat(event.target.value).toFixed(2);
        setDescInteres(Number(newData));
    };
    const handleDescuentoInteres = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = parseFloat(event.target.value).toFixed(2);
        if (Number(newData) > 0) {
            setDescInteres(Number(newData));
        } else {
            setDescInteres(0);
        }
        llenaDescuentos("otros");
        generaCambio();
        generaFaltante();
    };

    const getDatosContrato = async () => {
        setDatosContrato(null);
        try {
            const response = await fetch(`/api/dashboard/caja/getDatosContrato?id_contrato=${contrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();

            if (data && Array.isArray(data) && data.length > 0) {
                setDatosContrato(data[0]);
                setDatosContrato(data[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const limpiarCajasTexto = () => {
        setTxtMensualidades("");
        setTxtMontoPesos("0");
        setTxtMontoDolares("0");
        setTxtMontoCheque("0");
        setTxtMontoAbonar("0");
        setTxtMontoRecibido("0");
        setTxtRefrerencia("");
        setJustificacionDescuento("");
        setJustificacionNota("");
    };
    const llenaCabecera = () => {
        setGMoneda(datosContrato?.moneda === 0 ? "PESOS" : "DOLARES");
        const idCabecera = datosContrato?.id_movimiento_cabecera ?? 0;
        setGIdCabecera(idCabecera);
        setGIdCabecera(gIdCabecera);
    };
    const llenaMensualidadesVencidas = async () => {
        if (soloServicios === true) {
            setGVencido(0);
            return;
        }
        try {
            const response = await fetch(`/api/dashboard/caja/getLlenaMensualidadesVencidas?idContrato=${contrato}&fecha=${fecha}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data) && data.length > 0) {
                const gvencido = Number(data[0].monto_vencido) ?? 0;
                setGVencido(gvencido + gVencido);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const llenaMensualidadActual = async () => {
        if (soloServicios === true) {
            setGActual(0);
            return;
        }
        try {
            const response = await fetch(`/api/dashboard/caja/llenaMensualidadActual?idContrato=${contrato}&fecha=${fecha}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data) && data.length > 0) {
                const gactual = Number(data[0].monto) ?? 0;
                setGActual(gActual + gactual);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const llenaIntereses = async () => {
        if (soloServicios === true) {
            setGIntereses(0);
            return;
        }
        try {
            const response = await fetch(
                `/api/dashboard/caja/llenaIntereses?idContrato=${contrato}&fecha=${fecha}&mensualidades=${txtMensualidades}`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                setGIntereses(Number(data) ?? 0);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const llenaServicios = async () => {
        try {
            const response = await fetch(`/api/dashboard/caja/llenaServicios?idContrato=${contrato}&fecha=${fecha}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                setGServicios(Number(data) ?? 0);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getDatosAjusteAnual = async () => {
        try {
            const response = await fetch(`/api/dashboard/caja/getDatosAjusteAnual?idContrato=${contrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                setMensualidadAnterior(data[0].mensualidad_anterior);
                setMensualidadActual(data[0].mensualidad_actual);

                setPorcentajeAnual(
                    ((parseFloat(data[0].mensualidad_actual) / parseFloat(data[0].mensualidad_anterior) - 1) * 100).toFixed(2)
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getServiciosDisponiblesFraccionamiento = async () => {
        setServiciosFraccionamiento([]);
        try {
            const response = await fetch(`/api/dashboard/caja/getServiciosDisponiblesFraccionamiento?idContrato=${contrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                const s = data.map((item: any) => {
                    switch (Number(item.id_servicio)) {
                        case 440:
                            return "biodigestor.png";
                        case 459:
                            return "luz.png";
                        case 460:
                            return "agua.png";
                        case 461:
                            return "drenaje.png";
                        case 462:
                            return "escriturado.png";
                    }
                });
                setServiciosFraccionamiento(s);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const llenaDatosTablaPagos = async () => {
        setTablaDesgloce([]);
        setTPagosActual([]);
        setTPagosFinal([]);
        setTArray([]);
        setLblMontoCambio("0");
        try {
            const response = await fetch(`/api/dashboard/caja/getTablaPagosActual?idContrato=${contrato}&fecha=${fecha}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data) && data.length > 0) {
                const parsedData = data.map((pago) => ({
                    ...pago,
                    monto: parseFloat(pago.monto as any),
                    monto_saldo: pago.monto_saldo !== null ? parseFloat(pago.monto_saldo as any) : null,
                    intereses: parseFloat(pago.intereses as any),
                }));
                setTPagosActual(parsedData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const llenaPagoInicial = async () => {
        setGPagoInicial(0);
        if (soloServicios === true) {
            setGPagoInicial(0);
            return;
        }
        try {
            const response = await fetch(`/api/dashboard/caja/getLlenaPagoInicial?idContrato=${contrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data) && data.length > 0) {
                if (Number(data[0].monto) > 0) {
                    setGPagoInicial(Number(data[0].monto));
                } else {
                    setGPagoInicial(0);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    const llenaTotalPagar = (tipo: string) => {
        try {
            const totalPago = Number(gTotalAbonar - gDInteres - gdMensualidad).toFixed(2);
            if (tipo !== "cantidad") {
                setTxtMontoAbonar(
                    Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(Number(totalPago))
                );
            }
        } catch (error) {
            flashy.error("Algo salió mal");
        }
    };
    const llenaTipoPago = () => {};

    const obtieneVendedores = async () => {};

    const getObtieneVendedores = async () => {};

    const getBloqueo = async () => {};

    const popCompromisoPago = async () => {
        try {
            const response = await fetch(`/api/dashboard/caja/compromisoPago?idContrato=${contrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data) && data.length > 0) {
                if (data[0].pagado === "PENDIENTE") {
                    const mCompromisoPago = new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(Number(data[0].monto));
                    const msg = `El terreno tiene un compromiso de pago, por lo que el mínimo a pagar debe ser de ${mCompromisoPago},
                    en caso de ser menos, pasarlo a cobranza.`;
                    setGCompromisoPago(Number(data[0].monto));
                    flashy.warning(msg, { position: "top-center", duration: 0 });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const validaDescuentos = async () => {
        if (datosContrato?.bnd_descuentos != true) {
        }
    };

    const generaTablaPagos = async (tipoBusqueda: string) => {
        let tPagos = new Array<r_Movimiento>();
        let tPagosPerServicios = new Array<r_Movimiento>();
        let tPagosNew: { [key: string]: any }[] = [];
        let tPagosNewColumns: string[] = ["no_pago", "fecha_movimiento"];

        const addColumn = (columnName: string) => {
            if (!tPagosNewColumns.includes(columnName)) {
                tPagosNewColumns.push(columnName);
                tPagosNew.forEach((row) => {
                    if (!(columnName in row)) {
                        row[columnName] = null;
                    }
                });
            }
        };
        const addRow = (rowData: { [key: string]: any }) => {
            const newRow: { [key: string]: any } = {};
            for (const key in rowData) {
                if (Object.prototype.hasOwnProperty.call(rowData, key)) {
                    newRow[key] = rowData[key];
                    addColumn(key);
                }
            }
            tPagosNewColumns.forEach((col) => {
                if (!(col in newRow)) {
                    newRow[col] = null;
                }
            });

            tPagosNew.push(newRow);
        };

        tPagosPerServicios = tPagosActual.filter(
            (pago) =>
                pago.id_contrato === contrato && pago.bnd_pagado === true && pago.id_tipo_movimiento === 2 && pago.id_estatus_contrato !== 5
        );
        forEach(tPagosPerServicios, (r) => {
            let f_inicio = moment(r.fecha_movimiento, "YYYY-MM-DD");
            f_inicio = f_inicio.startOf("month");
            const f_fin = f_inicio.clone().add(1, "months").subtract(1, "days");
            const rowFechaMovimiento = moment(r.fecha_movimiento, "YYYY-MM-DD");
            const rowServicios = tPagosActual.filter((row) => {
                const fechaMovimientoActual = moment(row.fecha_movimiento, "YYYY-MM-DD");
                return (
                    row.id_contrato === contrato &&
                    row.id_tipo_movimiento === 10 &&
                    (row.bnd_pagado === false || row.bnd_pagado === null || row.bnd_pagado === undefined) &&
                    row.bnd_activo === true &&
                    fechaMovimientoActual.isSameOrAfter(f_inicio, "day") &&
                    fechaMovimientoActual.isSameOrBefore(f_fin, "day")
                );
            });
            if (rowServicios.length > 0) {
                tPagos.push(r);
            }
        });

        let monto_total = 0;
        let bnd_indica_monto = false;

        if (tipoBusqueda === "default") {
            const estatus_contrato = Number(tPagosActual[0]?.id_estatus_contrato);
            if (estatus_contrato != 5) {
                const tmpAdelantados = tPagosActual.filter(
                    (pago) =>
                        pago.id_contrato === contrato &&
                        pago.bnd_activo === true &&
                        pago.bnd_pagado === false &&
                        moment(pago.fecha_movimiento, "YYYY-MM-DD") >= moment(fecha, "YYYY-MM-DD") &&
                        pago.id_tipo_movimiento === 2
                );

                if (tmpAdelantados.length > 0) {
                    if (
                        tPagosActual.some(
                            (pago) =>
                                pago.id_contrato === contrato &&
                                pago.bnd_activo === true &&
                                pago.bnd_pagado === false &&
                                pago.id_tipo_movimiento === 2
                        )
                    ) {
                        let tPagosTmp = tPagosActual.filter(
                            (pago) =>
                                pago.id_contrato === contrato &&
                                pago.bnd_activo === true &&
                                pago.bnd_pagado === false &&
                                pago.id_tipo_movimiento === 2
                        );
                        const fecha_default = moment(tPagosTmp[0].fecha_movimiento, "YYYY-MM-DD").add(2, "months");
                        let mensualidadesFuturas = tPagosTmp.filter((pago) => moment(pago.fecha_movimiento, "YYYY-MM-DD") <= fecha_default);
                        tPagos.push(...mensualidadesFuturas);
                    }
                }

                const tmpPagos = tPagosActual.filter(
                    (pago) =>
                        pago.id_contrato === contrato &&
                        pago.bnd_activo === true &&
                        pago.bnd_pagado === false &&
                        moment(pago.fecha_movimiento, "YYYY-MM-DD") <= moment(fecha, "YYYY-MM-DD")
                );
                if (tmpPagos.length > 0) {
                    tPagos.push(...tmpPagos);
                }
            } else {
                const tPagosTmp = tPagosActual.filter(
                    (pago) =>
                        pago.id_contrato === contrato &&
                        pago.bnd_activo === true &&
                        pago.bnd_pagado === false &&
                        moment(pago.fecha_movimiento, "YYYY-MM-DD") <= moment(fecha, "YYYY-MM-DD") &&
                        pago.id_tipo_movimiento === 10
                );
                tPagos = tPagosTmp;
            }
            tPagos.sort((a, b) => {
                if (a.no_pago === null && b.no_pago !== null) {
                    return 1;
                }
                if (b.no_pago === null && a.no_pago !== null) {
                    return -1;
                }
                if (a.no_pago === null && b.no_pago === null) {
                    return 0;
                }

                const valA = Number(a.no_pago);
                const valB = Number(b.no_pago);

                return valA - valB;
            });
        } else if (tipoBusqueda === "mensualidades") {
            const tmp = tPagosActual.filter(
                (pago) => pago.id_tipo_movimiento === 2 && pago.bnd_pagado === false && pago.id_contrato === contrato
            );

            const estatus_contrato = Number(tmp[0]?.id_estatus_contrato);

            if ((tmp.length > 0 || tPagos.length > 0) && estatus_contrato !== 5) {
                if (tPagos.length > 0) {
                    const tPagosTmp = tPagosActual.filter(
                        (pago) => pago.bnd_pagado === false && pago.id_contrato === contrato && pago.id_tipo_movimiento === 2
                    );
                    tPagos.push(...tPagosTmp);
                    tPagos.sort((a, b) => {
                        const valA = Number(a.no_pago) || 0;
                        const valB = Number(b.no_pago) || 0;
                        return valA - valB;
                    });
                } else {
                    const tPagosTmp = tPagosActual.filter(
                        (pago) => pago.bnd_pagado === false && pago.id_contrato === contrato && pago.id_tipo_movimiento === 2
                    );
                    tPagos.push(...tPagosTmp);
                }
                if (Number(txtMensualidades) > 0) {
                    tPagos = tPagos.slice(0, Number(txtMensualidades));
                }
            } else {
                if (tPagosActual.length > 0) {
                    if (Number(tPagosActual[0].id_estatus_contrato) === 5) {
                        let no_mensualidades = Number(txtMensualidades);
                        const tPagosTmp = tPagosActual.filter(
                            (pago) => pago.id_tipo_movimiento === 10 && pago.bnd_pagado === false && pago.id_contrato === contrato
                        );

                        if (tPagosTmp.length > 1) {
                            let fec_per = moment(tPagosTmp[0].fecha_movimiento, "YYYY-MM-DD").startOf("month");
                            no_mensualidades = Number(txtMensualidades);

                            for (let x = 1; x < tPagosTmp.length; x++) {
                                let fec_per_new = moment(tPagosTmp[x].fecha_movimiento, "YYYY-MM-DD").startOf("month");
                                if (!fec_per.isSame(fec_per_new, "month")) {
                                    no_mensualidades += 1;
                                    fec_per = fec_per_new;
                                }
                            }
                            tPagos = tPagosTmp.slice(0, no_mensualidades);
                        } else {
                            tPagos = tPagosTmp.slice(0, no_mensualidades);
                        }
                    }
                }
            }
        } else if (tipoBusqueda === "monto") {
            if (Number(tPagosActual[0].id_estatus_contrato) === 5) {
                const tPagosTmp = tPagosActual.filter(
                    (pago) => pago.id_tipo_movimiento === 10 && pago.bnd_pagado === false && pago.id_contrato === contrato
                );
                tPagos.push(...tPagosTmp);
            } else {
                const tPagosTmp = tPagosActual.filter(
                    (pago) => pago.id_tipo_movimiento === 2 && pago.bnd_pagado === false && pago.id_contrato === contrato
                );
                tPagos.push(...tPagosTmp);
            }
            monto_total = convierteANumero(txtMontoAbonar);
            bnd_indica_monto = true;
        }

        addColumn("no_pago");
        addColumn("fecha_movimiento");

        let pago_inicial = tPagosActual
            .filter((pago) => {
                return pago.id_tipo_movimiento === 1 && pago.bnd_pagado === false && pago.id_contrato === contrato;
            })
            .reduce((sum, pago) => sum + pago.monto_saldo, 0);

        let bnd_pago_inicial_ingresado = false;
        if (pago_inicial > 0) {
            addColumn("pago_inicial");
        }
        let intereses = tPagosActual
            .filter((pago) => {
                return pago.id_tipo_movimiento === 2 && pago.bnd_pagado === false && pago.id_contrato === contrato;
            })
            .reduce((sum, pago) => sum + pago.intereses, 0);
        if (intereses > 0) {
            addColumn("interes");
        }
        const rServicios = tPagosActual.filter(
            (pago) =>
                pago.id_tipo_movimiento === 10 &&
                pago.bnd_pagado === false &&
                pago.id_contrato === contrato &&
                moment(pago.fecha_movimiento, "YYYY-MM-DD").isSameOrBefore(moment(fecha, "YYYY-MM-DD"))
        );
        let bnd_existe_servicios = false;

        const serviciosUnicos = new Set();
        for (let r of rServicios) {
            let serviceName = r.servicio ? r.servicio : "";
            addColumn(serviceName);
            serviciosUnicos.add(r.servicio);
        }
        const arrServicios = Array.from(serviciosUnicos);
        if (arrServicios.length > 0) {
            bnd_existe_servicios = true;
        }

        let mensualidad = tPagosActual
            .filter((pago) => {
                return pago.id_tipo_movimiento === 2 && pago.bnd_pagado === false && pago.id_contrato === contrato;
            })
            .reduce((sum, pago) => sum + pago.monto_saldo, 0);
        if (mensualidad > 0) {
            addColumn("mensualidad");
        }

        let fecha_servicio = moment(new Date(), "YYYY-MM-DD");
        let bnd_primer_servicio = true;
        let primer_dia_mes = moment(fecha_servicio, "YYYY-MM-DD").startOf("month");
        let ultimo_dia_mes = primer_dia_mes.clone().add(1, "months").subtract(1, "days");
        let fecha_anterior = fecha_servicio;

        let periodo_inicial = primer_dia_mes;
        let periodo_final = ultimo_dia_mes;
        let no_mensualidades_reales: number = 0;
        let monto_para_descuento: number = 0;

        for (const r of tPagos) {
            const row: { [key: string]: any } = {};
            let bnd_new_row = false;
            let bnd_mensualidad = r.bnd_pagado === null ? false : r.bnd_pagado;

            if (pago_inicial > 0 && soloServicios !== true) {
                if (mensualidad > 0) {
                    if (r.id_tipo_movimiento === 2 && !bnd_pago_inicial_ingresado) {
                        if (bnd_indica_monto) {
                            if (monto_total <= pago_inicial) {
                                row["no_pago"] = r.no_pago;
                                row["fecha_movimiento"] = r.fecha_movimiento;
                                row["pago_inicial"] = monto_total;
                                bnd_pago_inicial_ingresado = true;
                                bnd_new_row = true;
                                monto_total = 0;
                            } else {
                                row["no_pago"] = r.no_pago;
                                row["fecha_movimiento"] = r.fecha_movimiento;
                                row["pago_inicial"] = pago_inicial;
                                bnd_pago_inicial_ingresado = true;
                                bnd_new_row = true;
                                monto_total = monto_total - pago_inicial;
                            }
                        } else {
                            row["no_pago"] = r.no_pago;
                            row["fecha_movimiento"] = r.fecha_movimiento;
                            row["pago_inicial"] = pago_inicial;
                            bnd_pago_inicial_ingresado = true;
                            bnd_new_row = true;
                        }
                    } else {
                        row["pago_inicial"] = 0;
                    }
                }
            }

            let bnd_intereses = r.bnd_pagado === null ? false : r.bnd_pagado;
            if (intereses > 0 && soloServicios !== true) {
                if (r.id_tipo_movimiento === 2 && !bnd_intereses) {
                    if (bnd_indica_monto) {
                        if (monto_total <= r.intereses) {
                            row["interes"] = monto_total;
                            bnd_new_row = true;
                            monto_total = 0;
                        } else {
                            row["interes"] = r.intereses;
                            bnd_new_row = true;
                            monto_total = monto_total - r.intereses;
                        }
                    } else {
                        row["interes"] = r.intereses;
                        bnd_new_row = true;
                    }
                }
            }
            let r_servicios = 0;
            if (bnd_existe_servicios) {
                if (r.id_tipo_movimiento === 2) {
                    fecha_servicio = moment(r.fecha_movimiento, "YYYY-MM-DD");
                    primer_dia_mes = moment(fecha_servicio, "YYYY-MM-DD").startOf("month");
                    ultimo_dia_mes = primer_dia_mes.clone().add(1, "months").subtract(1, "days");

                    periodo_inicial = primer_dia_mes;
                    periodo_final = ultimo_dia_mes;

                    const rowServicios = tPagosActual.filter((pago) => {
                        return (
                            pago.id_tipo_movimiento === 10 &&
                            pago.bnd_pagado === false &&
                            pago.id_contrato === contrato &&
                            moment(pago.fecha_movimiento).isSameOrAfter(periodo_inicial) &&
                            moment(pago.fecha_movimiento).isSameOrBefore(periodo_final)
                        );
                    });

                    r_servicios = tPagosActual
                        .filter((pago) => {
                            return (
                                pago.id_tipo_movimiento === 10 &&
                                pago.bnd_pagado === false &&
                                pago.id_contrato === contrato &&
                                moment(pago.fecha_movimiento).isSameOrAfter(periodo_inicial) &&
                                moment(pago.fecha_movimiento).isSameOrBefore(periodo_final)
                            );
                        })
                        .reduce((sum, pago) => {
                            const monto = pago.monto_saldo !== null && pago.monto_saldo !== undefined ? pago.monto_saldo : 0;
                            return sum + monto;
                        }, 0);

                    if (row["no_pago"] === null || row["no_pago"] === undefined) {
                        row["no_pago"] = r.no_pago;
                        row["fecha_movimiento"] = r.fecha_movimiento;
                    }
                    for (const rservicios of rowServicios) {
                        if (arrServicios.includes(rservicios.servicio) && r_servicios > 0) {
                            if (bnd_indica_monto) {
                                if (monto_total <= rservicios.monto_saldo) {
                                    const index = arrServicios.indexOf(rservicios.servicio);
                                    const nombre_columna: any = arrServicios[index];
                                    row[nombre_columna] = monto_total;
                                    bnd_new_row = true;
                                    monto_total = 0;
                                } else {
                                    const index = arrServicios.indexOf(rservicios.servicio);
                                    const nombre_columna: any = arrServicios[index];
                                    row[nombre_columna] = rservicios.monto_saldo;
                                    bnd_new_row = true;
                                    monto_total = monto_total - rservicios.monto_saldo;
                                }
                            } else {
                                const index = arrServicios.indexOf(rservicios.servicio);
                                const nombre_columna: any = arrServicios[index];
                                row[nombre_columna] = rservicios.monto_saldo;
                                bnd_new_row = true;
                            }
                        }
                    }
                } else if (Number(r.id_estatus_contrato) === 5) {
                    if (Number(r.id_tipo_movimiento) === 10) {
                        fecha_servicio = moment(r.fecha_movimiento, "YYYY-MM-DD");

                        primer_dia_mes = moment(fecha_servicio, "YYYY-MM-DD").startOf("month");
                        ultimo_dia_mes = moment(primer_dia_mes, "YYYY-MM-DD").add(1, "months").subtract(1, "days");

                        periodo_inicial = primer_dia_mes;
                        periodo_final = ultimo_dia_mes;

                        const rowServicios = tPagosActual.filter(
                            (pago) =>
                                pago.id_tipo_movimiento === 10 &&
                                pago.bnd_pagado === false &&
                                pago.id_contrato === contrato &&
                                moment(pago.fecha_movimiento).isSameOrAfter(periodo_inicial) &&
                                moment(pago.fecha_movimiento).isSameOrBefore(periodo_final)
                        );

                        if (bnd_primer_servicio || primer_dia_mes !== fecha_anterior) {
                            bnd_primer_servicio = false;
                            if (fecha_anterior !== primer_dia_mes) {
                                fecha_anterior = primer_dia_mes;
                            }
                            row["no_pago"] = "N/A";
                            row["fecha_movimiento"] = primer_dia_mes.format("DD/MM/YYYY");
                            for (const rservicios of rowServicios) {
                                if (arrServicios.includes(rservicios.servicio)) {
                                    if (bnd_indica_monto) {
                                        if (monto_total <= rservicios.monto_saldo) {
                                            const index = arrServicios.indexOf(rservicios.servicio);
                                            const nombre_columna: any = arrServicios[index];
                                            row[nombre_columna] = monto_total;
                                            bnd_new_row = true;
                                            monto_total = 0;
                                        } else {
                                            const index = arrServicios.indexOf(rservicios.servicio);
                                            const nombre_columna: any = arrServicios[index];
                                            row[nombre_columna] = rservicios.monto_saldo;
                                            bnd_new_row = true;
                                            monto_total = monto_total - rservicios.monto_saldo;
                                        }
                                    } else {
                                        const index = arrServicios.indexOf(rservicios.servicio);
                                        const nombre_columna: any = arrServicios[index];
                                        row[nombre_columna] = rservicios.monto_saldo;
                                        bnd_new_row = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (mensualidad > 0 && soloServicios !== true) {
                let fecha_pago = moment(fecha, "YYYY-MM-DD");
                if (r.id_tipo_movimiento === 2 && !bnd_mensualidad) {
                    if (bnd_indica_monto) {
                        no_mensualidades_reales++;

                        if (monto_total <= r.monto_saldo) {
                            row["no_pago"] = r.no_pago;
                            row["fecha_movimiento"] = moment(r.fecha_movimiento, "YYYY-MM-DD").format("DD/MM/YYYY");
                            row["mensualidad"] = monto_total;
                            bnd_new_row = true;
                            const f_movimiento = moment(r.fecha_movimiento, "YYYY-MM-DD");
                            const diferencia_dias = f_movimiento.diff(fecha_pago, "days");
                            if (r.monto_saldo === r.monto && monto_total >= r.monto_saldo && diferencia_dias >= 30) {
                                monto_para_descuento += monto_total;
                            }
                            monto_total = 0;
                        } else {
                            row["no_pago"] = r.no_pago;
                            row["fecha_movimiento"] = moment(r.fecha_movimiento, "YYYY-MM-DD").format("DD/MM/YYYY");
                            row["mensualidad"] = r.monto_saldo;
                            bnd_new_row = true;
                            const f_movimiento = moment(r.fecha_movimiento, "YYYY-MM-DD");
                            const diferencia_dias = f_movimiento.diff(fecha_pago, "days");
                            if (r.monto_saldo === r.monto && monto_total >= r.monto_saldo && diferencia_dias >= 30) {
                                monto_para_descuento += r.monto_saldo;
                            }
                            monto_total = Number(monto_total.toFixed(2)) - Number(r.monto_saldo.toFixed(2));
                        }
                    } else {
                        row["no_pago"] = r.no_pago;
                        const f_movimiento = moment(r.fecha_movimiento, "YYYY-MM-DD");
                        row["fecha_movimiento"] = moment(f_movimiento, "YYYY-MM-DD").format("DD/MM/YYYY");
                        row["mensualidad"] = r.monto_saldo;
                        bnd_new_row = true;
                        no_mensualidades_reales++;
                        const diferencia_dias = f_movimiento.diff(fecha_pago, "days");
                        if (r.monto_saldo === r.monto && diferencia_dias >= 30) {
                            monto_para_descuento += r.monto_saldo;
                        }
                    }
                }
            }
            if (bnd_new_row) {
                addRow(row);
            }
            if (bnd_indica_monto && monto_total <= 0) {
                break;
            }
        }
        setTPagosPdescuento(no_mensualidades_reales);
        setTMontoPdescuento(monto_para_descuento);

        const fixedStartColumns = ["no_pago", "fecha_movimiento", "interes"];
        const fixedEndColumn = "mensualidad";
        const groupedByDate: { [key: string]: { [key: string]: any } } = {};
        const allUniqueColumns = new Set<string>();

        tPagosNew.forEach((row) => {
            const fecha = row.fecha_movimiento;

            Object.keys(row).forEach((key) => allUniqueColumns.add(key));

            if (!groupedByDate[fecha]) {
                groupedByDate[fecha] = { ...row };
            } else {
                for (const col in row) {
                    if (row[col] !== undefined && row[col] !== null) {
                        groupedByDate[fecha][col] = row[col];
                    }
                }
            }
        });
        let finalColumnOrder = [...fixedStartColumns];

        Array.from(allUniqueColumns)
            .filter((col) => !fixedStartColumns.includes(col) && col !== fixedEndColumn)
            .sort()
            .forEach((col) => finalColumnOrder.push(col));

        if (allUniqueColumns.has(fixedEndColumn)) {
            finalColumnOrder.push(fixedEndColumn);
        }

        const tPagosAgrupados: { [key: string]: any }[] = [];

        for (const fecha in groupedByDate) {
            if (Object.prototype.hasOwnProperty.call(groupedByDate, fecha)) {
                const originalRow = groupedByDate[fecha];
                const orderedRow: { [key: string]: any } = {};

                finalColumnOrder.forEach((col) => {
                    if (originalRow[col] !== undefined) {
                        orderedRow[col] = originalRow[col];
                    } else {
                        orderedRow[col] = null;
                    }
                });
                tPagosAgrupados.push(orderedRow);
            }
        }

        tPagosAgrupados.sort((a, b) => {
            const dateA = new Date(a.fecha_movimiento.split("/").reverse().join("-"));
            const dateB = new Date(b.fecha_movimiento.split("/").reverse().join("-"));
            return dateA.getTime() - dateB.getTime();
        });

        if (tPagosAgrupados.length > 0) {
            const arrayDeDatos: any[][] = [];
            tPagosAgrupados.forEach((rowObject) => {
                const values = Object.values(rowObject);
                arrayDeDatos.push(values);
            });

            setTArray(arrayDeDatos);
            console.table(arrayDeDatos);
        }

        setTablaDesgloce(tPagosAgrupados);
    };

    const tieneAtrasos = () => {
        if (Number(gVencido) > 0) {
            return true;
        } else if (Number(gintereses) > 0) {
            return true;
        } else if (Number(gServicios) > 0) {
            return true;
        } else {
            return false;
        }
    };

    function handleBtnPagar() {
        setJustificacionNota(justificacionNota);
        setJustificacionDescuento(justificacionDescuento);

        const realizaPago = async () => {
            let pagosToRegister = [...tPagos];
            if (pagosToRegister === undefined || pagosToRegister === null || pagosToRegister.length === 0) {
                if (txtMontoAbonar === "0" || txtMontoAbonar === null || txtMontoAbonar === undefined || txtMontoAbonar === "") {
                    displayError("Debes indicar el monto recibido");
                    return;
                }
            }
            if (
                formaPago === "5" &&
                (justificacionNota === "" || justificacionNota === null || justificacionNota === undefined || justificacionNota.length < 1)
            ) {
                displayError("Debes escribir la justificacion de la nota");
                return;
            }
            if (gbloqueo === true) {
                displayError("Terreno bloqueado");
                return;
            }

            let tFinalPagos: any;
            if (pagosToRegister.length === 0) {
                tFinalPagos = acumulaPagos();
            }
            if (pagosToRegister !== undefined || tFinalPagos !== null) {
                if (tFinalPagos?.length > 0) {
                    await registrarPagoAPI(tFinalPagos);
                }
            }
        };

        const registrarPagoAPI = async (finalTPagos: r_TPago[]) => {
            try {
                const response = await fetch(`/api/dashboard/caja/registrarPago`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tPagos: finalTPagos,
                        soloServicios: soloServicios,
                        fecha_pago: fecha,
                        tipoCambio: precioDolar,
                        gcompromiso_pago: gCompromisoPago,
                        justificacionNota: justificacionNota,
                        id_usuario: DatosUsuario.id_usuario,
                        nombre_usuario: DatosUsuario.nombre,
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`${response.status} ${response.statusText}: ${errorData.message || "Error en la solicitud"}`);
                }
                const data = await response.json();
                if (data.length > 0) {
                    setTRecibos(data);
                    llenaMensualidadActual();
                    llenaMensualidadesVencidas();
                    llenaIntereses();
                    llenaDescuentos("otro");
                    llenaServicios();
                    llenaPagoInicial();
                    getDatosContrato();
                    llenaTotalPagar("otro");
                    limpiarCajasTexto();
                    llenaDatosTablaPagos();
                    generaTablaPagos("default");
                    setTPagosActual([]);
                    setTPagos([]);
                    displayError("Pago registrado con éxito!");
                } else {
                    displayError("El servidor respondió con un estado no 'OK'.");
                }
            } catch (error) {
                displayError(`Error al registrar el pago: ${error instanceof Error ? error.message : String(error)}`);
            }
        };
        realizaPago();
    }

    const acumulaPagosOLD = async () => {
        let tPagosRows = [...tPagos];

        if (Number(txtMontoAbonar) === 0 || Number(txtMontoAbonar) === null || Number(txtMontoAbonar) === undefined) {
            flashy.error("Debes ingresar el monto a abonar", {
                animation: "bounce",
                position: "top-center",
                duration: 5000,
                icon: "🚨",
            });
            return;
        }
        if ((justificacionDescuento === "" && descInteres !== 0) || descMensualidad !== 0) {
            flashy.error("Debes escribir una justificacion para poder aplicar el descuento", {
                animation: "bounce",
                position: "top-center",
                duration: 5000,
                icon: "🚨",
            });
        }
        if (Number(gCompromisoPago) > 0 && convierteANumero(txtMontoAbonar) < Number(gCompromisoPago)) {
            const msg = `El terreno tiene un compromiso de pago de ${new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(gCompromisoPago))}, no se puede abonar menos de esta cantidad, favor de pasar a cobranza.`;
            flashy.error(msg, {
                animation: "bounce",
                position: "top-center",
                duration: 5000,
                icon: "🚨",
            });
        }
        let moneda = "";
        if (tPagosRows.length > 0) {
            for (let x = 0; x < tPagosRows.length; x++) {
                moneda = tPagos[x].moneda;
                if (moneda !== gMoneda) {
                    flashy.error("No puedes acumular por ser diferente tipo de moneda", {
                        animation: "bounce",
                        position: "top-center",
                        duration: 5000,
                        icon: "🚨",
                    });
                    return;
                }
            }
        }

        try {
            const r: r_TPago = {
                id_contrato: contrato ?? 0,
                id_cabecera: gIdCabecera,
                monto_cobrar: convierteANumero(txtMontoAbonar),
                monto_total: convierteANumero(txtMontoAbonar) + Number(gDInteres) + Number(gdMensualidad),
                terreno: datosContrato?.no_terreno ?? "",
                manzana: datosContrato?.no_manzana ?? "",
                fraccionamiento: datosContrato?.fraccionamiento ?? "",
                moneda: gMoneda,
                dinteres: descInteres,
                dmensualidad: descMensualidad,
                justificacion_descuento: justificacionDescuento,
                tipo_pago: Number(formaPago),
                referencia: txtRefrerencia,
                pagoPesos: convierteANumero(txtMontoPesos),
                pagoDolares: convierteANumero(txtMontoDolares),
                pagoCheque: convierteANumero(txtMontoCheque),
                pago_inicial: gPagoInicial,
            };
            const contratoYaExiste = tPagos.some((pago) => pago.id_contrato === r.id_contrato);
            if (contratoYaExiste === false) {
                setTPagos([...tPagos, r]);
                limpiarCajasTexto();
            } else {
                flashy.error("El contrato ya existe en la lista");
            }
        } catch (error) {
            flashy.error(String(error));
        }
    };
    const acumulaPagos = () => {
        if (txtMontoAbonar === "0" || txtMontoAbonar === null || txtMontoAbonar === undefined || txtMontoAbonar === "") {
            flashy.error("Debes ingresar el monto a abonar", {
                animation: "bounce",
                position: "top-center",
                duration: 5000,
                icon: "🚨",
            });
            return;
        }
        if (justificacionDescuento === "" && (descInteres !== 0 || descMensualidad !== 0)) {
            flashy.error("Debes escribir una justificacion para poder aplicar el descuento", {
                animation: "bounce",
                position: "top-center",
                duration: 5000,
                icon: "🚨",
            });
            return;
        }
        if (Number(gCompromisoPago) > 0 && convierteANumero(txtMontoAbonar) < Number(gCompromisoPago)) {
            const msg = `El terreno tiene un compromiso de pago de ${new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(gCompromisoPago))}, no se puede abonar menos de esta cantidad, favor de pasar a cobranza.`;
            flashy.error(msg, {
                animation: "bounce",
                position: "top-center",
                duration: 5000,
                icon: "🚨",
            });
            return;
        }
        let moneda = "";

        if (tPagos.length > 0) {
            for (let x = 0; x < tPagos.length; x++) {
                moneda = tPagos[x].moneda;
                if (moneda !== gMoneda) {
                    flashy.error("No puedes acumular por ser diferente tipo de moneda", {
                        animation: "bounce",
                        position: "top-center",
                        duration: 5000,
                        icon: "🚨",
                    });
                    return;
                }
            }
        }

        try {
            const newPago: r_TPago = {
                id_contrato: contrato ?? 0,
                id_cabecera: datosContrato?.id_movimiento_cabecera ?? 0,
                monto_cobrar: convierteANumero(txtMontoAbonar),
                monto_total: convierteANumero(txtMontoAbonar) + Number(gDInteres) + Number(gdMensualidad),
                terreno: datosContrato?.no_terreno ?? "",
                manzana: datosContrato?.no_manzana ?? "",
                fraccionamiento: datosContrato?.fraccionamiento ?? "",
                moneda: datosContrato?.moneda === 0 ? "PESOS" : "DOLARES",
                dinteres: descInteres,
                dmensualidad: descMensualidad,
                justificacion_descuento: justificacionDescuento,
                tipo_pago: Number(formaPago),
                referencia: txtRefrerencia,
                pagoPesos: convierteANumero(txtMontoPesos),
                pagoDolares: convierteANumero(txtMontoDolares),
                pagoCheque: convierteANumero(txtMontoCheque),
                pago_inicial: gPagoInicial,
            };
            const contratoYaExiste = tPagos.some((pago) => pago.id_contrato === newPago.id_contrato);

            if (contratoYaExiste === false) {
                let pagosToRegister = [...tPagos, newPago];
                setTPagos(pagosToRegister);
                limpiarCajasTexto();
                console.table(pagosToRegister);
                return pagosToRegister;
            } else {
                displayError("El contrato ya existe en la lista");
                return;
            }
        } catch (error) {
            displayError(String(error));
            return;
        }
    };
    const displayError = (message: string) => {
        flashy.error(message, {
            animation: "bounce",
            position: "top-center",
            duration: 5000,
            icon: "🚨",
        });
    };

    const handleMensualidadesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = parseFloat(event.target.value);
        setTxtMensualidades(newData.toString());
    };
    const handleMensualidades = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = convierteANumero(event.target.value);
        if (newData > 0) {
            //setTxtMensualidades(newData.toString());
            if (txtMensualidades === "0" || txtMensualidades === "") {
                // flashy.error("No hay mensualidades a pagar");
                generaTablaPagos("default");
            }
            //  if (indicaMonto !== true) {
            setIndicaMonto(false);
            setIndicaMensualidad(true);

            generaTablaPagos("mensualidades");
            llenaIntereses();

            generaCambio();
            generaFaltante();
            //setNuevoCambio(nuevoCambio + 1);
            llenaDescuentos("otro");
        } else {
            setTxtMensualidades("");
        }
    };
    const convierteANumero = (valor: string) => {
        const cleanedString = valor.replace(/[$,\s]/g, "");
        const num = parseFloat(cleanedString).toFixed(2);
        return parseFloat(num);
    };
    const handleMontoPesos = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        const cleanedString = newData.replace(/[$,\s]/g, "");
        const num = parseFloat(cleanedString);
        if (isNaN(num)) {
            setTxtMontoPesos("0");
            return;
        } else {
            setTxtMontoPesos(
                Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(num)
            );
        }
        const pesos = convierteANumero(txtMontoPesos);
        const dlls = convierteANumero(txtMontoDolares) * Number(precioDolar);
        const cheques = convierteANumero(txtMontoCheque);
        const total = pesos + dlls + cheques;
        setTxtMontoRecibido(
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(total)
        );
        // setTxtMontoAbonar(total.toString());
        generaCambio();
        setNuevoCambio(nuevoCambio + 1);
        generaFaltante();
    };
    const handleMontoPesosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setTxtMontoPesos(newData);
    };

    const handleMontoDolaresChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setTxtMontoDolares(newData);
    };
    const handleMontoDolares = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        const cleanedString = newData.replace(/[$,\s]/g, "");
        const num = parseFloat(cleanedString);
        if (isNaN(num)) {
            setTxtMontoDolares("0");
            return;
        } else {
            setTxtMontoDolares(
                Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(num)
            );
        }
        const pesos = convierteANumero(txtMontoPesos);
        const dlls = convierteANumero(txtMontoDolares) * Number(precioDolar);
        const cheques = convierteANumero(txtMontoCheque);
        const total = pesos + dlls + cheques;
        setLblTipoCambio(precioDolar + " x " + txtMontoDolares + " = " + Number(precioDolar * num).toString());
        setTxtMontoRecibido(
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(total)
        );
        // generaCambio();
        setNuevoCambio(nuevoCambio + 1);
        generaFaltante();
    };
    const handleMontoChequeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setTxtMontoCheque(newData);
    };
    const handleMontoCheque = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        const cleanedString = newData.replace(/[$,\s]/g, "");
        const num = parseFloat(cleanedString);
        if (isNaN(num)) {
            setTxtMontoCheque("0");
            return;
        } else {
            setTxtMontoCheque(
                Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(num)
            );
        }
        const pesos = convierteANumero(txtMontoPesos);
        const dlls = convierteANumero(txtMontoDolares) * Number(precioDolar);
        const cheques = convierteANumero(txtMontoCheque);
        const total = pesos + dlls + cheques;
        setTxtMontoRecibido(
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(total)
        );
        generaCambio();
        generaFaltante();
    };
    const handleMontoAbonar = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        const cleanedString = newData.replace(/[$,\s]/g, "");
        const num = parseFloat(cleanedString);
        if (isNaN(num)) {
            setTxtMontoAbonar("0");
            return;
        } else {
            setTxtMontoAbonar(
                Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(Number(num))
            );
        }
        setIndicaMonto(true);
        setIndicaMensualidad(false);
        generaTablaPagos("monto");
        calculaMensualidadesPagar();
        generaCambio();
        generaFaltante();
        llenaDescuentos("cantidad");
    };
    const handleMontoAbonarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setTxtMontoAbonar(newData.toString());
    };

    const handleMontoRecibido = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        const cleanedString = newData.replace(/[$,\s]/g, "");

        const num = convierteANumero(newData);

        if (isNaN(num)) {
            setTxtMontoRecibido("0");
            return;
        } else {
            setTxtMontoRecibido(
                Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(num)
            );

            setNuevoCambio(nuevoCambio + 1);
            generaFaltante();
            generaCambio(); // TODO: PENDIENTE
        }
    };

    const handleMontoRecibidoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setTxtMontoRecibido(newData);
    };

    const handleReferencia = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setTxtRefrerencia(newData);
    };
    const handleReferenciaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // const newData = event.target.value;
        // setTxtRefrerencia(newData);
    };

    const calculaMensualidadesPagar = async () => {
        let mensualidades: number = 0;
        const monto = convierteANumero(txtMontoAbonar);
        const saldosPendientes = await getSaldosMensualidades();
        let monto_pago: number = 0;
        if (Array.isArray(saldosPendientes) && saldosPendientes.length > 0) {
            for (let i of saldosPendientes) {
                monto_pago += Number(i.monto);
                if (monto >= monto_pago) {
                    mensualidades++;
                } else {
                    break;
                }
            }
            setTxtMensualidades(mensualidades.toString());
        }
    };

    const generaCambio = () => {
        const recibido = convierteANumero(txtMontoRecibido);
        const abonar = convierteANumero(txtMontoAbonar);
        const total = recibido - abonar;
        if (total < 0) {
            setLblMontoCambio(
                new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(0)
            );
            return;
        } else {
            setLblMontoCambio(
                new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(total)
            );
        }
    };
    const generaFaltante = () => {
        const abonar = convierteANumero(txtMontoAbonar);
        const recibido = convierteANumero(txtMontoRecibido);
        const total = Number(recibido) - Number(abonar);

        const faltante = total < 0 ? total * -1 : 0;

        setLblMontoFaltante(faltante.toString());
    };
    const llenaDescuentos = (tipo: string) => {
        let dinteres = 0;
        let dmensualidad = 0;
        setGDInteres(0);
        setGDMensualidad(0);

        if (Number(descInteres) >= 0 && Number(descInteres) <= 100 && Number(gintereses) > 0) {
            dinteres = (Number(gintereses) * Number(descInteres)) / 100;
            setDescInteresCalculado(
                new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(Number(dinteres))
            );
        }
        if (Number(descMensualidad) >= 0 && Number(descMensualidad) <= 100 && Number(tMontoPdescuento) >= 0) {
            dmensualidad = (Number(tMontoPdescuento) * Number(descMensualidad)) / 100;
            setDescMensualidadCalculado(
                new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(Number(dmensualidad))
            );
        }
        dinteres = Number(dinteres.toFixed(2));
        setGDInteres(dinteres);
        dmensualidad = Number(dmensualidad.toFixed(2));
        setGDMensualidad(dmensualidad);
        llenaTotalPagar(tipo);
    };

    const getSaldosMensualidades = async () => {
        try {
            const response = await fetch(`/api/dashboard/caja/getSaldosMensualidades?idContrato=${contrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data) && data.length > 0) {
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleJustificacionDescuento = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newData = event.target.value;
        setJustificacionDescuento(newData);
    };

    const handleJustificacionNota = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newData = event.target.value;
        setJustificacionNota(newData);
    };
    useEffect(() => {
        setTablaDesgloce(tablaDesgloce);
    }, [tablaDesgloce]);

    useEffect(() => {}, [txtMensualidades]);

    useEffect(() => {
        setMensualidadAnterior(mensualidadAnterior);
    }, [mensualidadAnterior]);

    useEffect(() => {
        setMensualidadActual(mensualidadActual);
    }, [mensualidadActual]);
    useEffect(() => {
        setPorcentajeAnual(porcentajeAnual);
    }, [porcentajeAnual]);

    useEffect(() => {
        calculaMensualidadesPagar();
    }, [txtMontoAbonar]);

    useEffect(() => {
        generaTablaPagos("default");
    }, [tPagosActual]);

    useEffect(() => {
        calculaMensualidadesPagar();
        generaCambio();
        generaFaltante();
    }, [nuevoCambio]);

    useEffect(() => {
        llenaDescuentos("otros");
        generaCambio();
        generaFaltante();
    }, [descInteres]);

    useEffect(() => {
        llenaDescuentos("otros");
        generaCambio();
        generaFaltante();
    }, [descMensualidad]);
    useEffect(() => {}, [serviciosFraccionamiento]);
    useEffect(() => {}, [tPagos]);
    useEffect(() => {
        setGVencido(0);
        setGDInteres(0);
        setGDMensualidad(0);
        setGServicios(0);
        setGMontoParaDescuento(0);
        setServiciosFraccionamiento([]);
        setGPagoInicial(0);
        setGCompromisoPago(0);
        setGTotalAbonar(0);
        setTablaDesgloce([]);
        setTArray([]);
        setTRecibos([]);
        limpiarCajasTexto();
        popCompromisoPago();
        getDatosContrato();
        getDatosAjusteAnual();
        getServiciosDisponiblesFraccionamiento();
        llenaMensualidadesVencidas();
        llenaCabecera();
        llenaMensualidadActual();
        llenaIntereses();
        llenaServicios();
        llenaPagoInicial();
        llenaTotalPagar("otro");
        llenaDatosTablaPagos();
        // generaTablaPagos("default");
        validaDescuentos();
    }, [contrato]);

    useEffect(() => {
        if (indicaMensualidad === true) {
            llenaTotalPagar("otro");
        }
        if (indicaMensualidad === true && indicaMonto === false) {
            llenaTotalPagar("otro");
        }
    }, [indicaMensualidad]);

    useEffect(() => {
        setTxtMontoAbonar(
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(gTotalAbonar.toFixed(2)))
        );
    }, [gTotalAbonar]);

    useEffect(() => {
        columnTotals = [];
        if (tArray.length > 0) {
            for (let i = 2; i < tArray[0].length; i++) {
                columnTotals[i] = 0;
            }
            tArray.forEach((row) => {
                for (let i = 2; i < row.length; i++) {
                    const value = row[i];
                    if (typeof value === "number") {
                        columnTotals[i] += value;
                    } else if (typeof value === "string" && !isNaN(parseFloat(value))) {
                        columnTotals[i] += parseFloat(Number(value).toFixed(2));
                    }
                }
            });

            if (columnTotals.length > 0) {
                let t: number = 0;
                for (let i = 2; i < columnTotals.length; i++) {
                    t += columnTotals[i];
                }
                t = Number(t.toFixed(2));
                setGTotalAbonar(Number(t.toFixed(2)));
                setTxtMontoAbonar(
                    Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(t)
                );
            }
        }
    }, [tArray]);

    useEffect(() => {
        generaCambio();
        generaFaltante();
    }, [txtMontoAbonar]);

    const nombreCliente = Cliente.nombre + " " + Cliente.ap_paterno + " " + Cliente.ap_materno;
    const contratoCliente = ContratosLista.filter((c) => c.id_contrato == contrato);
    return (
        <>
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8 ">
                <Card x-chunk="dashboard-01-chunk-1">
                    <CardHeader>
                        <CardTitle>
                            {Cliente.nombre} {Cliente.ap_paterno} {Cliente.ap_materno}
                        </CardTitle>
                        <CardDescription>
                            <Label htmlFor="status">Fecha de pago {" : "}</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        disabled={true}
                                        variant={"outline"}
                                        className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "LLL dd, y", { locale: es }) : <span>Elige el dia</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <>
                            {tablaDesgloce && tablaDesgloce.length > 0 ? (
                                <>
                                    <div className="container mx-auto px-4 py-3 bg-card text-card-foreground rounded-lg shadow-md border border-border">
                                        <div className="grid gap-2">
                                            <div className="space-y-1">
                                                <Table
                                                    id="tablaDatos"
                                                    className="rounded-md border border-slate-200 shadow-sm max-w-[full]"
                                                >
                                                    <TableCaption> </TableCaption>
                                                    <TableHeader className="border border-slate-200 bg-red-700 text-white">
                                                        <TableRow>
                                                            {Object.keys(tablaDesgloce[0]).map((key) => (
                                                                <TableHead className="text-center w-[30px] text-white uppercase" key={key}>
                                                                    {key}
                                                                </TableHead>
                                                            ))}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <>
                                                            {tArray.map((row, rowIndex) => {
                                                                const fechaCelda = moment(Object.values(row)[1], "DD/MM/YYYY");
                                                                let bgCelda = "";
                                                                if (
                                                                    fechaCelda.isValid() &&
                                                                    fechaCelda.isSameOrAfter(moment(fecha, "YYYY-MM-DD").add(30, "days"))
                                                                ) {
                                                                    bgCelda = `bg-amber-400 text-xl`;
                                                                }
                                                                return (
                                                                    <TableRow key={rowIndex} className={bgCelda}>
                                                                        {Object.values(row).map((value, colIndex) => {
                                                                            let displayedValue;
                                                                            let cellClassName = "text-center text-xs p-1";

                                                                            if (colIndex > 1) {
                                                                                const numericValue =
                                                                                    typeof value === "number"
                                                                                        ? value
                                                                                        : parseFloat(String(value));
                                                                                if (!isNaN(numericValue)) {
                                                                                    displayedValue = new Intl.NumberFormat("es-MX", {
                                                                                        style: "currency",
                                                                                        currency: "MXN",
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2,
                                                                                    }).format(numericValue);
                                                                                    cellClassName += " text-center";
                                                                                } else {
                                                                                    displayedValue = String(value);
                                                                                    displayedValue = String(
                                                                                        value == null ? "- - -" : value
                                                                                    );
                                                                                }
                                                                            } else {
                                                                                displayedValue = String(value);
                                                                            }

                                                                            return (
                                                                                <TableCell className={cellClassName} key={colIndex}>
                                                                                    {displayedValue}
                                                                                </TableCell>
                                                                            );
                                                                        })}
                                                                    </TableRow>
                                                                );
                                                            })}
                                                            {tArray.length > 0 && columnTotals.length > 0 && (
                                                                <TableRow className="bg-gray-100 font-bold">
                                                                    <TableCell className="text-right text-xs p-1" colSpan={2}>
                                                                        Totales:
                                                                    </TableCell>

                                                                    {columnTotals.map((total, index) => {
                                                                        if (index >= 2) {
                                                                            return (
                                                                                <TableCell className="text-center text-xs p-1" key={index}>
                                                                                    {new Intl.NumberFormat("es-MX", {
                                                                                        style: "currency",
                                                                                        currency: "MXN",
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2,
                                                                                    }).format(Number(total))}{" "}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })}
                                                                </TableRow>
                                                            )}
                                                        </>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="container mx-auto px-4 py-3 bg-card text-card-foreground rounded-lg shadow-md border border-border">
                                        <div className="grid gap-2">
                                            <div className="space-y-1">
                                                <p className="text-3xl font-semibold text-muted-foreground uppercase"></p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                        <Separator className="my-4 size-1 bg-white" />
                        {/* <div className="grid auto-rows-max items-start gap-4 lg:gap-8"> */}
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8 grid-cols-1 md:grid-cols-12">
                            <Card x-chunk="dashboard-01-chunk-4" className="col-span-5 lg:col-span-4 xl:col-span-5">
                                <CardHeader>
                                    <CardTitle></CardTitle>
                                    <CardDescription></CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                                        <div className="md:col-span-12 lg:col-span-12 xl:col-span-12">
                                            <div className="grid grid-cols-2 gap-2 items-center">
                                                <Label htmlFor="c_txtMensualidades">Mensualidades a pagar</Label>
                                                <Input
                                                    id="c_txtMensualidades"
                                                    className="h-[25px]"
                                                    onBlur={handleMensualidades}
                                                    onChange={handleMensualidadesChange}
                                                    // value={txtMensualidades}
                                                    defaultValue={txtMensualidades}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 items-center mt-4">
                                                <Label htmlFor="c_txtMontoPesos">Efectivo:</Label>
                                                <Input
                                                    id="c_txtMontoPesos"
                                                    className="h-[25px]"
                                                    onBlur={handleMontoPesos}
                                                    onChange={handleMontoPesosChange}
                                                    value={txtMontoPesos}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 ">
                                            <div className="grid grid-cols-2 gap-2 items-center">
                                                <Label htmlFor="c_txtMontoDolares">Dolares ( {lblTipoCambio}):</Label>
                                                <Input
                                                    id="c_txtMontoDolares"
                                                    className="h-[25px]"
                                                    onBlur={handleMontoDolares}
                                                    onChange={handleMontoDolaresChange}
                                                    value={txtMontoDolares}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 items-center mt-4">
                                                <Label htmlFor="c_txtMontoCheque">Cheque o Tarjeta M.N:</Label>
                                                <Input
                                                    id="c_txtMontoCheque"
                                                    className="h-[25px]"
                                                    value={txtMontoCheque}
                                                    onChange={handleMontoChequeChange}
                                                    onBlur={handleMontoCheque}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 ">
                                            <div className="grid grid-cols-2 gap-2 items-center">
                                                <Label htmlFor="c_txtMontoAbonar">Total a Abonar:</Label>
                                                <Input
                                                    id="c_txtMontoAbonar"
                                                    className="h-[25px]"
                                                    type="text"
                                                    onBlur={handleMontoAbonar}
                                                    onChange={handleMontoAbonarChange}
                                                    value={txtMontoAbonar}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 items-center mt-4">
                                                <Label htmlFor="c_txtMontoRecibido">Total Recibido:</Label>
                                                <Input
                                                    id="c_txtMontoRecibido"
                                                    className="h-[25px]"
                                                    type="text"
                                                    onBlur={handleMontoRecibido}
                                                    value={txtMontoRecibido}
                                                    onChange={handleMontoRecibidoChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 ">
                                            <div className="grid grid-cols-2 gap-2 items-center">
                                                <Label htmlFor="c_formaPago">Forma de Pago:</Label>
                                                <Select onValueChange={setFormaPago} defaultValue={"1"}>
                                                    <SelectTrigger id="selectFormaPago" className="h-[25px]">
                                                        <SelectValue placeholder="Selecciona el tipo de pago" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">EFECTIVO</SelectItem>
                                                        <SelectItem value="2">TARJETA</SelectItem>
                                                        <SelectItem value="3">DEPOSITO</SelectItem>
                                                        <SelectItem value="4">CHEQUE</SelectItem>
                                                        <SelectItem value="5">NOTA DE CREDITO</SelectItem>
                                                        <SelectItem value="6">TARJETA DE DÉBITO</SelectItem>
                                                        <SelectItem value="7">TARJETA DE CRÉDITO</SelectItem>
                                                        <SelectItem value="8">TRANSFERENCIA</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 items-center mt-4">
                                                <Label htmlFor="c_txtReferencia">Referencia:</Label>
                                                <Input
                                                    id="c_txtReferencia"
                                                    className="h-[25px]"
                                                    onBlur={handleReferencia}
                                                    // onChange={handleReferenciaChange}
                                                    // value={txtRefrerencia}
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 items-center">
                                                <Label className="h-[35px] py-2" htmlFor="c_lblCambio">
                                                    Cambio:
                                                </Label>
                                                <Label className="h-[25px] py-2">
                                                    {/* {new Intl.NumberFormat("es-MX", {
                                                        style: "currency",
                                                        currency: "MXN",
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }).format(Number(lblMontoCambio))} */}
                                                    {lblMontoCambio}
                                                </Label>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 items-center">
                                                <Label className="h-[35px] py-2" htmlFor="c_lblFaltante">
                                                    Faltante:
                                                </Label>
                                                <Label className="h-[25px] py-2">
                                                    {new Intl.NumberFormat("es-MX", {
                                                        style: "currency",
                                                        currency: "MXN",
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }).format(Number(lblMontoFaltante))}
                                                </Label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-12 lg:col-span-12 xl:col-span-12">
                                            <div className="grid grid-cols-3 gap-2">
                                                {" "}
                                                {/* Puedes ajustar 'grid-cols-3' si quieres 3 botones por fila o 'grid-flow-col' si solo quieres que se coloquen en columnas una al lado de la otra sin limitar el número de columnas */}
                                                <Button variant="outline" id="btnAcumular" className="" onClick={acumulaPagos}>
                                                    Acumular
                                                </Button>
                                                <Button variant="outline" id="btnPagar" className="" onClick={handleBtnPagar}>
                                                    Pagar
                                                </Button>
                                                <Button variant="outline" id="btnActualizar" className="">
                                                    Actualizar
                                                </Button>
                                                <Button variant="outline" id="btnAnularCompromiso" className="">
                                                    Anular Compromiso
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    id="btnBloqueoCaja"
                                                    className=""
                                                    disabled={datosContrato?.bnd_bloqueo_caja}
                                                >
                                                    Bloquear
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card x-chunk="dashboard-01-chunk-4" className="col-span-5 lg:col-span-5 xl:col-span-5">
                                <CardHeader className="py-2">
                                    {/* <CardTitle className="uppercase text-center text"></CardTitle>
                                    <CardDescription></CardDescription> */}
                                </CardHeader>
                                <CardContent>
                                    <Card x-chunk="dashboard-01-chunk-4_1" className="col-span-6 lg:col-span-6 xl:col-span-6">
                                        <CardHeader>
                                            <CardTitle className="uppercase text-center text">descuentos</CardTitle>
                                            <CardDescription></CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                                                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12">
                                                    <div className="grid grid-cols-4 gap-2 items-center">
                                                        <Label htmlFor="c_txtDescMensualidades">Mensualidad:(%) </Label>
                                                        <Input
                                                            id="c_txtDescMensualidades"
                                                            className="h-[25px]"
                                                            onBlur={handleDescuentoMensualidad}
                                                            onChange={handleDescuentoMensualidadChange}
                                                            // value={txtMensualidades}
                                                            defaultValue={descMensualidad}
                                                            disabled={datosContrato?.bnd_descuentos}
                                                        />

                                                        <Label htmlFor="c_txtDescMensualidadesCalculado">{descMensualidadCalculado} </Label>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2 items-center mt-4">
                                                        <Label htmlFor="c_txtDescInteres">Interes:(%)</Label>
                                                        <Input
                                                            id="c_txtDescInteres"
                                                            className="h-[25px]"
                                                            onChange={handleDescuentoInteresChange}
                                                            onBlur={handleDescuentoInteres}
                                                            defaultValue={descInteres}
                                                            // value={txtMontoPesos}
                                                        />
                                                        <Label htmlFor="c_txtDescInteresCalculado">{descInteresCalculado} </Label>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2 items-center mt-4"></div>
                                                </div>
                                                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 ">
                                                    <div className="grid grid-cols-4 gap-2 items-center">
                                                        <Label htmlFor="c_txtJustificacion">Justificaci&oacute;n:</Label>
                                                        <Textarea
                                                            id="c_txtJustificacion"
                                                            className="h-[25px] col-span-2"
                                                            onBlur={handleJustificacionDescuento}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card x-chunk="dashboard-01-chunk-4_2" className="col-span-6 lg:col-span-6 xl:col-span-6">
                                        <CardHeader>
                                            <CardTitle className="uppercase text-center text">Nota de Credito</CardTitle>
                                            <CardDescription></CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                                                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 ">
                                                    <div className="grid grid-cols-4 gap-2 items-center">
                                                        <Label htmlFor="c_txtJustificacionNota">Justificaci&oacute;n:</Label>
                                                        <Textarea
                                                            id="c_txtJustificacionNota"
                                                            className="h-[25px] col-span-2"
                                                            onBlur={handleJustificacionNota}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </Card>
                            <Card x-chunk="dashboard-01-chunk-4" className="col-span-2 lg:col-span-2 xl:col-span-2">
                                <CardHeader className="py-2 uppercase text-center">recibos</CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                                        <div className="md:col-span-12 lg:col-span-12 xl:col-span-12">
                                            <div className="grid grid-cols-4 gap-2 items-center">
                                                {/* <BtnReciboPDF idRecibo={item.idRecibo} idContrato={item.idContrato}/> */}
                                                {tRecibos.length > 0 ? (
                                                    tRecibos.map((item: TRecibo) => {
                                                        return (
                                                            <div className="col-span-2">
                                                                {/* <Label htmlFor="c_txtDescMensualidades">{item.id_recibo}</Label> */}

                                                                <BtnReciboPDF
                                                                    idRecibo={item.idRecibo}
                                                                    idContrato={item.idContrato}
                                                                    data_recibo={item.data_recibo}
                                                                />

                                                                {/* <BtnMostrarRecibo idRecibo={item.idRecibo} idContrato={item.idContrato} /> */}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="col-span-2">
                                                        <Label htmlFor="c_txtDescMensualidades"></Label>
                                                    </div>
                                                )}
                                                <Label htmlFor="c_txtDescMensualidades"> </Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-01-chunk-2">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            <Label htmlFor="status" className="text-lg uppercase">
                                Terrenos
                            </Label>
                            <Select onValueChange={(selectedValue) => setContrato(Number(selectedValue))}>
                                <SelectTrigger id="selectContrato">
                                    {/* <SelectValue placeholder="Selecciona el terreno" /> */}
                                    <SelectValue
                                        placeholder={`${ContratosLista[0].terreno}`}
                                        className={`${
                                            ContratosLista[0].id_estatus_contrato === 1
                                                ? "bg-blue-150"
                                                : ContratosLista[0].id_estatus_contrato === 5
                                                ? "bg-amber-400"
                                                : "bg-green-400"
                                        }`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {ContratosLista.map((contrato) => {
                                        const bgContrato =
                                            contrato.id_estatus_contrato === 1
                                                ? "bg-blue-50"
                                                : contrato.id_estatus_contrato === 5
                                                ? "bg-amber-100"
                                                : "bg-green-100";
                                        return (
                                            <SelectItem
                                                key={contrato.id_contrato}
                                                value={contrato.id_contrato.toString()}
                                                className={`${bgContrato} hover:text-right`}
                                            >
                                                {contrato.terreno}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex items-center gap-4">
                            {serviciosFraccionamiento.length > 0 &&
                                serviciosFraccionamiento.map((item: any) => {
                                    return (
                                        <Image
                                            src={"/image/serviciosFraccionamientos/" + item}
                                            width={36}
                                            height={36}
                                            alt="Servicio Disponible en Fraccionamiento"
                                            className="overflow-hidden rounded-full"
                                            id={`s_Icon_${item}`}
                                            key={`s_Icon_${item}`}
                                        />
                                    );
                                })}
                        </div>
                        <Separator className="my-0" />
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            saldo:{" "}
                            <span className="text-sm font-normal text-foreground">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(datosContrato?.saldo))}
                            </span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            fecha contrato: <span className="text-sm font-normal text-foreground">{datosContrato?.fecha_contrato}</span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            mensualidades: <span className="text-sm font-normal text-foreground">{datosContrato?.mensualidades}</span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            financiamiento: <span className="text-sm font-normal text-foreground">{datosContrato?.financiamiento}</span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            precio original:{" "}
                            <span className="text-sm font-normal text-foreground">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                }).format(Number(datosContrato?.precio_original))}
                            </span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            estatus: <span className="text-sm font-normal text-foreground">{datosContrato?.estatus}</span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            Ajuste Anual: <span className="text-sm font-normal text-foreground">{datosContrato?.ajuste_anual}</span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            asesor venta: <span className="text-sm font-normal text-foreground">{datosContrato?.asesor_venta}</span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase ">
                            asesor cobranza: <span className="text-sm font-normal text-foreground">{datosContrato?.asesor_cobranza}</span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            Contrato entregado:{" "}
                            <Switch
                                id="airplane-mode"
                                disabled={datosContrato?.contrato_entregado}
                                checked={datosContrato?.contrato_entregado}
                                onCheckedChange={handleEntregaContrato}
                                aria-readonly
                            />
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            Mensualidad anterior:{" "}
                            <span className="text-sm font-normal text-foreground">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(mensualidadAnterior))}
                            </span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            Mensualidad actual:{" "}
                            <span className="text-sm font-normal text-foreground">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(mensualidadActual))}
                            </span>
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">
                            Ajuste Anual: <span className="text-sm font-normal text-foreground">{porcentajeAnual}%</span>
                        </p>

                        <div className="grid gap-6"></div>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium leading-none uppercase">
                            &Uacute;ltimos Comentarios{" "}
                            <BtnVerComentariosCaja
                                idContrato={contrato == null ? 0 : contrato}
                                nombreCliente={nombreCliente}
                                terreno={contratoCliente[0].terreno}
                            />
                            <BtnNuevoComentarioCaja
                                idContrato={contrato == null ? 0 : contrato}
                                nombreCliente={nombreCliente}
                                terreno={contratoCliente[0].terreno}
                                idUsuario={DatosUsuario.id_usuario == null ? "" : DatosUsuario.id_usuario}
                            />
                        </CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        {" "}
                        <div className="grid gap-2 text-sm font-normal leading-none">
                            <Separator className="my-0" />
                            {contrato !== null && <UltimoMensajeCobranza idContrato={contrato} />}
                            {contrato !== null && <UltimoMensajeCaja idContrato={contrato} />}
                        </div>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-3">
                    <CardHeader>
                        <CardTitle>Datos extra</CardTitle>
                        <CardDescription>Informacion interna:</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div></div>

                        <Button size="sm" variant="secondary">
                            algo
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
