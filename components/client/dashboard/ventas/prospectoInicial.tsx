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
// import { FechaNacimiento } from "@/components/ui/fecha-nacimiento";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useToast, toast } from "@/hooks/use-toast";

interface Prospecto {
    id_cliente: string;
    abreviatura: string | null;
    nombre: string;
    ap_paterno: string | null;
    ap_materno: string | null;
    fecha_nacimiento: string | null;
    sexo: string | null;
    lugar_nacimiento: string | null;
    ocupacion: string | null;
    calle: string | null;
    numero: string | null;
    entre: string | null;
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
    fecha_alta: string | null;
    id_usuario: string | null;
    bnd_activo: string | null;
    ultima_modificacion: string | null;
    id_estatus_prospecto: string | null;
    bnd_interesado_prospecto: string | null;
    id_medio_publicitario: string | null;
    tel_usa_cel: string | null;
    tel_usa_casa: string | null;
    tel_usa_oficina: string | null;
    notas: string | null;
    fecha_correo: string | null;
    id_asesor_cobranza: string | null;
}
interface EstadoCivil {
    id_estado: string;
    estado: string;
}
interface MedioPublicitario {
    id_medio: string;
    medio: string;
}
interface ProspectoProps {
    idCliente: string;
    listaEstadosCivil: EstadoCivil[];
    listaMediosPublicitarios: MedioPublicitario[];
    idUsuario: string;
}

