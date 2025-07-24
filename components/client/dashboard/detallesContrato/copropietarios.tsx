"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";
import { useEffect, useState } from "react";
import { EditarCopropietario } from "./editarCopropietario";
import Copropietario from "../ventas/copropietario";
import { NuevoCopropietario } from "./nuevoCopropietario";

interface datosCopropietario {
    id_copropietario: any;
    abreviatura: string | null;
    nombre: string;
    ap_paterno: string | null;
    ap_materno?: string | null;
    fecha_nacimiento: string | null;
    sexo: string | null;
    lugar_nacimiento?: string | null;
    ocupacion?: string | null;
    calle?: string | null;
    numero?: any | null;
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
    domicilio_trabajo?: string | null;
    conyuge?: string | null;
    estado_civil?: string | null;
    nacionalidad?: string | null;
    bnd_permiso?: boolean | null;
    bnd_principal?: boolean | null;
}
interface listadoCopropietarios {
    Copropietarios: datosCopropietario[];
}
interface EstadoCivil {
    id_estado: string;
    estado: string;
}
interface CopropietariosProps {
    listaEstadosCivil: EstadoCivil[];
    idUsuario: string;
}
export default function Copropietarios({ listaEstadosCivil, idUsuario }: CopropietariosProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [data, setData] = useState<datosCopropietario[]>([]);
    // const idCliente = useContratoSelectedStore((state) => state.idCliente);
    const idContrato = useContratoSelectedStore((state) => state.idContrato);
    const idTerreno = useContratoSelectedStore((state) => state.idTerreno);

    const handleGuardarCambios = (newData: datosCopropietario[]) => {
        const index = data.findIndex((copropietario) => copropietario.id_copropietario === newData[0].id_copropietario);
        const newCopropietarios = [...data];
        newCopropietarios[index] = newData[0];
        setData(newCopropietarios);

        //setData(newData);
        console.log("guardando cambios");
    };

    useEffect(() => {
        // if(isMounted){
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/detallesContrato/datosCopropietario?idContrato=${idContrato}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setData(data);
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
                    <NuevoCopropietario
                        idContrato={Number(idContrato)}
                        idUsuario={Number(idUsuario)}
                        idTerreno={Number(idTerreno)}
                        listaEstadosCivil={listaEstadosCivil}
                    />
                    {data.map((copropietario) => (
                        <Card key={copropietario.id_copropietario}>
                            <CardHeader>
                                <CardTitle>
                                    Copropiertario:{" "}
                                    <span className="text-sm">
                                        {copropietario.abreviatura} {copropietario.nombre} {copropietario.ap_paterno}{" "}
                                        {copropietario?.ap_materno}
                                    </span>
                                </CardTitle>
                                <CardDescription className="space-y-2 text-gray-700 font-medium"></CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="container mx-auto px-4">
                                    <div className="grid md:grid-cols-2 gap-4  xs:grid-cols-1">
                                        <div>
                                            <span className="text-sm uppercase">
                                                <b>Fecha de Nacimiento:</b>{" "}
                                                <span className="text-xs normal-case">{copropietario.fecha_nacimiento}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Sexo:</b> <span className="text-xs normal-case">{copropietario.sexo}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Lugar de Nacimiento:</b>{" "}
                                                <span className="text-xs normal-case">{copropietario.lugar_nacimiento}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Ocupacion:</b> <span className="text-xs normal-case">{copropietario.ocupacion}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Calle:</b> <span className="text-xs normal-case">{copropietario.calle}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Numero:</b> <span className="text-xs normal-case">{copropietario.numero}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Ciudad:</b> <span className="text-xs normal-case">{copropietario.ciudad}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Codigo Postal:</b> <span className="text-xs normal-case">{copropietario.cp}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Colonia:</b> <span className="text-xs normal-case">{copropietario.colonia}</span>
                                            </span>
                                            <br />
                                        </div>
                                        <div>
                                            <span className="text-sm uppercase">
                                                <b>Estado:</b> <span className="text-xs normal-case">{copropietario.estado}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Pais:</b> <span className="text-xs normal-case">{copropietario.pais}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Telefono de Casa:</b>{" "}
                                                <span className="text-xs normal-case">
                                                    {copropietario.tel_cod_casa}
                                                    {copropietario.tel_casa}
                                                </span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Telefono Celular:</b>
                                                <span className="text-xs normal-case">
                                                    {copropietario.tel_cod_cel} {copropietario.tel_cel}
                                                </span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Telefono de Trabajo:</b>{" "}
                                                <span className="text-xs normal-case">
                                                    {copropietario.tel_cod_trabajo}
                                                    {copropietario.tel_trabajo}
                                                </span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Email:</b> <span className="text-xs normal-case">{copropietario.email}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Lugar de Trabajo:</b>{" "}
                                                <span className="text-xs normal-case">{copropietario.lugar_trabajo}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Domicilio Trabajo:</b>{" "}
                                                <span className="text-xs normal-case">{copropietario.domicilio_trabajo}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Conyuge:</b> <span className="text-xs normal-case">{copropietario.conyuge}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Estado Civil:</b>{" "}
                                                <span className="text-xs normal-case">{copropietario.estado_civil}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Nacionalidad:</b>{" "}
                                                <span className="text-xs normal-case">{copropietario.nacionalidad}</span>
                                            </span>
                                            <br />
                                            <span className="text-sm uppercase">
                                                <b>Notas:</b> <span className="text-xs normal-case">????</span>
                                            </span>
                                            <br />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <EditarCopropietario copropietario={copropietario} onGuardar={handleGuardarCambios} />
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
