"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useListadoCitasStore } from "@/app/store/dashboard/ventas/agenda/listadoCitasStore";
import { Bold, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TbBrandWhatsapp, TbBrandWhatsappFilled } from "react-icons/tb";

export default function TablaCitas() {
    // const resultados = useListadoCitasStore((state) => state.resumen);
    const { listadoCitas, setListadoCitas } = useListadoCitasStore();
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
                        <TableHead className="text-center">Hora compromiso</TableHead>
                        <TableHead className="text-center">Telefonos</TableHead>
                        <TableHead className="text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listadoCitas.map((cita) => (
                        <>
                            <TableRow key={cita.asesor_de_ventas} className="shadownc-table__row my-row">
                                <TableCell colSpan={9} className="font-medium text-sm bg-slate-100" style={{ height: "10px", padding: 2 }}>
                                    {cita.asesor_de_ventas}
                                </TableCell>
                            </TableRow>
                            {cita.citas.map((comentario) => (
                                <TableRow key={`${comentario.id_agenda}-${comentario.id_cliente}`} className="text-xs">
                                    <TableCell className=" text-xs text-center">{comentario.cliente}</TableCell>
                                    <TableCell className="text-left">
                                        Comentario realizo por:{comentario.nombre_comentario}
                                        <br />
                                        {comentario.comentario}
                                        <br />
                                        {/* <TbBrandWhatsapp calcMode={"classic"} size={20} color={"#1DA1F2"} /> */}
                                        {/* <TbBrandWhatsappFilled calcMode={"classic"} size={25} color={"#25D366"} /> */}
                                        <button
                                            onClick={() => handleWhatsAppLink(comentario.whats, comentario.cliente)}
                                            className="inline-flex items-center"
                                        >
                                            <TbBrandWhatsappFilled calcMode={"classic"} size={25} color={"#25D366"} className="mr-2" />
                                            {/* Enviar WhatsApp */}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-center">{comentario.hora_compromiso}</TableCell>
                                    <TableCell className="text-left">
                                        <strong>Casa:</strong> {comentario.tel_casa}
                                        <br />
                                        <strong>Cel:</strong> {comentario.tel_cel}
                                        <br />
                                        <strong>Oficina:</strong> {comentario.tel_oficina}
                                    </TableCell>
                                    <TableCell className="text-center"></TableCell>
                                </TableRow>
                            ))}
                        </>
                    ))}
                </TableBody>
                <TableFooter></TableFooter>
            </Table>
        </>
    );
}
