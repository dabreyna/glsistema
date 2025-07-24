"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Printer, Receipt } from "lucide-react";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
// Ensure logo.png is in the same directory as this file (./logo.png)
import logoGL from "./logo.png";
import securityBackground from "./securityBackground.png";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Necesario para la carga dinámica

// Importa PDFViewer dinámicamente
const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
    ssr: false, // ¡Extremadamente importante! Asegura que PDFViewer solo se renderice en el cliente
    loading: () => <p>Cargando vista previa del PDF...</p>,
});
// import Arial from "./arial.ttf";
import { intlFormat } from "date-fns";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import { set } from "lodash";
import { text } from "stream/consumers";

interface DatosEmpresa {
    razon_social: string;
    fraccionamiento: string;
    nomenclatura: string;
    no_manzana: string;
    no_terreno: string;
    direccion: string;
    rfc: string;
    ciudad: string;
    estado: string;
    cp: string;
    telefono_principal: string;
    nombre_cliente: string;
    fecha_contrato: string;
    moneda: number;
    no_pagos: number;
    id_estatus_contrato: number;
    folio_notas_credito: string;
}
interface DatosMovimiento {
    id_contrato: number;
    monto: string;
    id_tipo_movimiento: number;
    saldo_recibo: string | null;
    no_pago: number | null;
    descuento_interes: number | null;
    descuento_mensualidad: number | null;
    usuario: number;
    fecha_movimiento: string;
    tipo_cambio: number | null;
    monto_efectivo: number | null;
    monto_dlls: number | null;
    monto_cheque: number | null;
    referencia: string | null;
    no_recibo: number;
    fecha_movimiento_format: string;
}
interface SaldosRecibo {
    descuento_interes: number;
    descuento_mensualidad: number;
    total_recibo: number;
    saldo: number;
    total: number;
}
interface BtnReciboPDFProps {
    idRecibo: number;
    idContrato: number;
    data_recibo: any;
}

interface DatosCabecera {
    datosMovimientos: DatosMovimiento[];
    datosEmpresa: DatosEmpresa[];
    saldosRecibo: SaldosRecibo;
}
interface DatosResumen {
    rMensualidades: any;
    rIntereses: any;
    rServicios: any;
}

export interface DatosDescuentos {
    descuentoInteres: string | null;
    descuentoMensualidad: string | null;
    pagoInicial: string | null;
}

interface DatosRecibo {
    datosCabecera: DatosCabecera;
    datosResumen: DatosResumen | null;
    tablaConceptos: string[][];
    datosDescuentos: DatosDescuentos;
    cajero: string;
    prefolio: string;
}

