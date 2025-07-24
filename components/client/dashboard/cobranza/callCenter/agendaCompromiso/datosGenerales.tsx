"use client";

import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface DatosGeneralesProps {
    idContrato: string;
}
interface DatosGenerales {
    nombre_cliente: string;
    fecha_contrato: string;
    tel_casa: string;
    tel_trabajo: string;
    tel_cel: string;
    email: string;
    fecha_nacimiento: string;
    estado_civil: string;
    conyuge: string;
    estatus_contrato: string;
    medio: string;
    terreno: string;
}

export function DatosGenerales({ idContrato }: DatosGeneralesProps) {
    const [datosCliente, setDatosCliente] = useState<DatosGenerales[]>([]);
    // const [isOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/callCenter/datosGenerales?idContrato=${idContrato}`);
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

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-black border border-primary-500 rounded-md p-2 bg-muted">
                {/* Group 1: Personal Info */}
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Nombre</Label>
                    <span className="text-gray-900">{datosCliente[0]?.nombre_cliente || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Fecha Contrato</Label>
                    <span className="text-gray-900">{datosCliente[0]?.fecha_contrato || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Fecha Nacimiento</Label>
                    <span className="text-gray-900">{datosCliente[0]?.fecha_nacimiento || "N/A"}</span>
                </div>

                {/* Group 2: Contact Info */}
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Tel. Casa</Label>
                    <span className="text-gray-900">{datosCliente[0]?.tel_casa || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Tel. Oficina</Label>
                    <span className="text-gray-900">{datosCliente[0]?.tel_trabajo || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Tel. Celular</Label>
                    <span className="text-gray-900">{datosCliente[0]?.tel_cel || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Email</Label>
                    <span className="text-gray-900">{datosCliente[0]?.email || "N/A"}</span>
                </div>

                {/* Group 3: Contract/Marital Status/Origin */}
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Estatus Contrato</Label>
                    <span className="text-gray-900">{datosCliente[0]?.estatus_contrato || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Estado Civil</Label>
                    <span className="text-gray-900">{datosCliente[0]?.estado_civil || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Cónyuge</Label>
                    <span className="text-gray-900">{datosCliente[0]?.conyuge || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Como se enteró</Label>
                    <span className="text-gray-900">{datosCliente[0]?.medio || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <Label className="font-bolder text-black uppercase">Terreno</Label>
                    <span className="text-gray-900">{datosCliente[0]?.terreno || "N/A"}</span>
                </div>
            </div>
        </>
    );
}
