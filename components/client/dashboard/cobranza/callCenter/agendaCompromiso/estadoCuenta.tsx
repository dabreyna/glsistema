"use client";

import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface EstadoCuentaProps {
    idContrato: string;
}
interface EstadoCuenta {
    precio_actual: string;
    precio_original: string;
    precio_ajustado: string;
    pagos: string;
    pagado: string;
    saldo: string;
    moneda: string;
    mensualidad_actual: string;
    deposito: string;
    mes_ajuste: string;
    primer_pago: string;
    financiamiento: string;
    superficie: string;
}

export function EstadoCuenta({ idContrato }: EstadoCuentaProps) {
    const [datosCliente, setDatosCliente] = useState<EstadoCuenta[]>([]);
    // const [isOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/callCenter/estadoCuenta?idContrato=${idContrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setDatosCliente(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (idContrato != "0" && idContrato != undefined) {
            fetchData();
        }
    }, [idContrato]);
    let consecutivo = 0;
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-black border border-primary-500 rounded-md p-2 bg-muted">
                {/* Group 1: Personal Info */}
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Precio Actual</Label>
                    <span className="text-gray-900">
                        {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(datosCliente[0]?.precio_actual || 0))}
                    </span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Precio Original</Label>
                    <span className="text-gray-900">
                        {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(datosCliente[0]?.precio_original || 0))}
                    </span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Precio Ajustado</Label>
                    <span className="text-gray-900">
                        {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(datosCliente[0]?.precio_ajustado || 0))}
                    </span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Pagos</Label>
                    <span className="text-gray-900">{datosCliente[0]?.pagos || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Pagado</Label>
                    <span className="text-gray-900">
                        {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(datosCliente[0]?.pagado || 0))}
                    </span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Saldo</Label>
                    <span className="text-gray-900">
                        {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(datosCliente[0]?.saldo || 0))}
                    </span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Moneda</Label>
                    <span className="text-gray-900">{datosCliente[0]?.moneda || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Mensualidad Actual</Label>
                    <span className="text-gray-900">
                        {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(datosCliente[0]?.mensualidad_actual || 0))}
                    </span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Deposito</Label>
                    <span className="text-gray-900">
                        {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(datosCliente[0]?.deposito || 0))}
                    </span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Mes a Juste</Label>
                    <span className="text-gray-900">{datosCliente[0]?.mes_ajuste || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Primer Pago</Label>
                    <span className="text-gray-900">{datosCliente[0]?.primer_pago || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Financiamiento</Label>
                    <span className="text-gray-900">{datosCliente[0]?.financiamiento || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Superficie</Label>
                    <span className="text-gray-900">
                        {new Intl.NumberFormat("es-MX", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(datosCliente[0]?.superficie || 0))}{" "}
                        m2
                    </span>
                </div>
            </div>
        </>
    );
}
