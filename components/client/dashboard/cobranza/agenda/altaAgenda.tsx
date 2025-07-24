// import Image from "next/image";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon, MessageSquareDiff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es, id } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { DateTimePicker } from "@/components/ui/datetimepicker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useToast, toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import TablaMovimientos from "./tablaMovimientos";
import { set } from "lodash";

interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}
interface AltaAgendaProps {
    idCliente: string;
    listaClasificacion: Clasificacion[];
    idContrato: string;
    idUsuario?: string;
    perfilUsuario?: string;
}
interface datosGenerales {
    nombre_cliente: string;
    ultimo_comentario: string;
    asesor_comentario: string;
    interesado: boolean;
}

interface DatosMovimientos {
    no_pago: number;
    fecha_movimiento: string;
    movimiento: string;
    monto_saldo: string;
    interes: string;
    tipo_movimiento: string;
    dias_de_vencimiento: string;
    id_servicio: string;
    id_carga: string;
    no_medidor: string;
}
export function AltaAgenda({ idCliente, listaClasificacion, idContrato, idUsuario, perfilUsuario }: AltaAgendaProps) {
    const { toast } = useToast();
    const [date, setDate] = React.useState<Date>();
    const [datePayment, setDatePayment] = React.useState<Date>();
    const [fecha, setFecha] = useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [montoCompromiso, setMontoCompromiso] = useState<string>("");
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const [tipoDeClasificacion, setTipoDeClasificacion] = useState<string>("0");
    const [comentario, setComentario] = useState<string>("");
    const [asesor, setAsesor] = useState<string>("");
    const [movimientos, setMovimientos] = useState<DatosMovimientos[]>([]);
    const [datosCliente, setDatosCliente] = useState<datosGenerales>({
        nombre_cliente: "",
        ultimo_comentario: "",
        asesor_comentario: "",
        interesado: true,
    });
    const [filtroMovimientos, setFiltroMovimientos] = useState<number>(1);

    const [chkMostrar, setChkMostrar] = useState<boolean>(false);

    const handleDatePaymentSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setFecha(format(selectedDate, "yyyy-MM-dd", { locale: es }));
            setDatePayment(selectedDate);
            // setFInicio(format(date.from, "yyyy-MM-dd", { locale: es }));
        }
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };
    const handleTimeChange = (type: "hour" | "minute" | "ampm", value: string) => {
        if (date) {
            const newDate = new Date(date);
            if (type === "hour") {
                newDate.setHours((parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0));
            } else if (type === "minute") {
                newDate.setMinutes(parseInt(value));
            } else if (type === "ampm") {
                const currentHours = newDate.getHours();
                newDate.setHours(value === "PM" ? currentHours + 12 : currentHours - 12);
            }
            setDate(newDate);
        }
    };
    function print() {
        // window.print();
        // document.getElementById("tablaDatos").style.display = "none";
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/dashboard/ventas/agenda/ultimoComentario?idCliente=${idCliente}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            // setDataEmpresa(data);
            setDatosCliente(data);
            setNombreCliente(data[0].nombre_cliente);
            setAsesor(data[0].asesor_comentario);
            // setUltimoComentario(data[0].ultimo_comentario);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (datePayment && filtroMovimientos) {
            calculaMovimientos();
        }
    }, [datePayment, filtroMovimientos]);

    const calculaMovimientos = async () => {
        try {
            const response = await fetch(
                `/api/dashboard/cobranza/agenda/tablaMovimientos?idCliente=${idCliente}&idContrato=${idContrato}&fecha=${fecha}&tipo=${filtroMovimientos}`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            const data = await response.json();
            setMovimientos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const guardar = async () => {
        try {
            const response = await fetch(`/api/dashboard/cobranza/agenda/agregarComentario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idCliente: idCliente,
                    idUsuario: idUsuario,
                    perfilUsuario: perfilUsuario,
                    idContrato: idContrato,
                    fecha: moment(date).format("YYYY-MM-DD HH:mm:ss"),
                    clasificacion: tipoDeClasificacion,
                    monto: montoCompromiso,
                    chkMostrar: chkMostrar,
                    comentario: comentario,
                }),
            });
            console.log(response);
            if (!response.ok) {
                toast({
                    // Llama a la función toast
                    title: "Error",
                    description: "Por favor, comprueba los datos, el comentario no se pudo grabar",
                    variant: "destructive",
                });
                throw new Error(`Failed to fetch data: ${response.status}`);
            } else if (response.ok) {
                toast({
                    title: "Éxito",
                    description: "Comentario guardado correctamente",
                    duration: 2500,
                    variant: "default",
                    style: {
                        background: "#25D366",
                        color: "#fff",
                    },
                });
            } else {
                toast({
                    title: "Error",
                    description: "Algo salio mal en el servidor!!!",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="uppercase ">
                    <MessageSquareDiff size={48} />
                    Nuevo
                </Button>
            </DialogTrigger>
            <DialogContent className=" md:max-w-full sm:min-w-[430px] lg:max-w-[95%] h-[90%]">
                <ScrollArea className="h-6/6 w-full rounded-md border p-4">
                    <DialogHeader>
                        <DialogTitle className="text-center uppercase text-black">
                            AGREGAR NUEVO COMPROMISO DE PAGO A: &nbsp;&nbsp;{nombreCliente != "" ? nombreCliente : ""}
                        </DialogTitle>
                        <Separator className="my-2 bg-slate-300 h-0.5" />

                        <DialogDescription>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 text-black">
                                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <Label htmlFor="fecha">Fecha y hora: </Label>
                                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>MM/DD/YYYY hh:mm aa</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <div className="sm:flex">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={handleDateSelect}
                                                    initialFocus
                                                    locale={es}
                                                />
                                                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                                                    <ScrollArea className="w-64 sm:w-auto">
                                                        <div className="flex sm:flex-col p-2">
                                                            {hours.reverse().map((hour) => (
                                                                <Button
                                                                    key={hour}
                                                                    size="icon"
                                                                    variant={
                                                                        date && date.getHours() % 12 === hour % 12 ? "default" : "ghost"
                                                                    }
                                                                    className="sm:w-full shrink-0 aspect-square"
                                                                    onClick={() => handleTimeChange("hour", hour.toString())}
                                                                >
                                                                    {hour}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                                                    </ScrollArea>
                                                    <ScrollArea className="w-64 sm:w-auto">
                                                        <div className="flex sm:flex-col p-2">
                                                            {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                                                <Button
                                                                    key={minute}
                                                                    size="icon"
                                                                    variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                                                                    className="sm:w-full shrink-0 aspect-square"
                                                                    onClick={() => handleTimeChange("minute", minute.toString())}
                                                                >
                                                                    {minute}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                                                    </ScrollArea>
                                                    <ScrollArea className="">
                                                        <div className="flex sm:flex-col p-2">
                                                            {["AM", "PM"].map((ampm) => (
                                                                <Button
                                                                    key={ampm}
                                                                    size="icon"
                                                                    variant={
                                                                        date &&
                                                                        ((ampm === "AM" && date.getHours() < 12) ||
                                                                            (ampm === "PM" && date.getHours() >= 12))
                                                                            ? "default"
                                                                            : "ghost"
                                                                    }
                                                                    className="sm:w-full shrink-0 aspect-square"
                                                                    onClick={() => handleTimeChange("ampm", ampm)}
                                                                >
                                                                    {ampm}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <Label htmlFor="status">Clasificacion</Label>
                                    <Select onValueChange={setTipoDeClasificacion}>
                                        <SelectTrigger id="status" aria-label="Selecciona clasificacion">
                                            <SelectValue placeholder="Selecciona clasificacion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0" id="0">
                                                Selecciona el Asesor
                                            </SelectItem>
                                            {listaClasificacion.map((tipoClasificacion) => (
                                                <SelectItem
                                                    key={tipoClasificacion.id_clasificacion}
                                                    value={tipoClasificacion.id_clasificacion}
                                                >
                                                    {tipoClasificacion.clasificacion}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <Label htmlFor="compromisopago">Monto Compromiso de pago:</Label>
                                    <Input
                                        placeholder="Ej. 5,000.00"
                                        id="compromisopago"
                                        className="currency-input uppercase"
                                        onChange={(event) => setMontoCompromiso(event.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 items-center flex space-x-2">
                                    <div className="items-center flex space-x-2">
                                        <Checkbox id="chkMostrarCaja" onCheckedChange={(e) => setChkMostrar(!chkMostrar)} />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="terms1"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Mostrar en caja
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <Label htmlFor="fechaPago">Fecha de pago: </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {datePayment ? (
                                                    format(datePayment, "LLL d, yyyy", { locale: es })
                                                ) : (
                                                    <span>Selecciona la fecha</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={datePayment}
                                                onSelect={handleDatePaymentSelect}
                                                initialFocus
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="md:col-span-6 lg:col-span-6 xl:col-span-62 pl-0">
                                    <Label htmlFor="Comentario">Comentario: </Label>
                                    <Textarea
                                        id="Comentario"
                                        name="Comentario"
                                        placeholder="Escribe aqui su comentario"
                                        rows={5}
                                        onChange={(e) => setComentario(e.target.value)}
                                        className="w-[98%] p-2 border-2 rounded-md pl-1 ml-3"
                                    />{" "}
                                    <br />
                                    <Button onClick={guardar}>Guardar</Button>
                                </div>
                                <div className="md:col-span-6 lg:col-span-6 xl:col-span-6">
                                    <label htmlFor="tablaDeMovimientos">Tabla de movimientos:</label>
                                    <div className="flex pt-2 pb-2">
                                        {" "}
                                        {/* Asegura que el contenedor sea flex */}
                                        <RadioGroup defaultValue="todos" orientation="horizontal">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="todos" id="r1" onClick={() => setFiltroMovimientos(1)} />
                                                <Label htmlFor="r1">Todos</Label>
                                                <RadioGroupItem value="mensualidades" id="r2" onClick={() => setFiltroMovimientos(2)} />
                                                <Label htmlFor="r2">Mensualidades</Label>
                                                <RadioGroupItem value="servicios" id="r3" onClick={() => setFiltroMovimientos(3)} />
                                                <Label htmlFor="r3">Servicios</Label>
                                            </div>
                                        </RadioGroup>
                                        <br />
                                    </div>
                                    <TablaMovimientos movimientos={movimientos} />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </ScrollArea>
                <DialogFooter>
                    <SheetClose asChild>
                        <Button>Cerrar</Button>
                    </SheetClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