export default function Prospecto({ idCliente, listaEstadosCivil, listaMediosPublicitarios, idUsuario }: ProspectoProps) {
    const { toast } = useToast();
    const { prospecto, setProspecto } = useVentaStore();
    const router = useRouter();
    const [abreviatura, setAbreviatura] = useState<string>("SR.");
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [apPaterno, setApPaterno] = useState<string>("");
    const [apMaterno, setApMaterno] = useState<string>("");
    const [fechaNacimiento, setFechaNacimiento] = useState<Date | undefined>(undefined);
    const [sexo, setSexo] = useState<string>("F");
    const [lugarNacimiento, setLugarNacimiento] = useState<string>("");
    const [chkCasaUSA, setChkCasaUSA] = useState<boolean>(false);
    const [chkCelUSA, setChkCelUSA] = useState<boolean>(false);
    const [chkTrabajoUSA, setChkTrabajoUSA] = useState<boolean>(false);
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
    const [medioPublicitario, setMedioPublicitario] = useState<string>("");
    const [nacionalidad, setNacionalidad] = useState<string>("");
    const [notas, setNotas] = useState<string>("");

    useEffect(() => {
        getDatos();
        //        console.log(stringify(data.rows[0]?.id_estatus_prospecto));
    }, [idCliente]);

    function getDatos() {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/ventas/prospecto/datosProspecto?idCliente=${idCliente}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setProspecto(data[0]);
                setAbreviatura(data[0].abreviatura);
                setNombreCliente(data[0].nombre.toUpperCase());
                setApPaterno(data[0].ap_paterno.toUpperCase());
                setApMaterno(data[0].ap_materno.toUpperCase());
                setFechaNacimiento(data[0].fecha_nacimiento);
                setSexo(data[0].sexo);
                setLugarNacimiento(data[0].lugar_nacimiento);
                setOcupacion(data[0].ocupacion.toUpperCase());
                setCalle(data[0].calle.toUpperCase());
                setNumero(data[0].numero);
                setEntre(data[0].entre.toUpperCase());
                setCiudad(data[0].ciudad.toUpperCase());
                setCP(data[0].cp);
                setColonia(data[0].colonia.toUpperCase());
                setEstado(data[0].estado);
                setPais(data[0].pais.toUpperCase());
                setCodigoCasa(data[0].tel_cod_casa);
                setCodigoCel(data[0].tel_cod_cel);
                setCodigoTrabajo(data[0].tel_cod_trabajo);
                setEmail(data[0].email.toLowerCase());
                setLugarTrabajo(data[0].lugar_trabajo.toUpperCase());
                setDomicilioTrabajo(data[0].domicilio_trabajo.toUpperCase());
                setConyuge(data[0].conyuge.toUpperCase());
                setEstadoCivil(data[0].estado_civil);
                setMedioPublicitario(data[0].id_medio_publicitario);
                setNacionalidad(data[0].nacionalidad);
                setNotas(data[0].notas);
            } catch (error) {
                console.error(error);
            }
        };
        if (idCliente != "0" && idCliente != "") {
            fetchData();
        }
        // fetchData();
    }
    function eliminarProspecto() {}
    function generaVenta() {}
    function guardarProspecto() {
        const data = {
            id_cliente: idCliente,
            abreviatura: abreviatura,
            nombre: nombreCliente,
            ap_paterno: apPaterno,
            ap_materno: apMaterno,
            fecha_nacimiento: moment(fechaNacimiento).format("YYYY-MM-DD"),
            sexo: sexo,
            lugar_nacimiento: lugarNacimiento,
            ocupacion: ocupacion,
            calle: calle,
            numero: numero,
            entre: entre,
            ciudad: ciudad,
            cp: cp,
            colonia: colonia,
            estado: estado,
            pais: pais,
            tel_cod_casa: codigoCasa,
            tel_casa: telCasa,
            tel_cod_cel: codigoCel,
            tel_cel: telCel,
            tel_cod_trabajo: codigoTrabajo,
            tel_trabajo: telTrabajo,
            email: email,
            lugar_trabajo: lugarTrabajo,
            domicilio_trabajo: domicilioTrabajo,
            conyuge: conyuge,
            estado_civil: estadoCivil,
            nacionalidad: nacionalidad,
            fecha_alta: moment().format("YYYY-MM-DD"),
            id_usuario: idUsuario,
            bnd_activo: true,
            id_estatus_prospecto: idCliente != "0" ? "2" : "1",
            ultima_modificacion: prospecto?.ultima_modificacion ?? moment().format("YYYY-MM-DD"),
            bnd_interesado_prospecto: "true",
            id_medio_publicitario: medioPublicitario,
            tel_usa_cel: chkCelUSA?.toString(),
            tel_usa_casa: chkCasaUSA?.toString(),
            tel_usa_oficina: chkTrabajoUSA?.toString(),
            notas: notas,
            fecha_correo: prospecto?.fecha_correo ?? "",
            id_asesor_cobranza: prospecto?.id_asesor_cobranza ?? "1",
        };
        setProspecto(data);
        const crearCliente = async () => {
            try {
                const response = await fetch(`/api/dashboard/ventas/prospecto/creaCliente`, {
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
                        description: "Por favor, comprueba los datos, el prospecto no puede ser agregado",
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
                        description: "Prospecto guardado correctamente",
                        duration: 2500,
                        variant: "default",
                        style: {
                            background: "#25D366",
                            color: "#fff",
                        },
                    });
                    router.push(`/private/dashboard/ventas/alta/${result}`);
                    // redirect(`/private/dashboard/ventas/alta/${result}`);
                } else {
                    toast({
                        // Llama a la función toast
                        title: "Error",
                        description: "Por favor, comprueba los datos, el prospecto no puede ser agregado",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        crearCliente();
    }
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 text-center my-3">DATOS DEL CLIENTE</div>
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
                    <Label htmlFor="cliente">Nombre(s)</Label>
                    <Input
                        id="nombreCliente"
                        required={true}
                        value={nombreCliente}
                        placeholder={nombreCliente}
                        className="uppercase"
                        onChange={(event) => setNombreCliente(event.target.value)}
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
                        onChange={(event) => setApPaterno(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="cliente">Apellido Materno</Label>
                    <Input
                        id="apMaterno"
                        value={apMaterno}
                        placeholder={apMaterno}
                        className="uppercase"
                        onChange={(event) => setApMaterno(event.target.value)}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Checkbox id="chkCasaUSA" checked={chkCasaUSA} onCheckedChange={(e) => setChkCasaUSA(!chkCasaUSA)} />
                    <Label htmlFor="chkCasaUSA">USA</Label>

                    <Input
                        placeholder="Cod.ej. 686"
                        maxLength={3}
                        id="codigoCasa"
                        className="uppercase"
                        value={codigoCasa}
                        onChange={(event) => setCodigoCasa(event.target.value.replace(/[^0-9]/g, ""))}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="telCasa">Tel.Casa</Label>
                    <Input
                        id="telCasa"
                        maxLength={7}
                        value={telCasa}
                        className="uppercase"
                        onChange={(event) => setTelCasa(event.target.value.replace(/[^0-9]/g, ""))}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Checkbox id="chkCelUSA" checked={chkCelUSA} onCheckedChange={(e) => setChkCelUSA(!chkCelUSA)} />
                    <Label htmlFor="chkCelUSA">USA</Label>
                    <Input
                        placeholder="Cod.ej. 686"
                        maxLength={3}
                        id="codigoCel"
                        value={codigoCel}
                        className="uppercase"
                        onChange={(event) => setCodigoCel(event.target.value.replace(/[^0-9]/g, ""))}
                    />
                </div>

                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="telCel">Tel.Celular</Label>
                    <Input
                        id="telCel"
                        value={telCel}
                        maxLength={7}
                        placeholder={telCel}
                        className="uppercase"
                        onChange={(event) => setTelCel(event.target.value.replace(/[^0-9]/g, ""))}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={email?.toLowerCase()}
                        placeholder={email}
                        type="email"
                        className="uppercase"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="medioPublicitario">Medio Publicitario</Label>
                    <Select onValueChange={setMedioPublicitario} defaultValue={medioPublicitario} value={medioPublicitario}>
                        <SelectTrigger id="medioPublicitario">
                            <SelectValue placeholder={medioPublicitario} />
                        </SelectTrigger>
                        <SelectContent>
                            {listaMediosPublicitarios.map((medio) => {
                                return (
                                    <SelectItem
                                        key={medio.id_medio}
                                        value={medio.id_medio}
                                        {...(medio.id_medio === medioPublicitario && { selected: true })}
                                    >
                                        {medio.medio}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-8 lg:col-span-8 xl:col-span-8">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                        id="notas"
                        value={notas}
                        onChange={(event) => setNotas(event.target.value)}
                        className="w-full h-full"
                        placeholder="Puedes dejar un mensaje.."
                    />
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 py-6 ">
                <div className="md:col-span-5 lg:col-span-5 xl:col-span-5 text-right my-3">
                    <Button className="p-6" onClick={guardarProspecto}>
                        GUARDAR PROSPECTO
                    </Button>
                </div>
            </div>
        </>
    );
}
