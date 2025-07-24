import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon, MessageSquareDiff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";

interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}
interface AltaAgendaProps {
    idCliente: string;
    listaClasificacion: Clasificacion[];
    idUsuario?: string;
    perfilUsuario?: string;
}
interface datosGenerales {
    nombre_cliente: string;
    ultimo_comentario: string;
    asesor_comentario: string;
    interesado: boolean;
}

export function AltaAgenda({ idCliente, listaClasificacion, idUsuario, perfilUsuario }: AltaAgendaProps) {
    const { toast } = useToast();
    const [date, setDate] = React.useState<Date>();
    const [isOpen, setIsOpen] = React.useState(false);
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const [tipoDeClasificacion, setTipoDeClasificacion] = useState<string>("0");
    const [ultimoComentario, setUltimoComentario] = useState<string>("");
    const [comentario, setComentario] = useState<string>("");
    const [asesor, setAsesor] = useState<string>("");
    const [interesado, setInteresado] = useState<boolean>(true);
    const [datosCliente, setDatosCliente] = useState<datosGenerales>({
        nombre_cliente: "",
        ultimo_comentario: "",
        asesor_comentario: "",
        interesado: true,
    });

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
            setUltimoComentario(data[0].ultimo_comentario);
        } catch (error) {
            console.error(error);
        }
    };

    const guardar = async () => {
        try {
            //&idUsuario=${idUsuario}&perfil=${perfilUsuario}
            const response = await fetch(`/api/dashboard/ventas/agenda/agregarComentario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idCliente: idCliente,
                    idUsuario: idUsuario,
                    perfilUsuario: perfilUsuario,
                    fecha: moment(date).format("YYYY-MM-DD HH:mm:ss"),
                    clasificacion: tipoDeClasificacion,
                    comentario: comentario,
                    interesado: interesado,
                }),
            });
            if (!response.ok) {
                toast({
                    // Llama a la función toast
                    title: "Error",
                    description: "Por favor, comprueba los datos, el comentario no se pudo grabar",
                    variant: "destructive",
                });
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            //const result = await response.json();
            //console.log(result.Resultado);
            else if (response.ok) {
                //aqui va el toast
                toast({
                    // Llama a la función toast
                    title: "Éxito",
                    description: "Comentario guardado correctamente",
                    duration: 2500,
                    variant: "default",
                    style: {
                        background: "#25D366",
                        color: "#fff",
                    },
                });
                //router.push(`/private/dashboard/ventas/alta/${result}`);
                // redirect(`/private/dashboard/ventas/alta/${result}`);
            } else {
                toast({
                    // Llama a la función toast
                    title: "Error",
                    description: "Por favor, comprueba los datos, el prospecto no puede ser agregado",
                    variant: "destructive",
                });
            }

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    // console.log(datosCliente);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" onClick={fetchData} className="uppercase ">
                    <MessageSquareDiff size={48} />
                    Nuevo
                </Button>
            </DialogTrigger>
            <DialogContent className=" md:max-w-full sm:min-w-[430px] lg:max-w-[95%] h-[70%]">
                <ScrollArea className="h-6/6 w-full rounded-md border p-4">
                    <DialogHeader>
                        <DialogTitle className="text-center uppercase text-black">
                            AGREGAR NUEVO COMENTARIO A: &nbsp;&nbsp;{nombreCliente != "" ? nombreCliente : ""}
                        </DialogTitle>
                        <Separator className="my-2 bg-slate-300 h-0.5" />

                        <DialogDescription>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 text-black">
                                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
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
                                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
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
                                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                                    <Label htmlFor="nombreCliente">Asesor: </Label>
                                    <span id="nombreCliente" className="text-justify bg-slate-100 p-2 text-sm uppercase">
                                        &nbsp;{asesor}{" "}
                                    </span>
                                </div>
                                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3 flex items-center space-x-2">
                                    <Label htmlFor="nombreCliente">Interesado: </Label>
                                    <RadioGroup defaultValue="si" orientation="horizontal">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="si" id="r1" onClick={() => setInteresado(true)} />
                                            <Label htmlFor="r1">SI</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="r2" onClick={() => setInteresado(false)} />
                                            <Label htmlFor="r2">NO</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12">
                                    <Label htmlFor="ultimoComentario" className="text-lg">
                                        Ultimo Comentario:{" "}
                                    </Label>
                                    <span id="ultimoComentario" className="text-justify bg-slate-100 p-2 text-sm">
                                        &nbsp;{ultimoComentario}
                                    </span>
                                </div>
                                <div className="md:col-span-12 lg:col-span-12 xl:col-span-12 pl-0">
                                    <Label htmlFor="Comentario">Comentario: </Label>
                                    <Textarea
                                        id="Comentario"
                                        name="Comentario"
                                        placeholder="Escribe aqui su comentario"
                                        rows={5}
                                        onChange={(e) => setComentario(e.target.value)}
                                        className="w-[98%] p-2 border-2 rounded-md pl-1 ml-3"
                                    />
                                </div>
                                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <Button onClick={guardar}>Guardar</Button>
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
