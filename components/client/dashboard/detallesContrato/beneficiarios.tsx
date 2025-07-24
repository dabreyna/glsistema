"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";
import { useEffect, useState } from "react";
import { EditarBeneficiario } from "./editarBeneficiario";
import { NuevoBeneficiario } from "./nuevoBeneficiario";

interface datosBeneficiario {
    id_beneficiario: any;
    abreviatura: string | null;
    nombre: string;
    ap_paterno: string | null;
    ap_materno?: string | null;
    fecha_nacimiento: string | null;
    lugar_nacimiento?: string | null;
    ocupacion?: string | null;
    calle?: string | null;
    numero?: any | null;
    entre?: any | null;
    ciudad?: string | null;
    cp?: any | null;
    colonia?: string | null;
    estado?: string | null;
    pais?: string | null;
    tel_cod_casa?: string | null;
    tel_casa?: string | null;
    tel_cod_cel?: string | null;
    tel_cel?: string | null;
    tel_cod_trabajo?: string | null;
    tel_trabajo?: string | null;
    email?: string | null;
    lugar_trabajo?: string | null;
    conyuge?: string | null;
    estado_civil?: string | null;
    nacionalidad?: string | null;
    parentesco?: string | null;
}
interface listadoBeneficiarios {
    Beneficiarios: datosBeneficiario[];
}
interface EstadoCivil {
    id_estado: string;
    estado: string;
}
interface BeneficiarioProps {
    listaEstadosCivil: EstadoCivil[];
    idUsuario: string;
}

export default function Beneficiarios({ listaEstadosCivil, idUsuario }: BeneficiarioProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [data, setData] = useState<datosBeneficiario[]>([]);
    // const idCliente = useContratoSelectedStore((state) => state.idCliente);
    const idContrato = useContratoSelectedStore((state) => state.idContrato);
    const idTerreno = useContratoSelectedStore((state) => state.idTerreno);

    const handleGuardarCambios = (newData: datosBeneficiario[]) => {
        const index = data.findIndex((beneficiario) => beneficiario.id_beneficiario === newData[0].id_beneficiario);
        const newBeneficiarios = [...data];
        newBeneficiarios[index] = newData[0];
        setData(newBeneficiarios);

        //setData(newData);
        console.log("guardando cambios");
    };

    useEffect(() => {
        // if(isMounted){
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/detallesContrato/datosBeneficiario?idContrato=${idContrato}`);
                // const terreno = await fetch(`/api/dashboard/detallesContrato/datosTerreno?idTerreno=${idContrato}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setData(data);
                // if(!terreno.ok){
                //     throw new Error(`Failed to fetch data: ${terreno.status}`);
                // }
                // const terrenoData = await terreno.json();
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        // } else {
        //   setIsMounted(true);
        // }
    }, [idContrato, isMounted]);
    // console.log(data)
    return (
        <>
            {data ? (
                <>
                    <NuevoBeneficiario
                        idContrato={Number(idContrato)}
                        idUsuario={Number(idUsuario)}
                        idTerreno={Number(idTerreno)}
                        listaEstadosCivil={listaEstadosCivil}
                    />
                    {data.map((beneficiario) => (
                        <Card key={beneficiario.id_beneficiario}>
                            <CardHeader>
                                <CardTitle>
                                    Beneficiario:{" "}
                                    <span className="text-sm">
                                        {beneficiario.abreviatura} {beneficiario.nombre} {beneficiario.ap_paterno}{" "}
                                        {beneficiario?.ap_materno}
                                    </span>
                                </CardTitle>
                                <CardDescription className="space-y-2 text-gray-700 font-medium"></CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="container mx-auto px-4">
                                    <div className="grid md:grid-cols-2 gap-4  xs:grid-cols-1">
                                        <div>
                                            {/* <span className="text-sm uppercase"><b></b> <span className="text-xs normal-case">{copropietario.abreviatura}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Nombre:</b> <span className="text-xs normal-case">{copropietario.nombre} {copropietario.ap_paterno} {copropietario?.ap_materno}</span></span>
                                        <br /> */}
                                            <span className="text-sm uppercase">
                                                <b>Fecha de Nacimiento:</b>{" "}
                                                <span className="text-xs normal-case">{beneficiario.fecha_nacimiento}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Lugar de Nacimiento:</b>{" "}
                                                <span className="text-xs normal-case">{beneficiario.lugar_nacimiento}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Ocupacion:</b> <span className="text-xs normal-case">{beneficiario.ocupacion}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Calle:</b> <span className="text-xs normal-case">{beneficiario.calle}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Numero:</b> <span className="text-xs normal-case">{beneficiario.numero}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Entre:</b> <span className="text-xs normal-case">{beneficiario.entre}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Ciudad:</b> <span className="text-xs normal-case">{beneficiario.ciudad}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Codigo Postal:</b> <span className="text-xs normal-case">{beneficiario.cp}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Colonia:</b> <span className="text-xs normal-case">{beneficiario.colonia}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Estado:</b> <span className="text-xs normal-case">{beneficiario.estado}</span>
                                            </span>
                                            <br />
                                        </div>
                                        <div>
                                            <span className="text-sm uppercase">
                                                <b>Pais:</b> <span className="text-xs normal-case">{beneficiario.pais}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Telefono de Casa:</b>{" "}
                                                <span className="text-xs normal-case">
                                                    {beneficiario.tel_cod_casa}
                                                    {beneficiario.tel_casa}
                                                </span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Telefono Celular:</b>
                                                <span className="text-xs normal-case">
                                                    {beneficiario.tel_cod_cel} {beneficiario.tel_cel}
                                                </span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Telefono de Trabajo:</b>{" "}
                                                <span className="text-xs normal-case">
                                                    {beneficiario.tel_cod_trabajo}
                                                    {beneficiario.tel_trabajo}
                                                </span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Email:</b> <span className="text-xs normal-case">{beneficiario.email}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Lugar de Trabajo:</b>{" "}
                                                <span className="text-xs normal-case">{beneficiario.lugar_trabajo}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Conyuge:</b> <span className="text-xs normal-case">{beneficiario.conyuge}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Estado Civil:</b>{" "}
                                                <span className="text-xs normal-case">{beneficiario.estado_civil}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Nacionalidad:</b>{" "}
                                                <span className="text-xs normal-case">{beneficiario.nacionalidad}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Parentesco:</b> <span className="text-xs normal-case">{beneficiario.parentesco}</span>
                                            </span>
                                            <br />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <EditarBeneficiario beneficiario={beneficiario} onGuardar={handleGuardarCambios} />
                            </CardFooter>
                        </Card>
                    ))}
                </>
            ) : (
                <span className="text-sm font-normal leading-none">Selecciona Contrato...</span>
            )}
        </>
    );
}
