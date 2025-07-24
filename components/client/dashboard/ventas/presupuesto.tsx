import Image from "next/image";
import "moment/locale/es";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import logoLotificadora from "@/public/logo.png";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import TablaDeSaldosVencidos from "@/components/client/dashboard/reportes/estadoDeCuenta/tablaDeSaldosVencidos";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import moment from "moment";
import CorridaDePagos from "./corridaPagos";

interface Empresa {
    nombre: string;
    calle: string;
    ciudad: string;
    estado: string;
    cp: string;
    telefono_principal: string;
}

interface TerrenoProspecto {
    fraccionamiento: string;
    no_manzana: string;
    no_terreno: string;
    superficie: string;
}
interface CorridaPago {
    num_pago: number;
    mensualidad: string;
    saldo: string;
    fecha: string;
}

interface PresupuestoProps {
    idU: string;
    ab: string;
    nombre: string;
    aP: string;
    aM: string;
    email: string;
    idFraccionamiento: string;
    manzana: string;
    idTerreno: string;
    precio: string;
    numPagos: string;
    mensualidad: string;
    pinicial: string;
    idFinanciamiento: string;
    fechaInicial: string;
}
interface AjusteAnual {
    bnd_ajuste_anual: string;
    porcentaje_ajuste_anual: string;
}
export function Presupuesto({
    idU,
    ab,
    nombre,
    aP,
    aM,
    email,
    idFraccionamiento,
    manzana,
    idTerreno,
    precio,
    numPagos,
    mensualidad,
    pinicial,
    idFinanciamiento,
    fechaInicial,
}: PresupuestoProps) {
    // console.log("id: " + id);
    const [dataEmpresa, setDataEmpresa] = useState<Empresa[]>([]);
    const [fraccionamiento, setFraccionamiento] = useState<String>("");
    const [terreno, setTerreno] = useState<TerrenoProspecto[]>([]);
    const [financiamiento, setFinanciamiento] = useState<string>("");
    const [ajusteAnual, setAjusteAnual] = useState<AjusteAnual[]>([]);
    function print() {
        // window.print();
        // document.getElementById("tablaDatos").style.display = "none";
    }
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/reportes/estadoDeCuenta/detalles/datosEmpresa?idContrato=${idTerreno}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setDataEmpresa(data);
        } catch (error) {
            console.error(error);
        }

        try {
            const response = await fetch(`/api/dashboard/ventas/prospecto/datosTerreno?id=${idTerreno}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setTerreno(data);
            // console.log("fraccionamiento: " + fraccionamiento);
        } catch (error) {
            console.error(error);
        }
        try {
            const response = await fetch(`/api/dashboard/ventas/prospecto/nombreFinanciamiento?id=${idFinanciamiento}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setFinanciamiento(data[0]?.financiamiento);
            // console.log("fraccionamiento: " + fraccionamiento);
        } catch (error) {
            console.error(error);
        }
        try {
            const response = await fetch(`/api/dashboard/ventas/prospecto/ajusteAnual?id=${idFinanciamiento}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setAjusteAnual(data);
            // console.log("--->" + data[0].rows);
        } catch (error) {
            console.error(error);
        }
        // fetchData();
    };

    function getMesAjusteAnual() {
        //los meses fueron indicados de acuerdo al calendario de la empresa.

        const mes = moment(fechaInicial, "DD/MM/YYYY").month() + 1; //se agrega 1 para que el mes comience en 1 ya que jscript comienza en 0
        // console.log(mes);
        let mes_ajuste = 0;
        switch (mes) {
            case 9:
            case 10:
            case 11:
                mes_ajuste = 7;
                break;
            case 12:
            case 1:
            case 2:
                mes_ajuste = 10;
                break;
            case 3:
            case 4:
            case 5:
                mes_ajuste = 1;
                break;
            case 6:
            case 7:
            case 8:
                mes_ajuste = 4;
                break;
        }
        // console.log("MES AJUSTE: " + mes_ajuste);
        return mes_ajuste;
    }
    function generaCorridaDePagos() {
        const mes_ajuste = getMesAjusteAnual();
        const bnd_ajuste = ajusteAnual[0]?.bnd_ajuste_anual;
        // console.log("mes_ajuste: " + mes_ajuste);
        // console.log("bnd_ajuste: " + bnd_ajuste);
        const porcentaje_ajuste = Number(ajusteAnual[0]?.porcentaje_ajuste_anual);
        const num_pagos = Number(numPagos);
        const precio_terreno = Number(precio);
        const pago_inicial = Number(pinicial);
        const total_terreno = Number(precio_terreno - pago_inicial);
        let mensualidad_inicial = Number(mensualidad);
        const tCorrida: CorridaPago[] = [];
        const fecha = moment(fechaInicial, "DD/MM/YYYY");
        let saldo: number = total_terreno;

        for (let x = 1; x <= num_pagos; x++) {
            if (bnd_ajuste) {
                const fechaPago = moment(fecha).add(x - 1, "months");

                if (fechaPago.month() + 1 === mes_ajuste) {
                    saldo = saldo * (1 + porcentaje_ajuste / 100);
                    mensualidad_inicial = mensualidad_inicial * (1 + porcentaje_ajuste / 100);
                }
            }

            if (num_pagos !== x) {
                saldo = saldo - mensualidad_inicial;
            } else {
                mensualidad_inicial = saldo;
                saldo = saldo - mensualidad_inicial;
            }

            const fila: CorridaPago = {
                num_pago: x,
                mensualidad: mensualidad_inicial.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                }),
                saldo: saldo.toLocaleString("es-MX", { style: "currency", currency: "MXN" }),
                fecha: moment(fecha)
                    .add(x - 1, "months")
                    .format("DD/MM/YYYY"),
            };

            tCorrida.push(fila);
        }
        // console.table(tCorrida);
        return tCorrida;
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={fetchData} className="p-6 uppercase">
                    Presupuesto
                </Button>
            </DialogTrigger>
            <DialogContent className=" md:max-w-full sm:min-w-[430px] lg:max-w-[95%] h-[90%]">
                <ScrollArea className="h-6/6 w-full rounded-md border p-4">
                    <DialogHeader>
                        <DialogTitle className="text-center uppercase">{/* Presupuesto {ab} {nombre} {aP} {aM} */}</DialogTitle>
                        <DialogDescription>
                            <div className="grid gap-4 py-4 grid-cols-3" id="tablaDatos2">
                                <div className="flex flex-col items-center">
                                    <Image src={logoLotificadora} alt="Grupo Lotificadora" className="w-[170px] h-[130px] transition-all" />
                                </div>
                                <div className="flex flex-col col-span-2">
                                    <div className="text-left">
                                        <p className="text-xl font-bold">
                                            {" "}
                                            {dataEmpresa[0]?.nombre}
                                            <br />
                                            {dataEmpresa[0]?.calle}
                                            <br />
                                            {dataEmpresa[0]?.ciudad},{dataEmpresa[0]?.estado} C.P. {dataEmpresa[0]?.cp}
                                            <br />
                                            TEL&Eacute;FONO: 686 -{" "}
                                            <span className="text-blue-500">{dataEmpresa[0]?.telefono_principal}</span>
                                        </p>
                                    </div>
                                </div>
                                <Separator className="col-span-3" />
                                <div className="flex flex-col col-span-3">
                                    <div className="grid gap-1 px-4 py-1 grid-cols-6 place-items-stretch">
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            {ab} {"  "} {nombre} {aP} {aM}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            presupuesto al: {"  "} {moment(new Date()).format(`dddd DD [de] MMMM [del] YYYY`)}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            email: {"  "} {email}
                                        </span>
                                    </div>
                                    <div className="grid gap-1 px-4 py-1 grid-cols-6 place-items-stretch">
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            FRACCIONAMIENTO: {"  "} {terreno[0]?.fraccionamiento}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            MANZANA: {"  "} {terreno[0]?.no_manzana}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            TERRENO: {"  "} {terreno[0]?.no_terreno}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            SUPERFICIE: {"  "} {Number(terreno[0]?.superficie)} m2
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            PRECIO: {"  "}{" "}
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(precio))}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            NUMERO PAGOS: {"  "} {Number(numPagos)}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            MENSUALIDAD: {"  "} {Number(mensualidad)}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            PAGO INICIAL: {"  "}{" "}
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(pinicial))}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            FINANCIAMIENTO: {"  "} {financiamiento}
                                        </span>
                                        <span className="text-sm col-span-2 row-span-2 uppercase">
                                            FECHA INICIAL: {"  "} {fechaInicial}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 grid-cols-1 text-center place-items-center">
                        <Separator className="my-1" />
                        <div className="grid grid-cols-1 text-center gap-6">
                            <span className="text-sm text-center">
                                CORRIDA DE PAGOS
                                {/* <Separator className="my-4" /> */}
                                <CorridaDePagos tablaPagos={generaCorridaDePagos()} />
                            </span>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <SheetClose asChild>
                        <Button
                            onClick={() => {
                                function print() {
                                    // Get the element to be printed
                                    const elementToPrint = document.getElementById("tablaDatos2");

                                    // Create a temporary container
                                    const tempElement = document.createElement("div");

                                    // Append the element to the temporary container
                                    tempElement.appendChild(elementToPrint!.cloneNode(true)); // Clone to avoid modifying original

                                    // Optional: Adjust styles for printing
                                    tempElement.style.cssText = `
                      font-size: 10px; 
                      margin: 20px; 
                      page-break-after: always; 
                    `;

                                    // Add the temporary element to the document (temporarily)
                                    document.body.appendChild(tempElement);

                                    // Trigger the print dialog
                                    window.print();

                                    // Remove the temporary element
                                    document.body.removeChild(tempElement);
                                }
                            }}
                        >
                            Imprimir
                        </Button>
                    </SheetClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
