// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast, toast } from "@/hooks/use-toast";
import TablaConceptos from "@/components/client/dashboard/cobranza/cartaDevolucion/tablaConceptos";
import TablaPagos from "@/components/client/dashboard/cobranza/cartaDevolucion/tablaPagos";
import { set } from "lodash";

// const cargoCancelacion = 20.0;
interface DatosCartaCancelacionProps {
    id_contrato: number;
    id_usuario: number;
    perfil_usuario: number;
    nombre_cliente: string;
    precio_inicial: number;
}

interface Concepto {
    concepto: string;
    monto: number;
    orden: number;
}
interface Pago {
    nopago_texto: string;
    no_pago: number;
    fecha: string; // Storing as string in "dd/MM/yyyy" format
    monto: number;
    comentarios: string;
}

export function DatosCartaCancelacion({
    id_contrato,
    id_usuario,
    perfil_usuario,
    nombre_cliente,
    precio_inicial,
}: DatosCartaCancelacionProps) {
    const { toast } = useToast();
    const [date, setDate] = React.useState<Date>();
    const [fechaInicial, setFechaInicial] = useState("");
    // const [isOpen, setIsOpen] = React.useState(false);
    // const [clienteNombre, setClienteNombre] = useState<string>("cliente de prueba");
    // const [montoCompromiso, setMontoCompromiso] = useState<string>("");

    // New state for the current concept being added
    const [currentConcepto, setCurrentConcepto] = useState<string>("");
    const [currentMonto, setCurrentMonto] = useState<string>("");
    const [currentOrden, setCurrentOrden] = useState<number>(3);
    const [cargoCancelacion, setCargoCancelacion] = useState<number>(20.0);

    const [numeroPagos, setNumeroPagos] = useState<number>(0);
    const [montoMensual, setMontoMensual] = useState<number>(0);
    const [primerPago, setPrimerPago] = useState<number>(0);
    const [notaInterna, setNotaInterna] = useState<string>("");
    const [notaCarta, setNotaCarta] = useState<string>("");

    // const tPagos:Pago[]=[];

    // State to hold the array of concepts
    const [conceptos, setConceptos] = useState<Concepto[]>([]);
    const [pagos, setPagos] = useState<Pago[]>([]);

    const fetchData = async () => {
        try {
            setConceptos([]);
            setDate(new Date());
            setPagos([]);
            setNotaInterna("");
            setNotaCarta("");
            const response = await fetch(`/api/dashboard/cobranza/cartaDevolucion/conceptosIniciales?idContrato=${id_contrato}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                data.map((concepto) => {
                    const conceptoObjeto: Concepto = {
                        concepto: concepto.concepto,
                        monto: parseFloat(concepto.monto),
                        orden: parseInt(concepto.orden),
                    };
                    setConceptos((prevConceptos) => [...prevConceptos, conceptoObjeto]);
                });

                const notas = await fetch(`/api/dashboard/cobranza/cartaDevolucion/notasCarta?idContrato=${id_contrato}`);
                const pagos = await fetch(`/api/dashboard/cobranza/cartaDevolucion/pagosCarta?idContrato=${id_contrato}`);

                const pagosLista = await pagos.json();
                const notasLista = await notas.json();

                pagosLista.map((pago: Pago) => {
                    const pagoObjeto: Pago = {
                        nopago_texto: pago.nopago_texto,
                        no_pago: pago.no_pago,
                        fecha: pago.fecha,
                        monto: parseFloat(pago.monto.toString()),
                        comentarios: pago.comentarios,
                    };
                    setPagos((prevPagos) => [...prevPagos, pagoObjeto]);
                });
                setNotaInterna(notasLista[0].notas1);
                setNotaCarta(notasLista[0].notas2);
            } else {
                const totalPagado: Concepto = {
                    concepto: "Pagado hasta el momento",
                    monto: parseFloat(data.totalPagado) > 0 ? parseFloat(data.totalPagado) : 0,
                    orden: 1,
                };

                const cargoCancelacionCarta: Concepto = {
                    concepto: `Cargo de cancelación (${cargoCancelacion}%)`,
                    monto: parseFloat(data.cargoCancelacion),
                    orden: 2,
                };

                setConceptos((prevConceptos) => [...prevConceptos, totalPagado]);
                setConceptos((prevConceptos) => [...prevConceptos, cargoCancelacionCarta]);
            }

            // console.log(conceptos);
        } catch (error) {}
    };

    useEffect(() => {
        if (date) {
            // Check for both from and to dates
            setFechaInicial(format(date, "yyyy-MM-dd", { locale: es }));
        } else {
            setFechaInicial("");
        }
    }, [date]); // Update fInicio and fFin whenever date changes

    const handleGenerarPagos = async () => {
        const total = conceptos.reduce((acum, concepto) => acum + concepto.monto, 0);
        let pago: number = 0.0;
        const tPagos: Pago[] = [];

        if (primerPago > 0) {
            pago = numeroPagos != 0 ? (total - primerPago) / (numeroPagos - 1) : montoMensual;
        } else {
            pago = numeroPagos != 0 ? total / numeroPagos : montoMensual;
        }
        pago = parseFloat(pago.toFixed(2));

        let fecha: Date = new Date(fechaInicial + "T00:00:00"); // Add T00:00:00 to avoid timezone issues
        let no_pagos: number;
        if (numeroPagos != 0) {
            no_pagos = numeroPagos;
        } else {
            no_pagos = Math.floor(total / pago);
        }

        let totalRestante = total;

        for (let x = 0; x < no_pagos; x++) {
            const r: Pago = {
                nopago_texto: "", // Will be filled
                no_pago: 0, // Will be filled
                fecha: "", // Will be filled
                monto: 0, // Will be filled
                comentarios: "", // Initial empty comment
            };
            r.nopago_texto = `${x + 1}/${no_pagos}`;
            r.no_pago = x + 1;

            // Check if the current date is Sunday and add a day if it is
            if (fecha.getDay() === 0) {
                // Sunday is 0 in JavaScript's getDay()
                fecha.setDate(fecha.getDate() + 1);
            }
            r.fecha = fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }); // Format as "dd/MM/yyyy"

            let currentPagoMonto = pago; // Start with the calculated payment amount

            // Adjust the last payment to cover any remaining total
            if (x + 1 === no_pagos) {
                currentPagoMonto = totalRestante; // The last payment should cover the rest
                if (currentPagoMonto < 0) {
                    currentPagoMonto = 0;
                }
            }

            // Handle the first payment if primer_pago is set
            if (primerPago > 0 && x === 0) {
                r.monto = primerPago;
                totalRestante -= primerPago;
            } else {
                r.monto = currentPagoMonto;
                totalRestante -= currentPagoMonto;
            }

            r.monto = parseFloat(r.monto.toFixed(2)); // Ensure amounts are rounded to 2 decimal places

            tPagos.push(r); // Add the payment row to the array
            for (let y = 1; y <= 30; y++) {
                fecha.setDate(fecha.getDate() + 1);
                if (fecha.getDay() === 0) {
                    // Sunday is 0 in JavaScript's getDay()
                    fecha.setDate(fecha.getDate() + 1);
                }
            }
        }
        //console.log(tPagos);
        setPagos(tPagos);
    };

    // Function to handle adding a new concept
    const handleAddConcepto = () => {
        // Validate inputs
        if (!currentConcepto.trim()) {
            toast({
                title: "Error",
                description: "El concepto no puede estar vacío.",
                variant: "destructive",
            });
            return;
        }

        const parsedMonto = parseFloat(currentMonto);
        // if (isNaN(parsedMonto) || parsedMonto <= 0) {
        if (isNaN(parsedMonto)) {
            toast({
                title: "Error",
                description: "El monto del concepto debe ser un número válido.",
                variant: "destructive",
            });
            return;
        }
        // const setCurrentOrden = currentOrden + 1;
        const newConcepto: Concepto = {
            concepto: currentConcepto.trim(),
            monto: parsedMonto,
            orden: currentOrden + 1,
        };

        // Add the new concept to the existing array of concepts
        setConceptos((prevConceptos) => [...prevConceptos, newConcepto]);

        // Clear the input fields after adding
        setCurrentConcepto("");
        setCurrentMonto("");

        toast({
            title: "Concepto Agregado",
            description: `"${newConcepto.concepto}" con monto $${newConcepto.monto.toFixed(2)} ha sido agregado.`,
        });
    };

    const handleCalcularCargo = async () => {
        const cargoOriginal = conceptos.find((concepto) => concepto.orden === 2);
        const cargo = (cargoOriginal?.monto ? cargoOriginal.monto : 0) * -1;

        const precioOriginal = precio_inicial;
        const montoCargoCancelacion = ((precioOriginal * cargoCancelacion) / 100.0) * -1;
        const montoRedondeado = parseFloat(montoCargoCancelacion.toFixed(2));

        const conceptosActualizados = conceptos.map((concepto) => {
            if (concepto.orden === 2) {
                // Find the "Cargo de cancelación" concept (orden: 2)
                return {
                    ...concepto, // Keep existing properties
                    monto: montoRedondeado, // Update the monto
                    concepto: `Cargo de cancelación (${cargoCancelacion.toFixed(2)}%)`, // Optionally update the concept text as well
                };
            }
            return concepto; // Return other concepts as they are
        });
        setConceptos(conceptosActualizados);
    };
    // console.log(datosCliente);
    const handleNotaInterna = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newData = event.target.value;
        setNotaInterna(newData);
    };
    const handleNotaCarta = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newData = event.target.value;
        setNotaCarta(newData);
    };
    return (
        <>
            <Dialog>
                <DialogTrigger asChild onClick={fetchData}>
                    <Button variant="ghost" className="uppercase ">
                        <MessageSquareDiff size={48} />
                        Generar o Editar
                        {/* Nuevo */}
                    </Button>
                </DialogTrigger>
                <DialogContent className=" md:max-w-full sm:min-w-[430px] lg:max-w-[70%] h-[85%]">
                    <ScrollArea className="h-6/6 w-full rounded-md border p-4">
                        <DialogHeader>
                            <DialogTitle className="text-center uppercase text-black">
                                DATOS CARTA DEVOLUCION: &nbsp;&nbsp;{nombre_cliente != "" ? nombre_cliente : ""}
                            </DialogTitle>
                            <Separator className="my-2 bg-slate-300 h-0.5" />

                            <DialogDescription>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 text-black">
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    <div className="md:col-span-10 lg:col-span-10 xl:col-span-10 p-4 items-center flex space-x-2">
                                        <Label htmlFor="concepto">Concepto:</Label>
                                        <Input
                                            id="concepto"
                                            className="uppercase max-w-[40%]"
                                            value={currentConcepto} // Bind value to state
                                            onChange={(event) => setCurrentConcepto(event.target.value)}
                                        />
                                        <Label htmlFor="montoConcepto">Monto Concepto:</Label>
                                        <Input
                                            id="montoConcepto"
                                            className="uppercase w-[180px]"
                                            value={currentMonto} // Bind value to state
                                            onChange={(event) => setCurrentMonto(event.target.value)}
                                        />
                                        <Button id="btnAregarConcepto" onClick={handleAddConcepto}>
                                            Agregar
                                        </Button>
                                        <Button>Cancelar</Button>
                                    </div>
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    {/* ---------- ROW 1 ---------- */}
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    <div className="md:col-span-10 lg:col-span-10 xl:col-span-10 p-4 items-center flex space-x-2">
                                        <Label htmlFor="porcentajeCargoCancelacion">Porcentaje cargo cancelacion:</Label>
                                        <Input
                                            placeholder={`${cargoCancelacion.toFixed(2)}%`}
                                            id="porcentajeCargoCancelacion"
                                            className="uppercase w-[180px]"
                                            onChange={(event) => setCargoCancelacion(parseFloat(event.target.value))}
                                        />
                                        <Button onClick={handleCalcularCargo}>Ajustar cargo</Button>
                                    </div>
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    {/* ---------- ROW 2 ---------- */}
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    <div className="md:col-span-10 lg:col-span-10 xl:col-span-10 p-4 items-center flex space-x-2">
                                        <TablaConceptos conceptos={conceptos} />
                                    </div>
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    {/* ---------- ROW 3 ---------- */}
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 p-4 items-center flex space-x-2">
                                        <Label htmlFor="no_pagos"># de pagos:</Label>
                                        <Input
                                            id="no_pagos"
                                            className="uppercase max-w-[full]"
                                            onChange={(event) => setNumeroPagos(parseInt(event.target.value))}
                                        />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 p-4 items-center flex space-x-2">
                                        <Label htmlFor="status">Fecha inicial</Label>
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
                                                    {date ? format(date, "LLL dd, y", { locale: es }) : <span>Elige el dia</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="md:col-span-3 lg:col-span-3 xl:col-span-3 p-4 items-center flex space-x-2">
                                        <Label htmlFor="monto_mensual">Monto mensual:</Label>
                                        <Input
                                            id="monto_mensual"
                                            className="uppercase max-w-[full]"
                                            onChange={(event) => setMontoMensual(parseFloat(event.target.value))}
                                        />
                                    </div>
                                    <div className="md:col-span-3 lg:col-span-3 xl:col-span-3 p-4 items-center flex space-x-2">
                                        <Label htmlFor="primer_pago">Primer pago:</Label>
                                        <Input
                                            id="primer_pago"
                                            className="uppercase max-w-[full]"
                                            onChange={(event) => setPrimerPago(parseFloat(event.target.value))}
                                        />
                                    </div>
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    {/* ---------- ROW 4 ---------- */}
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    <div className="md:col-span-10 lg:col-span-10 xl:col-span-10 p-4 items-center flex space-x-2">
                                        <Label htmlFor="nota_interna">Nota Interna:</Label>
                                        <Textarea
                                            id="nota_interna"
                                            className="uppercase max-w-[full]"
                                            onBlur={handleNotaInterna}
                                            defaultValue={notaInterna}
                                        />
                                    </div>
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    {/* ---------- ROW 5 ---------- */}
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    <div className="md:col-span-10 lg:col-span-10 xl:col-span-10 p-4 items-center flex space-x-2">
                                        <Label htmlFor="nota_carta">Nota para la Carta:</Label>
                                        <Textarea
                                            id="nota_carta"
                                            className="uppercase max-w-[full]"
                                            onBlur={handleNotaCarta}
                                            defaultValue={notaCarta}
                                        />
                                    </div>
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    {/* ---------- ROW 2 ---------- */}
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    <div className="md:col-span-11 lg:col-span-11 xl:col-span-11 p-4 items-center flex space-x-2">
                                        <Button id="btnGeneraPagos" onClick={handleGenerarPagos}>
                                            Generar Pagos
                                        </Button>
                                        <Button>Guardar Carta</Button>
                                    </div>
                                    <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-4"></div>
                                    <div className="md:col-span-10 lg:col-span-10 xl:col-span-10 p-4 items-center flex space-x-2">
                                        <TablaPagos pagos={pagos} />
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </ScrollArea>
                    <DialogFooter>
                        {/* <SheetClose asChild>
                        <Button>Cerrar</Button>
                    </SheetClose> */}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
