"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useVentasMaduradasFiltrosConsultaStore } from "@/app/store/dashboard/reportes/ventasMaduradas/filtrosConsultaStore";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import "moment/locale/es";

export default function TablaDatos() {
    const resultados = useVentasMaduradasFiltrosConsultaStore((state) => state.resultados);
    const mesInicio = useVentasMaduradasFiltrosConsultaStore((state) => state.mesInicio);

    //moment().locale("es");
    const mes1 = moment(mesInicio).format("MMMM");
    const mes2 = moment(mesInicio).add(1, "months").format("MMMM");
    const mes3 = moment(mesInicio).add(2, "months").format("MMMM");
    const mes4 = moment(mesInicio).add(3, "months").format("MMMM");
    const mes5 = moment(mesInicio).add(4, "months").format("MMMM");
    const mes6 = moment(mesInicio).add(5, "months").format("MMMM");

    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE VENTAS MADURADAS - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center uppercase">Cliente</TableHead>
                        <TableHead className="text-center uppercase">Terreno</TableHead>
                        <TableHead className="text-center uppercase">Fecha</TableHead>
                        <TableHead className="text-center uppercase">Madurada / Cancelada</TableHead>
                        <TableHead className="text-center uppercase">{mes1}</TableHead>
                        <TableHead className="text-center uppercase">{mes2}</TableHead>
                        <TableHead className="text-center uppercase">{mes3}</TableHead>
                        <TableHead className="text-center uppercase">{mes4}</TableHead>
                        <TableHead className="text-center uppercase">{mes5}</TableHead>
                        <TableHead className="text-center uppercase">{mes6}</TableHead>
                        <TableHead className="text-center uppercase">Asesor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resultados.length > 0 ? (
                        resultados.map((resultado, index) => (
                            <TableRow key={index} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                                <TableCell className="text-left border-2 border-slate-200 ">{resultado.nombre_cliente}</TableCell>
                                <TableCell className="text-left border-2 border-slate-200">{resultado.terreno}</TableCell>
                                <TableCell className="text-center border-2 border-slate-200 ">{resultado.fecha}</TableCell>
                                <TableCell className="text-center border-2 border-slate-200 ">{resultado.madurada}</TableCell>
                                <TableCell className="text-left border-2 border-slate-200 ">{resultado.mes1}</TableCell>
                                <TableCell className="text-left border-2 border-slate-200 ">{resultado.mes2}</TableCell>
                                <TableCell className="text-left border-2 border-slate-200 ">{resultado.mes3}</TableCell>
                                <TableCell className="text-left border-2 border-slate-200 ">{resultado.mes4}</TableCell>
                                <TableCell className="text-left border-2 border-slate-200 ">{resultado.mes5}</TableCell>
                                <TableCell className="text-left border-2 border-slate-200 ">{resultado.mes6}</TableCell>
                                <TableCell className="text-left border-2 border-slate-200 ">{resultado.asesor_ventas}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="font-medium text-xs bg-slate-100" style={{ height: "10px", padding: 2 }}>
                                No hay datos, verificar los filtros
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter></TableFooter>
            </Table>
        </>
    );
}
