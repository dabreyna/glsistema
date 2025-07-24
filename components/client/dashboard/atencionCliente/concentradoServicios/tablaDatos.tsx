"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useConcentradoServiciosFiltrosConsultaStore } from "@/app/store/dashboard/atencionCliente/concentradoServicios/filtrosConsultaStore";

import { useRouter } from "next/navigation";
// import Link from "next/link";
// import GeneraDOC from "../../cobranza/citatorios/documentos/generaDoc";
// import { id } from "date-fns/locale";
import { toast, useToast } from "@/hooks/use-toast";
import moment from "moment";

export default function TablaDatos() {
    const toast = useToast();
    // const idFraccionamiento = useEstadoDeCuentaFiltrosConsultaStore((state) => state.idFraccionamiento);
    const idServicio = useConcentradoServiciosFiltrosConsultaStore((state) => state.idServicio);
    const servicios = useConcentradoServiciosFiltrosConsultaStore((state) => state.resultados);
    const router = useRouter();
    const handleDetallesCliente = (id_cliente: string) => {
        if (id_cliente != "") {
            router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
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

    return (
        <>
            <div className="flex justify-end">{/* Botón PDF (Comentado) */}</div>

            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-white">#</TableHead>
                        {/* <TableHead className="w-[160px] text-white">Fraccionamiento</TableHead> */}
                        {/* <TableHead className="text-white">Manzana</TableHead> */}
                        {/* <TableHead className="text-white">Terreno</TableHead> */}
                        <TableHead className="text-white">Nomenclatura</TableHead>
                        <TableHead className="text-white">Cliente</TableHead>
                        <TableHead className="text-white">
                            Estatus
                            <br />
                            Contrato
                        </TableHead>
                        <TableHead className="text-white">
                            No.
                            <br />
                            Transformador
                        </TableHead>
                        <TableHead className="text-white">
                            Transformador
                            <br />
                            Instalado
                        </TableHead>
                        <TableHead className="text-white">
                            Transformador
                            <br />
                            en Uso
                        </TableHead>
                        <TableHead className="text-white">
                            Servicio
                            <br />
                            de Luz
                        </TableHead>
                        <TableHead className="text-white">
                            Obra
                            <br />
                            Hidraulica
                        </TableHead>
                        <TableHead className="text-white">
                            Servicio
                            <br />
                            de Agua
                        </TableHead>
                        <TableHead className="text-white">Biodigestor</TableHead>
                        <TableHead className="text-white">
                            Clave
                            <br />
                            Catastral
                        </TableHead>
                        <TableHead className="text-white">Direccion</TableHead>
                        <TableHead className="text-white">
                            Certificado de
                            <br />
                            uso de Terreno
                        </TableHead>
                        <TableHead className="text-white">
                            Carta
                            <br />
                            Finiquito
                        </TableHead>
                        <TableHead className="text-white">Escrituras</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {servicios.map((terreno) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                actualizarDatos(terreno.id, newData, col, 2);
                            };
                            const fechaMoment = moment(terreno.escrituras, "YYYY-MM-DD", true);
                            // console.log();
                            if (moment(terreno.escrituras, "YYYY-MM-DD", true).isValid()) {
                                terreno.escrituras = fechaMoment.format("DD/MM/YYYY");
                            }
                            if (moment(terreno.carta_finiquito, "YYYY-MM-DD", true).isValid()) {
                                terreno.carta_finiquito = fechaMoment.format("DD/MM/YYYY");
                            }
                            return (
                                <>
                                    <TableRow key={terreno.id_terreno}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        {/* <TableCell className="text-left text-xs p-1">{terreno.fraccionamiento}</TableCell> */}
                                        {/* <TableCell className="text-left uppercase text-xs p-1">{terreno.no_manzana}</TableCell> */}
                                        {/* <TableCell className="text-left text-xs p-1">{terreno.no_terreno}</TableCell> */}
                                        <TableCell className="text-left text-xs p-1">{terreno.nomenclatura}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{terreno.nombre_cliente}</TableCell>
                                        <TableCell className="text-center text-xs p-1">{terreno.estatus}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {terreno.no_transformador ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. T3"
                                                    id="c_3"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.no_transformador} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. T3"
                                                    id="c_3"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {terreno.transformador_instalado ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_4"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.transformador_instalado} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_4"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.transformador_en_uso ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_5"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.transformador_en_uso} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_5"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.servicio_de_luz ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_6"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.servicio_de_luz} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_6"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.obra_hidraulica ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_13"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.obra_hidraulica} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_13"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.servicio_de_agua ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_7"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.servicio_de_agua} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_7"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.biodigestor ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_8"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.biodigestor} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_8"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.clave_catastral ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. BCM00123445"
                                                    id="c_12"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.clave_catastral} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. BCM00123445"
                                                    id="c_12"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">{terreno.calle}</TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.solicitud_de_marcado ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_9"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.solicitud_de_marcado} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. SI"
                                                    id="c_9"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.carta_finiquito ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. dd/mm/aaaa"
                                                    id="c_10"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.carta_finiquito} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. dd/mm/aaaa"
                                                    id="c_10"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            {/* {cliente.fecha_descubrimiento} */}
                                            {terreno.escrituras ? (
                                                // cliente.fecha_envio_contrato_cespm // Puedes establecer un valor inicial si es necesario
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. dd/mm/aaaa"
                                                    id="c_11"
                                                    onBlur={handleDataChange}
                                                    defaultValue={terreno.escrituras} // Puedes establecer un valor inicial si es necesario
                                                />
                                            ) : (
                                                <input
                                                    className=" text-xs border-black border-2 rounded-md p-1 w-[90px]"
                                                    placeholder="Ej. dd/mm/aaaa"
                                                    id="c_11"
                                                    onBlur={handleDataChange}
                                                    defaultValue="" // Puedes establecer un valor inicial si es necesario
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        </>
    );
}