// --------------------------------------------------
// Componente React (BtnReciboPDF) con PDFViewer
// --------------------------------------------------
export function BtnReciboPDF({ idRecibo, idContrato, data_recibo }: BtnReciboPDFProps) {
    const [datosRecibo, setDatosRecibo] = useState<DatosRecibo | null>(null);
    const [pDescInteres, setPDescInteres] = useState<number>(0);
    const [pDescMensualidad, setPDescMensualidad] = useState<number>(0);
    const [fechaRecibo, setFechaRecibo] = useState<string>("");
    const [montoEfectivo, setMontoEfectivo] = useState<number>(0);
    const [montoDLS, setMontoDLS] = useState<number>(0);
    const [montoCheque, setMontoCheque] = useState<number>(0);
    const [referencia, setReferencia] = useState<string>("");
    const [totalRecibo, setTotalRecibo] = useState<number>(0);
    const [tipoCambioDlls, setTipoCambioDlls] = useState<number>(0);

    const [montoEnLetras, setMontoEnLetras] = useState<string>("");
    const styles = StyleSheet.create({
        page: {
            paddingLeft: 15,
            paddingRight: 20,
            paddingTop: 10,
            fontSize: 9,
            fontFamily: "Helvetica",
        },
        headerSection: {
            flexDirection: "row",
            justifyContent: "space-between",
            textAlign: "center",
        },
        logo: {
            width: 112,
            height: 82,
            marginRight: 20,
            bottom: 0,
        },
        headerInfo: {
            paddingTop: 10,
            flexGrow: 1,
            alignItems: "center",
            textAlign: "center",
            alignContent: "center",
        },
        headerText: {
            fontSize: 9,
            marginBottom: 5,
            textAlign: "center",
            alignItems: "center",
            paddingRight: 60,
        },
        bold: {
            fontWeight: "bold",
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
        },

        // 🔧 Tabla optimizada
        tableContainer: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#000",
        },
        tableRow: {
            flexDirection: "row",
            alignItems: "center",
            maxHeight: 24,
            borderBottomWidth: 1,
            borderColor: "#000",
        },
        headerRow: {
            backgroundColor: "#f2f2f2",
            fontWeight: "bold",
            textAlign: "center",
        },
        cell: {
            padding: 2.5,
            flex: 1,
            textAlign: "center",
            borderRightWidth: 1,
            borderColor: "#000",
        },
        lastCell: {
            borderRightWidth: 0,
        },
        cellRight: {
            textAlign: "right",
        },

        lineBox: {
            borderTopWidth: 2,
            borderBottomWidth: 2,
            paddingVertical: 4,
            marginVertical: 8,
            textAlign: "center",
        },
        lineBoxBottom: {
            borderBottomWidth: 2,
            paddingVertical: 6,
            marginVertical: 8,
            textAlign: "center",
        },

        footerContainer: {
            paddingHorizontal: 8,
            fontSize: 9,
        },
        thankYouText: {
            textAlign: "center",
        },
        footerContent: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 5,
        },
        leftColumn: {
            width: "48%",
            textAlign: "center",
        },
        rightColumn: {
            width: "48%",
        },
        signatureLine: {
            marginBottom: 2,
            borderBottom: "1px solid #000",
            width: "100%",
            textAlign: "center",
            marginTop: 50,
        },
        cajeroText: {
            marginBottom: 2,
            fontSize: 10,
        },
        locationText: {
            marginBottom: 5,
        },
        moneyRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
        },
        leftText: {
            fontSize: 10,
            padding: 3,
            textAlign: "left",
            flex: 1,
        },
        rightText: {
            fontSize: 10,
            padding: 3,
            textAlign: "right",
            flex: 1,
        },
        warningText: {
            fontStyle: "italic",
            textAlign: "right",
            bottom: 35,
        },
        securityCode: {
            fontSize: 7,
            textAlign: "right",
            bottom: 35,
        },
        qrBox: {
            borderWidth: 1,
            width: 55,
            height: 55,
            marginTop: 0,
            justifyContent: "center",
            alignItems: "center",
        },

        diagonalBackground: {
            position: "absolute",
            bottom: 39,
            left: 0,
            width: "100%",
            height: 180,
            right: 0,
            opacity: 0.55,
            zIndex: -1,
            paddingLeft: 15,
            paddingRight: 20,
        },
    });

    const getDatos = async (idRecibo: number, idContrato: number, tipoPago: number) => {
        // setDatosReciboCabecera([]);
        // setDatosRecibo
        // setDatosApi([]);
        if (idRecibo !== undefined && idContrato !== undefined && tipoPago !== undefined) {
            try {
                const response = await fetch(
                    `/api/dashboard/caja/getDatosRecibo/getCabecera?idContrato=${idContrato}&idRecibo=${idRecibo}&tipoPago=${tipoPago}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setMontoEnLetras(ConvierteALetras());
                const movimiento = data.datosCabecera.datosMovimientos.find((mov: any) => mov.id_tipo_movimiento === 4);
                setPDescInteres(parseFloat(movimiento.descuento_interes));
                setPDescMensualidad(parseFloat(movimiento.descuento_mensualidad));
                setMontoEfectivo(parseFloat(movimiento.monto_efectivo));
                setMontoDLS(parseFloat(movimiento.monto_dlls));
                setMontoCheque(parseFloat(movimiento.monto_cheque));
                setReferencia(movimiento.referencia);
                setTotalRecibo(parseFloat(movimiento.monto));
                setTipoCambioDlls(movimiento.tipo_cambio);

                const fecha = moment(movimiento.fecha_movimiento_format, "DD/MM/YYYY");
                setFechaRecibo(`Mexicali, Baja California, a ${fecha.format("DD")} de ${fecha.format("MMMM")} de ${fecha.format("YYYY")}`);

                setDatosRecibo(data);
                // setDatosApi(data);
            } catch (error) {
                console.error("Error al obtener datos recibo:", error);
            }
        }
    };

    // const ConvierteALetras = (num: any) => {
    const ConvierteALetras = () => {
        let res: string = "";
        let num = datosRecibo?.datosCabecera?.saldosRecibo?.total;
        let dec = "";
        let entero;
        let decimales;
        let moneda = " M.N.";
        let nro: number = 0;
        let centavos = " PESOS 00/100";
        // setDatosRecibo(datosRecibo);
        // console.log("dataRecibo", data_recibo.moneda);
        const tipoMoneda = datosRecibo?.datosCabecera?.datosEmpresa?.[0].moneda;
        if (num === undefined || num === null) {
            return "";
        }

        if (tipoMoneda !== 0) {
            centavos = " 00/100";
            moneda = " DLLS.";
        }

        try {
            nro = num; // Usamos parseFloat para convertir el string a número
            if (nro % 1 !== 0) {
                centavos = "";
            }
            if (isNaN(nro)) {
                // Verificar si la conversión resultó en NaN
                return "";
            }
        } catch (e) {
            return ""; // En JavaScript, parseFloat no lanza errores por formato inválido, pero lo dejamos por consistencia
        }

        entero = Math.trunc(nro); // Obtener la parte entera
        decimales = Math.round((nro - entero) * 100); // Obtener los decimales y redondear
        // Asegurarse de que los decimales sean un número entero de dos dígitos
        decimales = Math.min(99, Math.max(0, decimales)); // Limitar entre 0 y 99

        if (decimales > 0) {
            let deci = decimales.toString();
            if (deci.length < 2) {
                deci = "0" + deci; // Asegurar que siempre tenga dos dígitos
            }
            dec = " CON " + deci + "/100";
        }

        res = toText(entero) + dec + moneda;
        return res;
    };

    function toText(value: number): string {
        let Num2Text = "";

        if (value === 0) Num2Text = "CERO";
        else if (value === 1) Num2Text = "UNO";
        else if (value === 2) Num2Text = "DOS";
        else if (value === 3) Num2Text = "TRES";
        else if (value === 4) Num2Text = "CUATRO";
        else if (value === 5) Num2Text = "CINCO";
        else if (value === 6) Num2Text = "SEIS";
        else if (value === 7) Num2Text = "SIETE";
        else if (value === 8) Num2Text = "OCHO";
        else if (value === 9) Num2Text = "NUEVE";
        else if (value === 10) Num2Text = "DIEZ";
        else if (value === 11) Num2Text = "ONCE";
        else if (value === 12) Num2Text = "DOCE";
        else if (value === 13) Num2Text = "TRECE";
        else if (value === 14) Num2Text = "CATORCE";
        else if (value === 15) Num2Text = "QUINCE";
        // Corregimos la lógica: 'DIECI' + texto de la unidad (ej. DIECISÉIS)
        else if (value < 20) Num2Text = "DIECI" + toText(value - 10);
        else if (value === 20) Num2Text = "VEINTE";
        // Corregimos la lógica: 'VEINTI' + texto de la unidad (ej. VEINTICINCO)
        else if (value < 30) Num2Text = "VEINTI" + toText(value - 20);
        else if (value === 30) Num2Text = "TREINTA";
        else if (value === 40) Num2Text = "CUARENTA";
        else if (value === 50) Num2Text = "CINCUENTA";
        else if (value === 60) Num2Text = "SESENTA";
        else if (value === 70) Num2Text = "SETENTA";
        else if (value === 80) Num2Text = "OCHENTA";
        else if (value === 90) Num2Text = "NOVENTA";
        else if (value < 100) Num2Text = toText(Math.trunc(value / 10) * 10) + " Y " + toText(value % 10);
        else if (value === 100) Num2Text = "CIEN";
        else if (value < 200) Num2Text = "CIENTO " + toText(value - 100);
        // Casos específicos para centenas con "CIENTOS" (200, 300, 400, 600, 800)
        else if (value === 200 || value === 300 || value === 400 || value === 600 || value === 800) {
            // En C# esto era toText(Math.Truncate(value / 100)) + "CIENTOS";
            // Aquí necesitamos manejar los prefijos "DOS", "TRES", etc.
            // Se puede hacer de forma más eficiente sin la recursión en toText para estos casos exactos.
            // Pero para mantener la lógica original, asumimos que toText(2) retorna "DOS" etc.
            Num2Text = toText(Math.trunc(value / 100)) + "CIENTOS";
        } else if (value === 500) Num2Text = "QUINIENTOS";
        else if (value === 700) Num2Text = "SETECIENTOS";
        else if (value === 900) Num2Text = "NOVECIENTOS";
        else if (value < 1000) Num2Text = toText(Math.trunc(value / 100) * 100) + " " + toText(value % 100);
        else if (value === 1000) Num2Text = "MIL";
        else if (value < 2000) Num2Text = "MIL " + toText(value % 1000);
        else if (value < 1000000) {
            Num2Text = toText(Math.trunc(value / 1000)) + " MIL";
            if (value % 1000 > 0) Num2Text = Num2Text + " " + toText(value % 1000);
        } else if (value === 1000000) Num2Text = "UN MILLON";
        else if (value < 2000000) Num2Text = "UN MILLON " + toText(value % 1000000);
        else if (value < 1000000000000) {
            // Hasta Billones (Millions in Spanish)
            Num2Text = toText(Math.trunc(value / 1000000)) + " MILLONES ";
            if (value - Math.trunc(value / 1000000) * 1000000 > 0)
                Num2Text = Num2Text + " " + toText(value - Math.trunc(value / 1000000) * 1000000);
        } else if (value === 1000000000000) Num2Text = "UN BILLON";
        else if (value < 2000000000000) Num2Text = "UN BILLON " + toText(value - Math.trunc(value / 1000000000000) * 1000000000000);
        else {
            // Para números mayores a un billón
            Num2Text = toText(Math.trunc(value / 1000000000000)) + " BILLONES";
            if (value - Math.trunc(value / 1000000000000) * 1000000000000 > 0)
                Num2Text = Num2Text + " " + toText(value - Math.trunc(value / 1000000000000) * 1000000000000);
        }
        return Num2Text;
    }

    useEffect(() => {
        // datos(idRecibo, idContrato);
        getDatos(idRecibo, idContrato, data_recibo.tipo_pago);
        // datosCabecera(36687, 13665, 1);
    }, []);
    useEffect(() => {
        console.log("pDescInteres");
        console.log(pDescInteres);
        console.log("pDescMensualidad");
        console.log(pDescMensualidad);
    }, [pDescInteres, pDescMensualidad, fechaRecibo]);

    // useEffect(() => {
    //     datosRecibo = datosApi;
    // }, [datosApi]);
    useEffect(() => {
        console.log("datosRecibo");
        console.log(JSON.stringify(datosRecibo, null, 2));
    }, [datosRecibo]);

    const ReciboPDF = () => {
        // const datos = useState<any[]>([]);
        if (datosRecibo !== undefined || datosRecibo !== null) {
            return (
                <Document>
                    <Page style={styles.page} orientation="portrait" size={[612, 540]}>
                        {/* Header Section: Logo on the left, Info block on the right */}
                        <View style={styles.headerSection}>
                            {/* Logo */}
                            <Image style={styles.logo} src={logoGL.src} />

                            {/* Information Aligned to the Right of the Logo */}
                            <View style={styles.headerInfo}>
                                {/* Folio number */}

                                {/* Company Information */}
                                <View style={styles.headerText}>
                                    <Text style={styles.bold}>{datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.razon_social}</Text>
                                    <Text>{datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.rfc}</Text>
                                    <Text>{datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.direccion}</Text>
                                    <Text>
                                        {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.ciudad},{" "}
                                        {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.estado}, C.P.{" "}
                                        {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.cp}
                                    </Text>
                                    <Text>Tel: {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.telefono_principal}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Cliente y montos */}
                        <View style={styles.row}>
                            <View>
                                <Text>Recibimos de: {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.nombre_cliente}</Text>
                                <Text>
                                    Clave terreno: {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.nomenclatura}-
                                    {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.no_manzana}-
                                    {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.no_terreno}
                                </Text>
                                <Text>Fecha contrato: {datosRecibo?.datosCabecera?.datosEmpresa?.[0]?.fecha_contrato}</Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={{ marginBottom: 1 }}>{datosRecibo?.prefolio}</Text>
                                <Text>
                                    Bueno por:
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(datosRecibo?.datosCabecera?.saldosRecibo?.total))}
                                </Text>
                                <Text>
                                    Saldo:{" "}
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(datosRecibo?.datosCabecera?.saldosRecibo?.saldo))}
                                </Text>
                            </View>
                        </View>

                        {/* Monto en letras */}
                        <View style={styles.lineBox}>
                            {/* <Text style={{ fontWeight: "bold" }}>SON: DIECIOCHO MIL OCHOCIENTOS TREINTA Y CINCO CON 98/100 M.N.</Text> */}
                            <Text style={{ fontWeight: "bold" }}>SON: {montoEnLetras}</Text>
                        </View>

                        <Text>Por concepto de:</Text>

                        {/* Tabla */}
                        {datosRecibo?.datosResumen == null ? (
                            <View style={styles.tableContainer}>
                                {/* Renderiza la fila de encabezados */}
                                <View style={[styles.tableRow, styles.headerRow]}>
                                    {datosRecibo?.tablaConceptos[0].map((item, cellIndex) => (
                                        <Text style={styles.cell} key={cellIndex}>
                                            {item}
                                        </Text>
                                    ))}
                                </View>

                                {/* Renderiza las filas con datos */}
                                {datosRecibo?.tablaConceptos.slice(1).map((row, rowIndex) => (
                                    <View style={styles.tableRow} key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <Text
                                                key={cellIndex}
                                                style={[
                                                    styles.cell,
                                                    cellIndex > 1 ? styles.cellRight : {}, // Aplica alineación derecha a columnas después de la 2da
                                                ]}
                                            >
                                                {cell === "" ? " " : cell}
                                            </Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.tableContainer}>
                                {datosRecibo?.datosResumen.rMensualidades[0].monto != null ? (
                                    <Text>
                                        Pago de {datosRecibo.datosResumen.rMensualidades[0].mensualidades} comprendidas del{" "}
                                        {datosRecibo.datosResumen.rMensualidades[0].fec_inicio} al{" "}
                                        {datosRecibo?.datosResumen.rMensualidades[0].fec_fin} ={" "}
                                        {new Intl.NumberFormat("es-MX", {
                                            style: "currency",
                                            currency: "MXN",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(Number(datosRecibo?.datosResumen.rMensualidades[0].monto))}
                                    </Text>
                                ) : (
                                    <Text></Text>
                                )}
                                {datosRecibo?.datosResumen.rIntereses[0].monto != null ? (
                                    <Text>
                                        Pago de {datosRecibo?.datosResumen.rIntereses[0].mensualidades} mes(es) de inter&eacute;s
                                        comprendido del {datosRecibo?.datosResumen.rIntereses[0].fec_inicio} al{" "}
                                        {datosRecibo?.datosResumen.rIntereses[0].fec_fin} ={" "}
                                        {new Intl.NumberFormat("es-MX", {
                                            style: "currency",
                                            currency: "MXN",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(Number(datosRecibo?.datosResumen.rIntereses[0].monto))}
                                    </Text>
                                ) : (
                                    <Text></Text>
                                )}
                                {datosRecibo?.datosResumen.rServicios[0].monto != null ? (
                                    <Text>
                                        Pago de servicios =
                                        {new Intl.NumberFormat("es-MX", {
                                            style: "currency",
                                            currency: "MXN",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(Number(datosRecibo?.datosResumen.rServicios[0].monto))}
                                    </Text>
                                ) : (
                                    <Text></Text>
                                )}
                            </View>
                        )}

                        {datosRecibo?.datosDescuentos.descuentoInteres != null ? (
                            <View style={{ fontSize: 9 }}>
                                <Text>
                                    Descuento en interés (
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(datosRecibo?.datosDescuentos.descuentoInteres))}
                                    -{" "}
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(datosRecibo?.datosCabecera.saldosRecibo.descuento_interes))}{" "}
                                    =
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(
                                        Number(datosRecibo?.datosDescuentos.descuentoInteres) -
                                            Number(datosRecibo?.datosCabecera.saldosRecibo.descuento_interes)
                                    )}{" "}
                                    )({pDescInteres}%)
                                </Text>
                            </View>
                        ) : (
                            <View></View>
                        )}
                        {datosRecibo?.datosDescuentos.descuentoMensualidad != null ? (
                            <View>
                                <Text>
                                    Descuento en depósito (
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(datosRecibo?.datosDescuentos.descuentoMensualidad))}
                                    -{" "}
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(datosRecibo?.datosCabecera.saldosRecibo.descuento_mensualidad))}{" "}
                                    =
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(
                                        Number(datosRecibo?.datosDescuentos.descuentoMensualidad) -
                                            Number(datosRecibo?.datosCabecera.saldosRecibo.descuento_mensualidad)
                                    )}{" "}
                                    )({pDescMensualidad}%)
                                </Text>
                            </View>
                        ) : (
                            <View></View>
                        )}
                        <View />
                        <View style={styles.lineBoxBottom} />
                        {/* <Image
                            style={styles.diagonalBackground}
                            src={securityBackground} // ← ejemplo de patrón diagonal
                            fixed
                        /> */}
                        <Image style={styles.diagonalBackground} src={securityBackground.src} />

                        <View style={styles.footerContainer}>
                            <Text style={styles.thankYouText}>
                                GRACIAS POR INVERTIR EN UN FRACCIONAMIENTO DE GRUPO LOTIFICADORA, SU FAMILIA MERECE LO MEJOR.
                            </Text>

                            <View style={styles.footerContent}>
                                {/* Columna izquierda: firma, cajero y QR */}
                                <View style={styles.leftColumn}>
                                    <Text style={styles.signatureLine}></Text>
                                    <Text style={styles.cajeroText}>Cajero: {datosRecibo?.cajero}</Text>
                                    <Text style={styles.locationText}>{fechaRecibo}</Text>

                                    <View style={styles.qrBox}>
                                        <Text style={{ fontSize: 6 }}>QR</Text>
                                    </View>
                                </View>

                                {/* Columna derecha: montos alineados */}
                                <View style={styles.rightColumn}>
                                    <View style={styles.moneyRow}>
                                        <Text style={styles.leftText}>Efectivo M.N. </Text>
                                        <Text style={styles.rightText}>
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(montoEfectivo))}
                                        </Text>
                                    </View>
                                    <View style={styles.moneyRow}>
                                        <Text style={styles.leftText}>Dólares TC ({tipoCambioDlls}) </Text>
                                        <Text style={styles.rightText}>
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(montoDLS))}
                                        </Text>
                                    </View>
                                    <View style={styles.moneyRow}>
                                        <Text style={styles.leftText}>Cheque / Tarjeta M.N. </Text>
                                        <Text style={styles.rightText}>
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(montoCheque))}
                                        </Text>
                                    </View>
                                    <View style={styles.moneyRow}>
                                        <Text style={styles.leftText}>No. y banco </Text>
                                        <Text style={styles.rightText}>{referencia !== null ? "" : referencia}</Text>
                                    </View>
                                    <View style={styles.moneyRow}>
                                        <Text style={[styles.leftText, styles.bold]}>Total </Text>
                                        <Text style={[styles.rightText, styles.bold]}>
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(datosRecibo?.datosCabecera?.saldosRecibo?.total))}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.warningText}>"ESTE RECIBO NO SERA VALIDO SIN EL SELLO Y FIRMA DEL CAJERO"</Text>

                            <Text style={styles.securityCode}>
                                *Cadena de Seguridad: 564fde1e3eac91b9d8784a4a97cb73ee791a3a9a005bf2ead538010854b1d6d9*
                            </Text>
                        </View>
                    </Page>
                </Document>
            );
        } else {
            return <p>Cargando...</p>;
        }
    };
    const handleDatos = () => {
        getDatos(idRecibo, idContrato, data_recibo.tipo_pago);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={handleDatos}>
                    <Receipt className="mr-2 h-4 w-4" /> #{idRecibo} {/* Display actual ID */}
                </Button>
            </DialogTrigger>

            {/* Contenido del Diálogo */}
            <DialogContent className="min-w-[80%] w-[full-content] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="uppercase text-center bg-slate-200 p-2 rounded-t-lg">Recibo #123</DialogTitle>
                    <DialogDescription className="uppercase border-orange-400 border-l-4 text-left p-2 mt-2">
                        Contrato #123
                    </DialogDescription>
                </DialogHeader>

                {/* Contenedor del PDFViewer */}
                <div style={{ flexGrow: 1, height: "calc(90vh - 200px)", border: "1px solid #ccc", overflow: "hidden" }}>
                    <PDFViewer width="100%" height="100%">
                        {datosRecibo !== undefined && datosRecibo !== null ? <ReciboPDF /> : <p>Cargando...</p>}
                        {/* <ReciboPDF /> */}
                    </PDFViewer>
                </div>

                {/* Footer del Diálogo */}
                <DialogFooter className="flex justify-end p-4 border-t mt-4">
                    <Button className="mr-2" disabled>
                        <Printer className="mr-2 h-4 w-4" /> Imprimir Recibo
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cerrar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
