"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useSeguimientoFiltrosConsultaStore } from "@/app/store/dashboard/ventas/seguimiento/filtrosConsultaStore";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SquareX, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { BitacoraDeLlamadasDetalle } from "@/components/client/dashboard/reportes/bitacoraDeLlamadas/bitacoraDetalle";
import { AltaAgenda } from "@/components/client/dashboard/ventas/agenda/altaAgenda";
import { HistorialAgenda } from "@/components/client/dashboard/ventas/agenda/historialAgenda";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}

interface AgendaProps {
    idUsuario?: string;
    perfilUsuario?: string;
    listaClasificacion: Clasificacion[];
}
export default function TablaDatos({ listaClasificacion, idUsuario, perfilUsuario }: AgendaProps) {
    const Clientes = useSeguimientoFiltrosConsultaStore((state) => state.resultados);
    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>

            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>GRUPO LOTIFICADORA - PROSPECTOS - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow className="sticky top-0 bg-slate-200 z-10">
                        <TableHead className="text-center max-w-[50px]">Semaforo</TableHead>
                        <TableHead className="text-center">Cliente</TableHead>
                        <TableHead className="text-center w-[250px]">Nombre</TableHead>
                        <TableHead className="text-center">Ubicacion</TableHead>
                        <TableHead className="text-center">Proxima llamada</TableHead>
                        <TableHead className="text-center">Telefonos</TableHead>
                        <TableHead className="text-center w-[500px]">Comentarios</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Clientes.map((asesor) => (
                        <>
                            <TableRow key={asesor.nombre_asesor} className="shadownc-table__row my-row">
                                <TableCell colSpan={9} className="font-medium text-xs bg-slate-100" style={{ height: "10px", padding: 2 }}>
                                    Asesor: {asesor.nombre_asesor}
                                </TableCell>
                            </TableRow>
                            {asesor.clientes.map((cliente) => {
                                const getSemaforoComponent = (semaforo: string) => {
                                    switch (semaforo) {
                                        case "rojo":
                                            return <Square className="bg-red-500 text-red-500 rounded" />;
                                        case "amarillo":
                                            return <Square className="bg-amber-500 text-amber-500 rounded" />;
                                        case "verde":
                                            return <Square className="bg-green-500 text-green-500 rounded" />;
                                        case "azul":
                                            return <Square className="bg-blue-500 text-blue-500 rounded" />;
                                        case "rojo-tache":
                                            return <SquareX className="bg-red-500 text-white rounded" />; // Corrected text color
                                        default:
                                            return null; // Or a default component if needed
                                    }
                                };
                                const url = `/private/dashboard/ventas/alta/${cliente.id_cliente}`;
                                return (
                                    <TableRow key={`${cliente.id_cliente}-${cliente.nombre_cliente}`}>
                                        <TableCell className="font-medium">
                                            {getSemaforoComponent(cliente.semaforo)}
                                            {/* <Square className="bg-red-500 text-red-500 rounded" /> */}
                                            {/* {cliente.semaforo} */}
                                        </TableCell>
                                        <TableCell className="text-right">{cliente.id_cliente}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={url} className="text-blue-500 hover:underline">
                                                {cliente.nombre_cliente}
                                            </Link>
                                            {/* {cliente.nombre_cliente} */}
                                        </TableCell>
                                        <TableCell className="text-right">{}</TableCell>
                                        <TableCell className="text-right">{cliente.fecha_prox_llamada}</TableCell>
                                        <TableCell className="text-left">
                                            Casa:{cliente.tel_casa} <br /> Cel:{cliente.tel_cel} <br /> Trabajo:{cliente.tel_trabajo}
                                        </TableCell>
                                        <TableCell className="text-justify bg-red-50 p-2 text-sm">
                                            {cliente.ultimo_comentario}
                                            <Separator className="my-2 bg-slate-300 h-0.5" />
                                            <AltaAgenda
                                                idCliente={cliente.id_cliente}
                                                listaClasificacion={listaClasificacion}
                                                idUsuario={idUsuario}
                                                perfilUsuario={perfilUsuario}
                                            />
                                            <HistorialAgenda id={cliente.id_cliente} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

// ?id_asesor=aaron@grupolotificadora.com&fil_asesor=0&fil_fecha_ini=2024-04-01&fil_fecha_fin=2024-04-07&fil_cliente=&fil_clasificacion=0&asesor=Aaron%20Ignacio%20Amezquita%20Ruiz
