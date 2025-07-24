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
import { Textarea } from "@/components/ui/textarea";
import { VenetianMaskIcon } from "lucide-react";
import { stringify } from "querystring";
import moment, { duration } from "moment";
import { useToast, toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TableRow } from "@/components/ui/table";

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

// interface Fraccionamiento {
//     id_fraccionamiento: string;
//     fraccionamiento: string;
// }
// interface Manzana {
//     id_manzana: string;
//     no_manzana: string;
// }
// interface Terreno {
//     id_terreno: string;
//     no_terreno: string;
// }

export default function Prospecto({ idCliente, listaEstadosCivil, listaMediosPublicitarios, idUsuario }: ProspectoProps) {
    const { toast } = useToast();
    const { prospecto, setProspecto } = useVentaStore();
    const router = useRouter();
    // console.log("IDSUARIO: " + idUsuario);

    // const [tipoEstadoCivil, setTipoEstadoCivil] = useState<EstadoCivil[]>([]);
    const [abreviatura, setAbreviatura] = useState<string>("SR.");
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [apPaterno, setApPaterno] = useState<string>("");
    const [apMaterno, setApMaterno] = useState<string>("");
    const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
    // const [fechaNacimiento, setFechaNacimiento] = useState<Date | undefined>(undefined);
    const [sexo, setSexo] = useState<string>("F");
    const [lugarNacimiento, setLugarNacimiento] = useState<string>("");
    const [chkCasaUSA, setChkCasaUSA] = useState<boolean>(false);
    const [chkCelUSA, setChkCelUSA] = useState<boolean>(false);
    const [chkTrabajoUSA, setChkTrabajoUSA] = useState<boolean>(false);
    const [telCasa, setTelCasa] = useState<string>("");
    const [telCel, setTelCel] = useState<string>("");
    const [telTrabajo, setTelTrabajo] = useState<string>("");
    // const [fraccionamiento, setFraccionamiento] = useState<string>("");
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
    const [btnEliminarEstatus, setBtnEliminarEstatus] = useState<string>("hidden");

    useEffect(() => {
        getDatos();
        //        console.log(stringify(data.rows[0]?.id_estatus_prospecto));
    }, [idCliente]);

    function getDatos() {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/ventas/prospecto/datosProspecto?idCliente=${idCliente}`);
                const responseClienteActual = await fetch(`/api/dashboard/ventas/prospecto/validaClienteActual?idCliente=${idCliente}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setProspecto(data[0]);
                setAbreviatura(data[0].abreviatura);
                setNombreCliente(data[0].nombre);
                setApPaterno(data[0].ap_paterno);
                setApMaterno(data[0].ap_materno);
                setFechaNacimiento(data[0].fecha_nacimiento);
                setSexo(data[0].sexo);
                setLugarNacimiento(data[0].lugar_nacimiento);
                setOcupacion(data[0].ocupacion);
                setCalle(data[0].calle);
                setNumero(data[0].numero);
                setEntre(data[0].entre);
                setCiudad(data[0].ciudad);
                setCP(data[0].cp);
                setColonia(data[0].colonia);
                setEstado(data[0].estado);
                setPais(data[0].pais);
                setCodigoCasa(data[0].tel_cod_casa);
                setTelCasa(data[0].tel_casa);
                setCodigoCel(data[0].tel_cod_cel);
                setTelCel(data[0].tel_cel);
                setCodigoTrabajo(data[0].tel_cod_trabajo);
                setTelTrabajo(data[0].tel_trabajo);
                setEmail(data[0].email);
                setLugarTrabajo(data[0].lugar_trabajo);
                setDomicilioTrabajo(data[0].domicilio_trabajo);
                setConyuge(data[0].conyuge);
                setEstadoCivil(data[0].estado_civil);
                setMedioPublicitario(data[0].id_medio_publicitario);
                setNacionalidad(data[0].nacionalidad);
                setNotas(data[0].notas);
                // console.log("data: " + stringify(data));
                const contratos = await responseClienteActual.json();
                // console.log(contratos[0].cont);

                if (Number(contratos[0].cont) > 0) {
                    setBtnEliminarEstatus("hidden");
                    console.log("btnEliminarEstatus:-> " + btnEliminarEstatus);
                } else {
                    setBtnEliminarEstatus("visible");
                    console.log("btnEliminarEstatus: " + btnEliminarEstatus);
                }
            } catch (error) {
                console.error(error);
            }
        };
        if (idCliente != "0" && idCliente != "") {
            fetchData();
        }
        // fetchData();
    }
    const eliminarProspecto = async () => {
        try {
            const response = await fetch(`/api/dashboard/ventas/prospecto/eliminarProspecto?idCliente=${idCliente}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            if (data == "OK") {
                toast({
                    // Llama a la función toast
                    title: "Éxito",
                    description: "Datos eliminados correctamente.",
                    duration: 2500,
                    variant: "default",
                    style: {
                        background: "#25D366",
                        color: "#fff",
                    },
                });
                router.push(`/private/dashboard/ventas/seguimiento/`);
            } else {
                toast({
                    // Llama a la función toast
                    title: "Error",
                    description: "Por favor, comprueba los datos, el prospecto no puede ser eliminado",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    function generaVenta() {}
    function guardarProspecto() {
        const data = {
            id_cliente: idCliente,
            abreviatura: abreviatura,
            nombre: nombreCliente != "" ? nombreCliente.toUpperCase() : null,
            ap_paterno: apPaterno != null ? apPaterno.toUpperCase() : null,
            ap_materno: apMaterno != null ? apMaterno.toUpperCase() : null,
            fecha_nacimiento: moment(fechaNacimiento).format("YYYY-MM-DD"),
            sexo: sexo,
            lugar_nacimiento: lugarNacimiento != "" ? lugarNacimiento.toUpperCase() : null,
            ocupacion: ocupacion != "" ? ocupacion.toUpperCase() : null,
            calle: calle != null ? calle.toUpperCase() : null,
            numero: numero,
            entre: entre != null ? entre.toUpperCase() : null,
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
            fecha_alta: moment().format("YYYY-MM-DD"),
            id_usuario: idUsuario,
            bnd_activo: true,
            id_estatus_prospecto: idCliente != "0" ? "2" : "1",
            ultima_modificacion: prospecto?.ultima_modificacion ?? moment().format("YYYY-MM-DD"),
            bnd_interesado_prospecto: "true",
            id_medio_publicitario: medioPublicitario,
            tel_usa_cel: chkCelUSA.toString() ?? "false",
            tel_usa_casa: chkCasaUSA.toString() ?? "false",
            tel_usa_oficina: chkTrabajoUSA.toString() ?? "false",
            notas: notas != "" ? notas.toUpperCase() : null,
            fecha_correo: prospecto?.email != "" ? moment().format("YYYY-MM-DD") : null,
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
                        duration: 1500,
                        variant: "destructive",
                    });
                    const errorData = await response.json(); // Intenta obtener detalles del error
                    throw new Error(`${response.status} ${response.statusText}: ${errorData.message || "Error en la solicitud"}`);
                    // throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const result = await response.json();
                console.log(result);
                if (result) {
                    //aqui va el toast
                    toast({
                        // Llama a la función toast
                        title: "Éxito",
                        description: "DATOS ACTUALIZADOS CORRECTAMENTE",
                        duration: 2500,
                        variant: "default",
                        style: {
                            background: "#25D366",
                            color: "#fff",
                        },
                    });
                    // console.log(result[0].id_cliente);
                    router.push(`/private/dashboard/ventas/alta/${result[0].id_cliente}`);
                    // redirect(`/private/dashboard/ventas/alta/${result}`);
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
        crearCliente();

        console.log("data: " + stringify(data));
    }
    // const fNacimiento = moment(fechaNacimiento).format("DD/MM/YYYY"); // fechaNacimiento?.toString();
    const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        // console.log(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
        // console.log(newData);
        setFechaNacimiento(moment(newData, "DD/MM/YYYY").format("YYYY-MM-DD"));
        // const col = event.target.id;
        // actualizarDatos(cliente.id_solicitud_servicio, newData, col, 1);
        // console.log(fechaNacimiento);
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 text-center my-3">DATOS DEL CLIENTE</div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="abreviatura">Abreviatura</Label>
                    <Select onValueChange={setAbreviatura} defaultValue={abreviatura} value={abreviatura} required={true}>
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
                        onChange={(event) => setNombreCliente(event.target.value.toUpperCase())}
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
                    <Label htmlFor="fechaNacimiento">Fecha Nacimiento</Label>
                    <Input
                        id="fechaNacimiento"
                        // value={moment(fechaNacimiento).format("YYYY-MM-DD")}
                        placeholder={fechaNacimiento ? moment(fechaNacimiento, "YYYY-MM-DD").format("DD/MM/YYYY") : "dd/mm/aaaa"}
                        // placeholder={lugarNacimiento}
                        className="uppercase"
                        // onBlur={(event) => setFechaNacimiento(moment(event.target.value).format("YYYY-MM-DD"))}
                        onBlur={handleDataChange}
                        // onChange={(event) => setFechaNacimiento(moment(event.target.value).format("YYYY-MM-DD"))}
                        // onChange={(event) => setFechaNacimiento(event.target.value)}
                    />
                    {/* <FechaNacimiento onDateChange={setFechaNacimiento} initialDate={fechaNacimiento} /> */}
                </div>
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="status">Sexo</Label>
                    <Select onValueChange={setSexo} defaultValue={sexo} value={sexo} required={true}>
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
                        required={true}
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
                        required={true}
                        placeholder={numero}
                        className="uppercase"
                        onChange={(event) => setNumero(event.target.value)}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="entre">Entre</Label>
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
                        required={true}
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
                        onChange={(event) => setCP(event.target.value.replace(/[^0-9]/g, ""))}
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
                        value={telCasa}
                        maxLength={7}
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
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Checkbox id="chkTrabajoUSA" checked={chkTrabajoUSA} onCheckedChange={(e) => setChkTrabajoUSA(!chkTrabajoUSA)} />
                    <Label htmlFor="chkTrabajoUSA">USA</Label>
                    <Input
                        placeholder="Cod.ej. 686"
                        maxLength={3}
                        id="codigoTrabajo"
                        value={codigoTrabajo}
                        className="uppercase"
                        onChange={(event) => setCodigoTrabajo(event.target.value.replace(/[^0-9]/g, ""))}
                    />
                </div>

                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Label htmlFor="telTrabajo">Tel.Trabajo</Label>
                    <Input
                        id="telTrabajo"
                        value={telTrabajo}
                        maxLength={7}
                        placeholder={telTrabajo}
                        className="uppercase"
                        onChange={(event) => setTelTrabajo(event.target.value.replace(/[^0-9]/g, ""))}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Label htmlFor="ocupacion">Email</Label>
                    <Input
                        id="email"
                        value={email}
                        placeholder={email}
                        className="lowercase"
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
                        onChange={(event) => setConyuge(event.target.value.toUpperCase())}
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
                    <Label htmlFor="medioPublicitario">Medio Publicitario</Label>
                    <Select onValueChange={setMedioPublicitario} defaultValue={medioPublicitario} value={medioPublicitario}>
                        <SelectTrigger id="medioPublicitario">
                            <SelectValue placeholder={medioPublicitario} />
                        </SelectTrigger>
                        <SelectContent>
                            {listaMediosPublicitarios.map((medio) => {
                                // console.log(medio.id_medio, medio);
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
                    {/* <Input
                        id="notas"
                        value={conyuge}
                        placeholder={conyuge}
                        className="uppercase"
                        onChange={(event) => setConyuge(event.target.value)}
                    /> */}
                    <Textarea
                        id="notas"
                        value={notas}
                        onChange={(event) => setNotas(event.target.value.toUpperCase())}
                        className="w-full h-full"
                        placeholder="Puedes dejar un mensaje.."
                    />
                </div>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 py-6 ">
                <div className="md:col-span-6 lg:col-span-6 xl:col-span-6 text-right my-3">
                    <Button className="p-6" onClick={guardarProspecto}>
                        GUARDAR DATOS
                    </Button>
                </div>
                {/* <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 text-center my-3">
                    <Button className="p-6" onClick={generaVenta}>
                        VENTA
                    </Button>
                </div> */}
                <div className="md:col-span-4 lg:col-span-4 xl:col-span-4 text-left my-3">
                    <Button className={`p-6 ${btnEliminarEstatus}`} onClick={eliminarProspecto}>
                        ELIMINAR PROSPECTO
                    </Button>
                </div>
            </div>
        </>
    );
}
