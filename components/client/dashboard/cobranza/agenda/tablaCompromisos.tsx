"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useListadoCitasStore } from "@/app/store/dashboard/cobranza/agenda/listadoCitasStore";
import { Bold, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TbBrandWhatsapp, TbBrandWhatsappFilled } from "react-icons/tb";
import { AltaAgenda } from "@/components/client/dashboard/cobranza/agenda/altaAgenda";
import { HistorialAgenda } from "@/components/client/dashboard/cobranza/agenda/historialAgenda";

interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}

interface AgendaProps {
    idUsuario?: string;
    perfilUsuario?: string;
    listaClasificacion: Clasificacion[];
}

export default function TablaCompromisos({ listaClasificacion, idUsuario, perfilUsuario }: AgendaProps) {
    // const resultados = useListadoCitasStore((state) => state.resumen);
    const { listadoCompromisos, setListadoCompromisos } = useListadoCitasStore();
    const handleWhatsAppLink = (telefono: string, cliente: string) => {
        const msg: string = `Sr/Sra. *${cliente}*,`;

        const mensajeInicial = encodeURIComponent(msg);
        const whatsappLink = `https://web.whatsapp.com/send?phone=${telefono}&text=${mensajeInicial}`;
        window.open(whatsappLink, "_blank");
    };

    return (
        <>
            <div className="flex justify-end">
                {/* <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button> */}
            </div>
            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm">
                <TableCaption> - GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center">Cliente</TableHead>
                        <TableHead className="text-center">Comentarios</TableHead>
                        {/* <TableHead className="text-center">Hora compromiso</TableHead> */}
                        {/* <TableHead className="text-center">Telefonos</TableHead> */}
                        <TableHead className="text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow key={listadoCompromisos[0]?.nombre_asesor} className="shadownc-table__row my-row">
                        <TableCell colSpan={9} className="font-medium text-sm bg-slate-100" style={{ height: "10px", padding: 2 }}>
                            {listadoCompromisos[0]?.nombre_asesor}
                        </TableCell>
                    </TableRow>
                    {listadoCompromisos.map((cita) => (
                        <>
                            <TableRow key={`${cita.id_cliente}`} className="text-xs">
                                <TableCell className=" text-xs text-center">{cita.nombre_cliente}</TableCell>
                                <TableCell className="text-left">
                                    {cita.comentarios}
                                    <br />
                                    <button
                                        onClick={() => handleWhatsAppLink(cita.asesor, cita.nombre_asesor)}
                                        className="inline-flex items-center"
                                    >
                                        <TbBrandWhatsappFilled calcMode={"classic"} size={25} color={"#25D366"} className="mr-2" />
                                        {/* Enviar WhatsApp */}
                                    </button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <AltaAgenda
                                        idCliente={cita.id_cliente}
                                        listaClasificacion={listaClasificacion}
                                        idContrato={cita.id_contrato}
                                        idUsuario={idUsuario}
                                        perfilUsuario={perfilUsuario}
                                    />
                                    {/* <HistorialAgenda id={cita.id_cliente} /> */}
                                    <HistorialAgenda id={cita.id_contrato} />
                                </TableCell>
                                {/* <TableCell className="text-center"></TableCell> */}
                            </TableRow>
                        </>
                    ))}
                </TableBody>
                <TableFooter></TableFooter>
            </Table>
        </>
    );
}
