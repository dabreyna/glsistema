"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useSeguimientoSolicitudesFiltrosConsultaStore } from "@/app/store/dashboard/atencionCliente/seguimientoSolicitudes/filtrosConsultaStore";

import { useRouter } from "next/navigation";
// import Link from "next/link";
import GeneraDOC from "../../cobranza/citatorios/documentos/generaDoc";
// import { id } from "date-fns/locale";
import { toast, useToast } from "@/hooks/use-toast";
import { BookX, FileDown, Square, SquareX } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";

export default function TablaDatos() {
    const toast = useToast();
    // const idFraccionamiento = useEstadoDeCuentaFiltrosConsultaStore((state) => state.idFraccionamiento);
    const idServicio = useSeguimientoSolicitudesFiltrosConsultaStore((state) => state.idServicio);
    const clientes = useSeguimientoSolicitudesFiltrosConsultaStore((state) => state.resultados);
    // const router = useRouter();
    // const handleDetallesCliente = (id_cliente: string) => {
    //     if (id_cliente != "") {
    //         router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
    //     }
    // };
    const getSemaforoComponent = (semaforo: string) => {
        // console.log(semaforo);
        // console.log(typeof cliente.estado);
        switch (Number(semaforo)) {
            case -1:
                return <Square className="bg-red-500 text-red-500 rounded w-[30px] h-[30px]" />;
            case 2:
                return <Square className="bg-amber-500 text-amber-500 rounded  w-[30px] h-[30px]" />;
            case 1:
                return <Square className="bg-green-500 text-green-500 rounded  w-[30px] h-[30px]" />;
            case 3:
                return <Square className="bg-blue-500 text-blue-500 rounded  w-[30px] h-[30px]" />;
            case 0:
                return <SquareX className="bg-red-500 text-white rounded" />; // Corrected text color
            default:
                return null; // Or a default component if needed
        }
    };
    const actualizarDatos = (id_solicitud_servicio: string, newData: string, col: string, modulo: number) => {
        // console.log(id_solicitud_servicio, newData, col);
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/atencionCliente/actualizarDato?id_solicitud_servicio=${id_solicitud_servicio}&newData=${newData}&col=${col}&modulo=${modulo}`
                );
                if (!response.ok) {
                    toast.toast({
                        title: "ERROR",
                        description: "Algo sucedio y no se pudo actualizar la informacion, intentalo de nuevo.",
                        variant: "destructive",
                        duration: 1750,
                    });
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                toast.toast({
                    title: `ORDEN EJECUTADA`,
                    description: `Datos actualizados exitosamente.`,
                    variant: "primary",
                    duration: 1750,
                });
                const data = await response.json();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    };

    let cont = 0;
    // console.log(idServicio);
    function tbl_471() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-white">#</TableHead>
                        <TableHead className="text-white">Cliente</TableHead>
                        <TableHead className="text-white">Usuario</TableHead>
                        <TableHead className="w-[160px] text-white">Nomenclatura</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead>
                        <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-white">Estado</TableHead>
                        <TableHead className="text-white">
                            Medio de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de envio
                            <br />
                            contrato CESPM
                        </TableHead>
                        <TableHead className="text-white">Cuenta CESPM</TableHead>
                        <TableHead className="text-white">
                            Fecha Solcitud <br />
                            Descubrimiento
                        </TableHead>
                        <TableHead className="text-white">
                            Medidor <br />
                            Instalado
                        </TableHead>
                        <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(cliente.id_solicitud_servicio, newData, col, 1);
                            };

                            return (
                                <>
                                    <TableRow key={cliente.id_contrato}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        <TableCell className="text-left text-xs p-1 max-w-[185px]">{cliente.cliente}</TableCell>
                                        <TableCell className="text-left uppercase text-xs p-1">{cliente.nombreusuario}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{cliente.nomenclatura}</TableCell>
                                        {/* <TableCell className="text-left text-xs p-1">{cliente.fraccionamiento}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_manzana}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_terreno}</TableCell> */}
                                        <TableCell className="text-center font-medium text-xs p-1 w-[50px]"> 
                                            {getSemaforoComponent(cliente.estado)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.medio_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.fecha_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_envio_contrato_cespm ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_30"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_envio_contrato_cespm} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_30"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.cuenta_cespm ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[110px]"
                                                    placeholder=""
                                                    id="c_31"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.cuenta_cespm} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[110px]"
                                                    placeholder=""
                                                    id="c_31"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_descubrimiento ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_32"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_descubrimiento} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_32"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_medidor_cespm} */}
                                            {cliente.fecha_medidor_cespm ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_33"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_medidor_cespm} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_33"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1 flex items-center justify-center space-x-2">
                                            <BookX size={24} className=" rounded-sm hover:text-red-500" onClick={()=>actualizarDatos(cliente.id_solicitud_servicio, '0', 'c_5', 1)}/>
                                            {cliente.archivo && cliente.archivo.trim() !== '' ? ( 
                                                <a
                                                    href={`../documentos/atencion_a_clientes/${cliente.archivo}`}
                                                    download={`${cliente.archivo}`}
                                                    target="_blank"
                                                    // rel="noopener noreferrer"
                                                    // className="inline-block ml-2"
                                                >
                                                    <FileDown
                                                        size={24}
                                                        className="rounded-sm hover:text-green-600 cursor-pointer"
                                                    />
                                                </a>
                                            ) : (
                                                <>  </>
                                            // <FileDown size={24} className=" rounded-sm hover:bg-red-500"/>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }
    function tbl_472() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-white">#</TableHead>
                        <TableHead className="text-white">Cliente</TableHead>
                        <TableHead className="text-white">Usuario</TableHead>
                        <TableHead className="w-[160px] text-white">Nomenclatura</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead>
                        <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-white">Estado</TableHead>
                        <TableHead className="text-white">
                            Medio de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de envio
                            <br />
                            solicitud CFE
                        </TableHead>
                        <TableHead className="text-white">
                            Folio de <br /> Seguimiento
                        </TableHead>
                        <TableHead className="text-white">
                            Medidor <br />
                            Instalado
                        </TableHead>
                        <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(cliente.id_solicitud_servicio, newData, col, 1);
                            };
                            return (
                                <>
                                    <TableRow key={cliente.id_contrato}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        <TableCell className="text-left text-xs p-1 max-w-[185px]">{cliente.cliente}</TableCell>
                                        <TableCell className="text-left uppercase text-xs p-1">{cliente.nombreusuario}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{cliente.nomenclatura}</TableCell>
                                        {/* <TableCell className="text-left text-xs p-1">{cliente.fraccionamiento}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_manzana}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_terreno}</TableCell> */}
                                        <TableCell className="text-center font-medium text-xs p-1">
                                            {getSemaforoComponent(cliente.estado)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.medio_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.fecha_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_envio_solicitud_cfe ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_34"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_envio_solicitud_cfe} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_34"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.folio_seguimiento_cfe ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[110px]"
                                                    placeholder=""
                                                    id="c_35"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.folio_seguimiento_cfe} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[110px]"
                                                    placeholder="Ej.A1505976984"
                                                    id="c_35"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_medidor_cfe ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_36"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_medidor_cfe} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_36"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            <BookX size={24} className=" rounded-sm hover:bg-red-500" onClick={()=>actualizarDatos(cliente.id_solicitud_servicio, '0', 'c_5', 1)}/>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }
    function tbl_475() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-white">#</TableHead>
                        <TableHead className="text-white">Cliente</TableHead>
                        <TableHead className="text-white">Usuario</TableHead>
                        <TableHead className="w-[160px] text-white">Nomenclatura</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead>
                        <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-white">Estado</TableHead>
                        <TableHead className="text-white">
                            Medio de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de <br />
                            Marcado
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha Carta
                            <br />
                            Lista P/Entrega
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha Entrega
                            <br /> a Cliente
                        </TableHead>
                        <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(cliente.id_solicitud_servicio, newData, col, 1);
                            };
                            return (
                                <>
                                    <TableRow key={cliente.id_contrato}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        <TableCell className="text-left text-xs p-1 max-w-[185px]">{cliente.cliente}</TableCell>
                                        <TableCell className="text-left uppercase text-xs p-1">{cliente.nombreusuario}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{cliente.nomenclatura}</TableCell>
                                        {/* <TableCell className="text-left text-xs p-1">{cliente.fraccionamiento}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_manzana}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_terreno}</TableCell> */}
                                        <TableCell className="text-center font-medium text-xs p-1">
                                            {getSemaforoComponent(cliente.estado)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.medio_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.fecha_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_marcado ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_9"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_marcado} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_9"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_carta_lista_entrega ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_10"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_carta_lista_entrega} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_10'"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_entrega_cliente ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_11"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_entrega_cliente} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_11"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            <BookX size={24} className=" rounded-sm hover:bg-red-500" onClick={()=>actualizarDatos(cliente.id_solicitud_servicio, '0', 'c_5', 1)}/>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }
    function tbl_477() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-white">#</TableHead>
                        <TableHead className="text-white">Cliente</TableHead>
                        <TableHead className="text-white">Usuario</TableHead>
                        <TableHead className="w-[160px] text-white">Nomenclatura</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead>
                        <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-white">Estado</TableHead>
                        <TableHead className="text-white">
                            Medio de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de <br />
                            Solicitud
                        </TableHead>

                        <TableHead className="text-white">
                            Fecha revision <br /> contraloria
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha Carta
                            <br />
                            Recepcion Cliente
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha 1a
                            <br /> instalacion
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha 2a
                            <br /> instalacion
                        </TableHead>
                        <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(cliente.id_solicitud_servicio, newData, col, 1);
                            };
                            return (
                                <>
                                    <TableRow key={cliente.id_contrato}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        <TableCell className="text-left text-xs p-1 max-w-[185px]">{cliente.cliente}</TableCell>
                                        <TableCell className="text-left uppercase text-xs p-1">{cliente.nombreusuario}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{cliente.nomenclatura}</TableCell>
                                        {/* <TableCell className="text-left text-xs p-1">{cliente.fraccionamiento}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_manzana}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_terreno}</TableCell> */}
                                        <TableCell className="text-center font-medium text-xs p-1">
                                            {getSemaforoComponent(cliente.estado)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.medio_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.fecha_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_revision_contraloria ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_19"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_revision_contraloria} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_19"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_carta_recepcion_cliente ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_14"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_carta_recepcion_cliente} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_14"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_instalacion_1 ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_15"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_instalacion_1} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_15"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_instalacion_2 ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_16"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_instalacion_2} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_16"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            <BookX size={24} className=" rounded-sm hover:bg-red-500" onClick={()=>actualizarDatos(cliente.id_solicitud_servicio, '0', 'c_5', 1)}/>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }
    function tbl_479() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full] overflow-x-auto">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white overflow-x-auto">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-xs px-0 text-white">#</TableHead>
                        <TableHead className="text-center  text-xs px-1 text-white">Cliente</TableHead>
                        <TableHead className="text-center  text-xs px-1 text-white">Usuario</TableHead>
                        <TableHead className="w-[160px] text-white">Nomenclatura</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead>
                        <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-center  text-xs px-2 text-white">Estado</TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Medio de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-center  text-xs px-1 text-white">Transformador</TableHead>
                        <TableHead className="text-center  text-xs px-1 text-white">
                            Fecha Solicitud <br />
                            Presupuesto
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha Presupuesto
                            <br /> Recibido
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha Revision <br />
                            Contraloria
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha Presupuesto
                            <br /> Autorizado
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha Entrega
                            <br />
                            de Paquete
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha Presupuesto <br />
                            Conexion
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha Pago
                            <br /> Presupuesto
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha de
                            <br /> Conexion
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha Solicitud
                            <br /> de Contrato
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">
                            Fecha instalacion <br />
                            Medidor
                        </TableHead>
                        <TableHead className="text-center  text-xs px-2 text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            if (cliente.id_solicitud_servicio) {
                                cont++;
                            }
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(cliente.id_solicitud_servicio, newData, col, 1);
                            };
                            return (
                                <>
                                    <TableRow key={cliente.id_contrato}>
                                        <TableCell className="text-center text-xs px-0">
                                            {cliente.id_solicitud_servicio ? cont : ""}
                                        </TableCell>
                                        <TableCell className="text-left text-xs p-1 max-w-[185px]">{cliente.cliente}</TableCell>
                                        <TableCell className="text-left uppercase text-xs p-1">{cliente.nombreusuario}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{cliente.nomenclatura}</TableCell>
                                        {/* <TableCell className="text-left text-xs p-1">{cliente.fraccionamiento}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_manzana}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_terreno}</TableCell> */}
                                        <TableCell className="text-center font-medium text-xs p-1">
                                            {getSemaforoComponent(cliente.estado)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.medio_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.fecha_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.transformador ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[60px]"
                                                    placeholder="Ej. T55"
                                                    id="c_7"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.transformador} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[60px]"
                                                    placeholder="Ej. T55"
                                                    id="c_7"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_solicitud_presupuesto ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_17"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_solicitud_presupuesto} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_17"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_presupuesto_recibido ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_18"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_presupuesto_recibido} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_18"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_revision_contraloria ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_19"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_revision_contraloria} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_19"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_presupuesto_autorizado ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_20"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_presupuesto_autorizado} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_20"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_entrega_paquete ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_21"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_entrega_paquete} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_21"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_presupuesto_conexion ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_22"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_presupuesto_conexion} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_22"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_pago_presupuesto ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_23"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_pago_presupuesto} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_23"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_conexion ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_24"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_conexion} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_24"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_solicitud_contrato ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_25"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_solicitud_contrato} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_25"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_instalacion_medidor ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_26"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_instalacion_medidor} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_26"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            <BookX size={24} className=" rounded-sm hover:bg-red-500" onClick={()=>actualizarDatos(cliente.id_solicitud_servicio, '0', 'c_5', 1)}/>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }
    function tbl_487() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-white">#</TableHead>
                        <TableHead className="text-white">Cliente</TableHead>
                        <TableHead className="text-white">Usuario</TableHead>
                        <TableHead className="w-[160px] text-white">Nomenclatura</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead>
                        <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-white">Estado</TableHead>
                        <TableHead className="text-white">
                            Medio de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de <br />
                            Solicitud
                        </TableHead>

                        <TableHead className="text-white">
                            Fecha revision <br /> contraloria
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha Carta
                            <br />
                            Lista P/Entrega
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha entrega
                            <br /> Cliente
                        </TableHead>
                        <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(cliente.id_solicitud_servicio, newData, col, 4);
                            };
                            return (
                                <>
                                    <TableRow key={cliente.id_contrato}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        <TableCell className="text-left text-xs p-1 max-w-[185px]">{cliente.cliente}</TableCell>
                                        <TableCell className="text-left uppercase text-xs p-1">{cliente.nombreusuario}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{cliente.nomenclatura}</TableCell>
                                        {/* <TableCell className="text-left text-xs p-1">{cliente.fraccionamiento}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_manzana}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_terreno}</TableCell> */}
                                        <TableCell className="text-center font-medium text-xs p-1">
                                            {getSemaforoComponent(cliente.estado)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.medio_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.fecha_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_revision_contraloria ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_19"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_revision_contraloria} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_19"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_carta_lista_entrega ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_10"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_carta_lista_entrega} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_10"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_entrega_cliente ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_11"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_entrega_cliente} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_11"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center text-xs p-1">
                                            <BookX size={24} className=" rounded-sm hover:bg-red-500" onClick={()=>actualizarDatos(cliente.id_solicitud_servicio, '0', 'c_5', 1)}/>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }
    function tbl_500() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-white">#</TableHead>
                        <TableHead className="text-white">Cliente</TableHead>
                        <TableHead className="text-white">Usuario</TableHead>
                        <TableHead className="w-[160px] text-white">Nomenclatura</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead>
                        <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-white">Estado</TableHead>
                        <TableHead className="text-white">
                            Medio de <br />
                            Solicitud
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha de <br />
                            Solicitud
                        </TableHead>

                        <TableHead className="text-white">
                            Fecha envío <br /> de ptto.
                        </TableHead>
                        <TableHead className="text-white">
                            Medio de envío
                            <br />
                            Ppto.
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha Pago
                            <br /> anticipo
                        </TableHead>
                        <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(cliente.id_solicitud_servicio, newData, col, 1);
                            };
                            return (
                                <>
                                    <TableRow key={cliente.id_contrato}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        <TableCell className="text-left text-xs p-1 max-w-[185px]">{cliente.cliente}</TableCell>
                                        <TableCell className="text-left uppercase text-xs p-1">{cliente.nombreusuario}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{cliente.nomenclatura}</TableCell>
                                        {/* <TableCell className="text-left text-xs p-1">{cliente.fraccionamiento}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_manzana}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_terreno}</TableCell> */}
                                        <TableCell className="text-center font-medium text-xs p-1">
                                            {getSemaforoComponent(cliente.estado)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.medio_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.fecha_solicitud}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_envio_presupuesto ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_27"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_envio_presupuesto} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_27"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.medio_envio_presupuesto ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="WHATSAPP"
                                                    id="c_28"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.medio_envio_presupuesto} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="EJ. WHATSAPP"
                                                    id="c_28"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_pago_anticipo ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_29"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_pago_anticipo} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="c_29"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            <BookX size={24} className=" rounded-sm hover:bg-red-500" onClick={()=>actualizarDatos(cliente.id_solicitud_servicio, '0', 'c_5', 1)}/>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }
    function tbl_501() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px]">#</TableHead>
                        <TableHead className="text-white">Cliente</TableHead>
                        <TableHead className="text-white">Usuario</TableHead>
                        <TableHead className="w-[160px] text-white">Nomenclatura</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead>
                        <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-white">Estado</TableHead>
                        <TableHead className="text-white">
                            Fecha inicio <br />
                            (pago anticipado)
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha revision <br /> contraloria
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha solicitud <br />
                            documentos a Gestor
                        </TableHead>
                        <TableHead className="text-white">
                            Fecha firma
                            <br />
                            Notaria
                        </TableHead>
                        <TableHead className="text-white">
                            Recepcion
                            <br /> Escritura
                        </TableHead>
                        <TableHead className="text-white">
                            Escritura
                            <br /> escaneada
                        </TableHead>
                        <TableHead className="text-white">
                            Entrega a
                            <br /> Cliente
                        </TableHead>
                        <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {clientes.map((cliente) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(cliente.id_solicitud_servicio, newData, col, 3);
                            };
                            return (
                                <>
                                    <TableRow key={cliente.id_contrato}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        <TableCell className="text-left text-xs">{cliente.cliente}</TableCell>
                                        <TableCell className="text-left uppercase text-xs">{cliente.nombreusuario}</TableCell>
                                        <TableCell className="text-left text-xs">{cliente.nomenclatura}</TableCell>
                                        {/* <TableCell className="text-left text-xs">{cliente.fraccionamiento}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_manzana}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{cliente.no_terreno}</TableCell> */}
                                        <TableCell className="text-center font-medium text-xs p-1">
                                            {getSemaforoComponent(cliente.estado)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_pago_anticipo ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="fecha_pago_anticipo"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_pago_anticipo} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="fecha_pago_anticipo"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {cliente.fecha_revision_contraloria ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="fecha_revision_contraloria"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_revision_contraloria} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="fecha_revision_contraloria"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {cliente.fecha_entrega_cliente ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="fecha_entrega_cliente"
                                                    onBlur={handleDataChange}
                                                    defaultValue={cliente.fecha_entrega_cliente} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="dd/mm/aaaa"
                                                    id="fecha_entrega_cliente"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1"></TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }

    return (
        <>
            <div className="flex justify-end p-2">
                {/* Botón PDF (Comentado) */}
                <Square className="bg-green-500 text-green-500 rounded  w-[20px] h-[20px] " />
                &nbsp; EN CURSO &nbsp;
                <Square className="bg-amber-500 text-amber-500 rounded  w-[20px] h-[20px]" />
                &nbsp; ATRASADO&nbsp;
                <Square className="bg-blue-500 text-blue-500 rounded  w-[20px] h-[20px]" />
                &nbsp; CONCLUIDO&nbsp;
                <SquareX className="bg-red-500 text-white rounded w-[20px] h-[20px]" />
                &nbsp; CANCELADO&nbsp;
            </div>

            {(() => {
                switch (idServicio) {
                    case "471":
                        return tbl_471(); // Retorna el resultado de la función
                    case "472":
                        return tbl_472(); // Retorna el resultado de la función
                    case "475":
                        return tbl_475(); // Retorna el resultado de la función
                    case "477":
                        return tbl_477(); // Retorna el resultado de la función
                    case "479":
                        return tbl_479(); // Retorna el resultado de la función
                    case "487":
                        return tbl_487(); // Retorna el resultado de la función
                    case "500":
                        return tbl_500(); // Retorna el resultado de la función
                    // case "501":
                    //     return tbl_501(); // Retorna el resultado de la función
                    default:
                        return <div>NO hay datos, revisa los filtros</div>; // Retorna un componente o null
                }
            })()}
        </>
    );
}
