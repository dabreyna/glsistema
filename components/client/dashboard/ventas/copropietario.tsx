"use client";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useVentaStore } from "@/app/store/dashboard/ventas/prospecto";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FechaNacimiento } from "@/components/ui/fecha-nacimiento";
import { Checkbox } from "@/components/ui/checkbox";

import { stringify } from "querystring";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";

interface Copropietario {
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
    // notas: string | null;
}
interface EstadoCivil {
    id_estado: string;
    estado: string;
}

interface CopropietarioProps {
    idContrato: string;
    listaEstadosCivil: EstadoCivil[];
    // listaMediosPublicitarios: MedioPublicitario[];
    idUsuario: string;
    idTerreno: string;
}

export default function Copropietario({ idContrato, listaEstadosCivil, idUsuario, idTerreno }: CopropietarioProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [abreviatura, setAbreviatura] = useState<string>("SR.");
    const [nombreCopropietario, setNombreCopropietario] = useState<string>("");
    const [apPaterno, setApPaterno] = useState<string>("");
    const [apMaterno, setApMaterno] = useState<string>("");
    // const [fechaNacimiento, setFechaNacimiento] = useState<Date | undefined>(undefined);
    const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
    const [sexo, setSexo] = useState<string>("F");
    const [lugarNacimiento, setLugarNacimiento] = useState<string>("");
    const [chkPrincipal, setChkPrincipal] = useState<boolean>(false);
    const [chkPermiso, setChkPermiso] = useState<boolean>(false);
    const [telCasa, setTelCasa] = useState<string>("");
    const [telCel, setTelCel] = useState<string>("");
    const [telTrabajo, setTelTrabajo] = useState<string>("");
    const [ocupacion, setOcupacion] = useState<string>("");
    const [calle, setCalle] = useState<string>("");
    const [numero, setNumero] = useState<string>("");
    const [entre, setEntre] = useState<string>("");
    const [ciudad, setCiudad] = useState<string>("");
    const [cp, setCP] = useState<string>("");
    const [colonia, setColonia] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [pais, setPais] = useState<string>("");
    const [codigoCasa, setCodigoCasa] = useState<string>("");
    const [codigoCel, setCodigoCel] = useState<string>("");
    const [codigoTrabajo, setCodigoTrabajo] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [lugarTrabajo, setLugarTrabajo] = useState<string>("");
    const [domicilioTrabajo, setDomicilioTrabajo] = useState<string>("");
    const [conyuge, setConyuge] = useState<string>("");
    const [estadoCivil, setEstadoCivil] = useState<string>("");
    const [nacionalidad, setNacionalidad] = useState<string>("");
    const [estadoBtn, setEstadoBtn] = useState<true | false>(false);

    function guardarCopropietario() {
        const data = {
            id_copropietario: "0",
            abreviatura: abreviatura,
            nombre: nombreCopropietario != "" ? nombreCopropietario.toUpperCase() : null,
            ap_paterno: apPaterno != null ? apPaterno.toUpperCase() : null,
            ap_materno: apMaterno != null ? apMaterno.toUpperCase() : null,
            fecha_nacimiento: moment(fechaNacimiento).format("YYYY-MM-DD"),
            sexo: sexo,
            lugar_nacimiento: lugarNacimiento != "" ? lugarNacimiento.toUpperCase() : null,
            ocupacion: ocupacion != "" ? ocupacion.toUpperCase() : null,
            calle: calle != null ? calle.toUpperCase() : null,
            numero: numero,
            ciudad: ciudad != null ? ciudad.toUpperCase() : null,
            cp: cp,
            colonia: colonia != null ? colonia.toUpperCase() : null,
            estado: estado != null ? estado.toUpperCase() : null,
            pais: pais != null ? pais.toUpperCase() : null,
            tel_cod_casa: codigoCasa != "" ? codigoCasa : null,
            tel_casa: telCasa != "" ? telCasa : null,
            tel_cod_cel: codigoCel != "" ? codigoCel : null,
            tel_cel: telCel != "" ? telCel : null,
            tel_cod_trabajo: codigoTrabajo != "" ? codigoTrabajo : null,
            tel_trabajo: telTrabajo != "" ? telTrabajo : null,
            email: email != null ? email.toLowerCase() : null,
            lugar_trabajo: lugarTrabajo != null ? lugarTrabajo.toUpperCase() : null,
            domicilio_trabajo: domicilioTrabajo != null ? domicilioTrabajo.toUpperCase() : null,
            conyuge: conyuge != null ? conyuge.toUpperCase() : null,
            estado_civil: estadoCivil,
            nacionalidad: nacionalidad != "" ? nacionalidad.toUpperCase() : null,
            bnd_principal: chkPrincipal.toString() ?? "false",
            bnd_permiso: chkPermiso.toString() ?? "false",
            // notas: notas != null ? notas.toUpperCase() : null,
            id_usuario: Number(idUsuario),
            bnd_activo: true,
            id_terreno: Number(idTerreno),
            id_contrato: Number(idContrato),
            fecha_alta: moment().format("YYYY-MM-DD"),
        };
        // setCopropietarios(data);
        const crearCopropietario = async () => {
            try {
                const response = await fetch(`/api/dashboard/ventas/prospecto/creaCopropietario`, {
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
                        description: "Por favor, comprueba los datos, el copropietario no puede ser agregado",
                        duration: 2500,
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
                        description: "Copropietario guardado correctamente",
                        duration: 2500,
                        variant: "default",
                        style: {
                            background: "#25D366",
                            color: "#fff",
                        },
                    });
                    //router.push(`/private/dashboard/ventas/alta/${result}`);
                    // redirect(`/private/dashboard/ventas/alta/${result}`);
                    setEstadoBtn(true);
                } else {
                    toast({
                        // Llama a la función toast
                        title: "Error",
                        description: "Por favor, comprueba los datos, el prospecto no puede ser agregado",
                        variant: "destructive",
                    });
                }
                // console.log("ESTO PASO: " + result);
            } catch (error) {
                console.error(error);
            }
        };
        crearCopropietario();

        console.log("data: " + stringify(data));
    }
    const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setFechaNacimiento(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
    };
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 text-center my-3">DATOS DEL COPROPIETARIO</div>
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
                    <Label htmlFor="nombreCopropietario">Nombre(s)</Label>
                    <Input
                        id="nombreCopropietario"
                        required={true}
                        value={nombreCopropietario}
                        placeholder={nombreCopropietario}
                        className="uppercase"
                        onChange={(event) => setNombreCopropietario(event.target.value.toUpperCase())}
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
                    <Label htmlFor="">Fecha Nacimiento</Label>
                    {/* <FechaNacimiento onDateChange={setFechaNacimiento} initialDate={fechaNacimiento} /> */}
                    <Input
                        id="fechaNacimiento"
                        placeholder={fechaNacimiento ? moment(fechaNacimiento, "YYYY-MM-DD").format("DD/MM/YYYY") : "dd/mm/aaaa"}
                        className="uppercase"
                        onBlur={handleDataChange}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="status">Sexo</Label>
                    <Select onValueChange={setSexo} defaultValue={sexo} value={sexo}>
                        <SelectTrigger id="status" aria-label="Femenino">
                            <SelectValue placeholder="Femenino" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="F">Femenino</SelectItem>
                            <SelectItem value="M">Masculino</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="lugarNacimiento">Lugar de Nacimiento</Label>
                    <Input
                        id="lugarNacimiento"
                        value={lugarNacimiento}
                        placeholder={lugarNacimiento}
                        className="uppercase"
                        onChange={(event) => setLugarNacimiento(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="ocupacion">Ocupacion</Label>
                    <Input
                        id="ocupacion"
                        value={ocupacion}
                        placeholder={ocupacion}
                        className="uppercase"
                        onChange={(event) => setOcupacion(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="calle">Calle</Label>
                    <Input
                        id="calle"
                        value={calle}
                        placeholder={calle}
                        className="uppercase"
                        onChange={(event) => setCalle(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="numero">Numero</Label>
                    <Input
                        id="numero"
                        value={numero}
                        placeholder={numero}
                        className="uppercase"
                        onChange={(event) => setNumero(event.target.value)}
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
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
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
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="chkTrabajoUSA">Codigo</Label>
                    <Input
                        placeholder="Cod.ej. 686"
                        maxLength={3}
                        id="codigoTrabajo"
                        value={codigoTrabajo}
                        className="uppercase"
                        onChange={(event) => setCodigoTrabajo(event.target.value)}
                    />
                </div>

                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="telTrabajo">Tel.Trabajo</Label>
                    <Input
                        id="telTrabajo"
                        value={telTrabajo}
                        maxLength={10}
                        placeholder={telTrabajo}
                        className="uppercase"
                        onChange={(event) => setTelTrabajo(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="ocupacion">Email</Label>
                    <Input
                        id="email"
                        value={email.toLowerCase()}
                        placeholder={email}
                        className="uppercase"
                        onChange={(event) => setEmail(event.target.value.toLowerCase())}
                    />
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="lugarTrabajo">Lugar de trabajo</Label>
                    <Input
                        id="lugarTrabajo"
                        value={lugarTrabajo}
                        placeholder={lugarTrabajo}
                        className="uppercase"
                        onChange={(event) => setLugarTrabajo(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Label htmlFor="domicilioTrabajo">Domicilio trabajo</Label>
                    <Input
                        id="domicilioTrabajo"
                        value={domicilioTrabajo}
                        placeholder={domicilioTrabajo}
                        className="uppercase"
                        onChange={(event) => setDomicilioTrabajo(event.target.value.toUpperCase())}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="conyuge">Conyuge</Label>
                    <Input
                        id="conyuge"
                        value={conyuge}
                        placeholder={conyuge}
                        className="uppercase"
                        onChange={(event) => setConyuge(event.target.value)}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                    <Select onValueChange={setEstadoCivil} defaultValue={estadoCivil} value={estadoCivil}>
                        <SelectTrigger id="estadoCivil">
                            <SelectValue placeholder={estadoCivil} />
                        </SelectTrigger>
                        <SelectContent>
                            {listaEstadosCivil.map((estado) => {
                                // console.log(estado.id_estado, estadoCivil);
                                return (
                                    <SelectItem
                                        key={estado.id_estado}
                                        value={estado.id_estado}
                                        {...(estado.id_estado === estadoCivil && { selected: true })}
                                    >
                                        {estado.estado}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="nacionalidad">Nacionalidad</Label>
                    <Select onValueChange={setNacionalidad} defaultValue={nacionalidad} value={nacionalidad}>
                        <SelectTrigger id="nacionalidad" aria-label={nacionalidad}>
                            <SelectValue placeholder={nacionalidad} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MX">MEXICANA</SelectItem>
                            <SelectItem value="EXT">EXTRANJERA</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="chkPrincipal">Principal </Label>
                    <Checkbox id="chkPrincipal" checked={chkPrincipal} onCheckedChange={(e) => setChkPrincipal(!chkPrincipal)} />
                    <Label htmlFor="chkPermiso"> Permiso </Label>
                    <Checkbox id="chkPermiso" checked={chkPermiso} onCheckedChange={(e) => setChkPermiso(!chkPermiso)} />
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 py-6 ">
                <div className="md:col-span-6 lg:col-span-6 xl:col-span-6 text-right my-3">
                    <Button className="p-6" id="btnGuardarCopropietario" disabled={estadoBtn} onClick={guardarCopropietario}>
                        GUARDAR COPROPIETARIO
                    </Button>
                </div>
                {/* <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 text-center my-3">
                    <Button className="p-6" onClick={generaVenta}>
                        VENTA
                    </Button>
                </div> */}
                {/* <div className="md:col-span-4 lg:col-span-4 xl:col-span-4 text-left my-3">
                    <Button className="p-6" onClick={eliminarProspecto}>
                        ELIMINAR PROSPECTO
                    </Button>
                </div> */}
            </div>
        </>
    );
}
