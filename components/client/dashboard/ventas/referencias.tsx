"use client";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { stringify } from "querystring";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Referencia {
    id_copropietario: string | null;
    abreviatura: string | null;
    nombre: string | null;
    ap_paterno: string | null;
    ap_materno: string | null;
    fecha_nacimiento: string | null;
    sexo: string | null;
    lugar_nacimiento: string | null;
    ocupacion: string | null;
    calle: string | null;
    numero: string | null;
    ciudad: string | null;
    cp: string | null;
    colonia: string | null;
    estado: string | null;
    pais: string | null;
    tel_cod_casa: string | null;
    tel_casa: string | null;
    tel_cod_cel: string | null;
    tel_cel: string | null;
    tel_cod_trabajo: string | null;
    tel_trabajo: string | null;
    email: string | null;
    lugar_trabajo: string | null;
    domicilio_trabajo: string | null;
    conyuge: string | null;
    estado_civil: string | null;
    nacionalidad: string | null;
    bnd_permiso: string | null;
    bnd_principal: string | null;
    // observaciones: string | null;
}

interface ReferenciaProps {
    idContrato: string;
    // listaMediosPublicitarios: MedioPublicitario[];
    idUsuario: string;
    idTerreno: string;
}

export default function Referencias({ idContrato, idUsuario, idTerreno }: ReferenciaProps) {
    const { toast } = useToast();
    // const router = useRouter();
    const [contReferencia, setContReferencia] = useState<number>(1);
    const [abreviatura, setAbreviatura] = useState<string>("SR.");
    const [nombreReferencia, setNombreReferencia] = useState<string>("");
    const [apPaterno, setApPaterno] = useState<string>("");
    const [apMaterno, setApMaterno] = useState<string>("");
    const [parentesco, setParentesco] = useState<string>("");
    const [calle, setCalle] = useState<string>("");
    const [numero, setNumero] = useState<string>("");
    const [entre, setEntre] = useState<string>("");
    const [ciudad, setCiudad] = useState<string>("");
    const [cp, setCP] = useState<string>("");
    const [colonia, setColonia] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [pais, setPais] = useState<string>("");
    const [telCasa, setTelCasa] = useState<string>("");
    const [telCel, setTelCel] = useState<string>("");
    const [codigoCasa, setCodigoCasa] = useState<string>("");
    const [codigoCel, setCodigoCel] = useState<string>("");
    const [observaciones, setObservaciones] = useState<string>("");

    // const [abreviatura2, setAbreviatura2] = useState<string>("SR.");
    // const [nombreReferencia2, setNombreReferencia2] = useState<string>("");
    // const [apPaterno2, setApPaterno2] = useState<string>("");
    // const [apMaterno2, setApMaterno2] = useState<string>("");
    // const [parentesco2, setParentesco2] = useState<string>("");
    // const [calle2, setCalle2] = useState<string>("");
    // const [numero2 , setNumero2] = useState<string>("");
    // const [entre2, setEntre2] = useState<string>("");
    // const [ciudad2, setCiudad2] = useState<string>("");
    // const [cp2, setCP2] = useState<string>("");
    // const [colonia2, setColonia2] = useState<string>("");
    // const [estado2, setEstado2] = useState<string>("");
    // const [pais2, setPais2] = useState<string>("");
    // const [telCasa2, setTelCasa2] = useState<string>("");
    // const [telCel2, setTelCel2] = useState<string>("");
    // const [codigoCasa2, setCodigoCasa2] = useState<string>("");
    // const [codigoCel2, setCodigoCel2] = useState<string>("");
    // const [observaciones2, setObservaciones2] = useState<string>("");
    const [estadoBtn, setEstadoBtn] = useState<true | false>(false);
    // const [estadoBtn2, setEstadoBtn2] = useState<true | false>(false);

    function clearVars() {
        setAbreviatura("");
        setNombreReferencia("");
        setApPaterno("");
        setApMaterno("");
        setParentesco("");
        setCalle("");
        setNumero("");
        setEntre("");
        setCiudad("");
        setCP("");
        setColonia("");
        setEstado("");
        setPais("");
        setTelCasa("");
        setTelCel("");
        setCodigoCasa("");
        setCodigoCel("");
        setObservaciones("");
    }
    function guardarReferencia() {
        const data = {
            id_referencia: "0",
            abreviatura: abreviatura,
            nombre: nombreReferencia != null ? nombreReferencia.toUpperCase() : null,
            ap_paterno: apPaterno != null ? apPaterno.toUpperCase() : null,
            ap_materno: apMaterno != null ? apMaterno.toUpperCase() : null,
            parentesco: parentesco != null ? parentesco.toUpperCase() : null,
            calle: calle != null ? calle.toUpperCase() : null,
            numero: numero,
            entre: entre != null ? entre.toUpperCase() : null,
            ciudad: ciudad != null ? ciudad.toUpperCase() : null,
            cp: cp,
            colonia: colonia != null ? colonia.toUpperCase() : null,
            estado: estado != null ? estado.toUpperCase() : null,
            pais: pais != null ? pais.toUpperCase() : null,
            tel_cod_casa: codigoCasa != "" ? codigoCasa : null,
            tel_casa: telCasa != null ? telCasa : null,
            tel_cod_cel: codigoCel != null ? codigoCel : null,
            tel_cel: telCel != null ? telCel : null,
            observaciones: observaciones != null ? observaciones.toUpperCase() : null,
            id_usuario: Number(idUsuario),
            id_terreno: Number(idTerreno),
            id_contrato: Number(idContrato),
            fecha_alta: moment().format("YYYY-MM-DD"),
        };
        // setCopropietarios(data);
        const crearReferencia = async () => {
            try {
                const response = await fetch(`/api/dashboard/ventas/prospecto/creaReferencia`, {
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
                        description: "Por favor, comprueba los datos, la referencia no puede ser agregada",
                        duration: 2500,
                        variant: "destructive",
                    });
                    const errorData = await response.json(); // Intenta obtener detalles del error
                    throw new Error(`${response.status} ${response.statusText}: ${errorData.message || "Error en la solicitud"}`);
                }
                const result = await response.json();
                if (result) {
                    //aqui va el toast
                    toast({
                        // Llama a la función toast
                        title: "Éxito",
                        description: "Referencia guardada correctamente",
                        duration: 2500,
                        variant: "default",
                        style: {
                            background: "#25D366",
                            color: "#fff",
                        },
                    });
                    if (contReferencia == 1) {
                        setContReferencia(contReferencia + 1);
                        clearVars();
                    }
                    if (contReferencia == 2) {
                        setEstadoBtn(true);
                    }
                } else {
                    toast({
                        // Llama a la función toast
                        title: "Error",
                        description: "Por favor, comprueba los datos, la referencia no puede ser agregada",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        crearReferencia();
    }
    // function guardarReferencia2() {
    //     const data = {
    //         id_referencia: "0",
    //         abreviatura: abreviatura2,
    //         nombre: nombreReferencia2 != null ? nombreReferencia2.toUpperCase() : null,
    //         ap_paterno: apPaterno2 != null ? apPaterno2.toUpperCase() : null,
    //         ap_materno: apMaterno2 != null ? apMaterno2.toUpperCase() : null,
    //         parentesco: parentesco2 != null ? parentesco2.toUpperCase() : null,
    //         calle: calle2 != null ? calle2.toUpperCase() : null,
    //         numero: numero2,
    //         entre: entre2 != null ? entre2.toUpperCase() : null,
    //         ciudad: ciudad2 != null ? ciudad2.toUpperCase() : null,
    //         cp: cp2,
    //         colonia: colonia2 != null ? colonia2.toUpperCase() : null,
    //         estado: estado2 != null ? estado2.toUpperCase() : null,
    //         pais: pais2 != null ? pais2.toUpperCase() : null,
    //         tel_cod_casa: codigoCasa2 != "" ? codigoCasa2 : null,
    //         tel_casa: telCasa2 != null ? telCasa2 : null,
    //         tel_cod_cel: codigoCel2 != null ? codigoCel2 : null,
    //         tel_cel: telCel2 != null ? telCel2 : null,
    //         observaciones: observaciones2 != null ? observaciones2.toUpperCase() : null,
    //         id_usuario: Number(idUsuario),
    //         id_terreno: Number(idTerreno),
    //         id_contrato: Number(idContrato),
    //         fecha_alta: moment().format("YYYY-MM-DD"),
    //     };
    //     // setCopropietarios(data);
    //     const crearReferencia = async () => {
    //         try {
    //             const response = await fetch(`/api/dashboard/ventas/prospecto/creaReferencia`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(data),
    //             });
    //             if (!response.ok) {
    //                 toast({
    //                     // Llama a la función toast
    //                     title: "Error",
    //                     description: "Por favor, comprueba los datos, la referencia no puede ser agregada",
    //                     duration: 2500,
    //                     variant: "destructive",
    //                 });
    //                 const errorData = await response.json(); // Intenta obtener detalles del error
    //                 throw new Error(`${response.status} ${response.statusText}: ${errorData.message || "Error en la solicitud"}`);
    //             }
    //             const result = await response.json();
    //             if (result) {
    //                 //aqui va el toast
    //                 toast({
    //                     // Llama a la función toast
    //                     title: "Éxito",
    //                     description: "Referencia guardada correctamente",
    //                     duration: 2500,
    //                     variant: "default",
    //                     style: {
    //                         background: "#25D366",
    //                         color: "#fff",
    //                     },
    //                 });
    //                     setEstadoBtn1(true);
    //             } else {
    //                 toast({
    //                     // Llama a la función toast
    //                     title: "Error",
    //                     description: "Por favor, comprueba los datos, la referencia no puede ser agregada",
    //                     variant: "destructive",
    //                 });
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     crearReferencia();
    // }
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 text-center my-3">DATOS DE REFERENCIA #{contReferencia}</div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="abreviatura">Abreviatura</Label>
                    <Select onValueChange={setAbreviatura} defaultValue={abreviatura} value={abreviatura}>
                        <SelectTrigger id="abreviatura" aria-label={abreviatura}>
                            <SelectValue placeholder={abreviatura} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SR.">SR.</SelectItem>
                            <SelectItem value="SRA.">SRA.</SelectItem>
                            <SelectItem value="SRTA.">SRTA.</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="nombreReferencia">Nombre(s)</Label>
                    <Input
                        id="nombreReferencia"
                        required={true}
                        value={nombreReferencia}
                        placeholder={nombreReferencia}
                        className="uppercase"
                        onChange={(event) => setNombreReferencia(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="cliente">Apellido Paterno</Label>
                    <Input
                        id="apPaterno"
                        required={true}
                        value={apPaterno}
                        placeholder={apPaterno}
                        className="uppercase"
                        onChange={(event) => setApPaterno(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="cliente">Apellido Materno</Label>
                    <Input
                        id="apMaterno"
                        value={apMaterno}
                        placeholder={apMaterno}
                        className="uppercase"
                        onChange={(event) => setApMaterno(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="parentesco">Parentesco</Label>
                    <Input
                        id="parentesco"
                        value={parentesco}
                        placeholder={parentesco}
                        className="uppercase"
                        onChange={(event) => setParentesco(event.target.value)}
                    />
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="calle">Calle</Label>
                    <Input
                        id="calle"
                        value={calle}
                        placeholder={calle}
                        className="uppercase"
                        onChange={(event) => setCalle(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="numero">Numero</Label>
                    <Input
                        id="numero"
                        value={numero}
                        placeholder={numero}
                        className="uppercase"
                        onChange={(event) => setNumero(event.target.value)}
                    />
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="calle">Entre</Label>
                    <Input
                        id="entre"
                        value={entre}
                        placeholder={entre}
                        className="uppercase"
                        onChange={(event) => setEntre(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                        id="ciudad"
                        value={ciudad}
                        placeholder={ciudad}
                        className="uppercase"
                        onChange={(event) => setCiudad(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="cp">CP</Label>
                    <Input
                        id="cp"
                        value={cp}
                        // type="number"
                        maxLength={6}
                        required={true}
                        placeholder={cp}
                        className="uppercase"
                        onChange={(event) => setCP(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="colonia">Colonia</Label>
                    <Input
                        id="colonia"
                        value={colonia}
                        placeholder={colonia}
                        className="uppercase"
                        onChange={(event) => setColonia(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                        id="estado"
                        value={estado}
                        placeholder={estado}
                        className="uppercase"
                        onChange={(event) => setEstado(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="pais">Pais</Label>
                    <Input
                        id="pais"
                        value={pais}
                        placeholder={pais}
                        className="uppercase"
                        onChange={(event) => setPais(event.target.value.toUpperCase())}
                    />
                </div>

                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="chkCasaUSA">Codigo</Label>
                    <Input
                        placeholder="Cod.ej. 686"
                        maxLength={3}
                        id="codigoCasa"
                        className="uppercase"
                        value={codigoCasa}
                        onChange={(event) => setCodigoCasa(event.target.value)}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="telCasa">Tel.Casa</Label>
                    <Input
                        id="telCasa"
                        value={telCasa}
                        maxLength={10}
                        className="uppercase"
                        onChange={(event) => setTelCasa(event.target.value)}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="chkCelUSA">Codigo</Label>
                    <Input
                        placeholder="Cod.ej. 686"
                        maxLength={3}
                        id="codigoCel"
                        value={codigoCel}
                        className="uppercase"
                        onChange={(event) => setCodigoCel(event.target.value)}
                    />
                </div>

                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="telCel">Tel.Celular</Label>
                    <Input
                        id="telCel"
                        value={telCel}
                        maxLength={10}
                        placeholder={telCel}
                        className="uppercase"
                        onChange={(event) => setTelCel(event.target.value)}
                    />
                </div>
                <div className="md:col-span-8 lg:col-span-8 xl:col-span-8">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                        id="observaciones"
                        value={observaciones}
                        onChange={(event) => setObservaciones(event.target.value.toUpperCase())}
                        className="w-full h-full"
                        placeholder="Puedes dejar un mensaje.."
                    />
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 py-6 ">
                <div className="md:col-span-6 lg:col-span-6 xl:col-span-6 text-right my-3">
                    <Button className="p-6" id="btnGuardarReferencia1" disabled={estadoBtn} onClick={() => guardarReferencia()}>
                        GUARDAR REFERENCIA
                    </Button>
                </div>
            </div>
        </>
    );
}
