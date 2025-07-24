"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useDetalladoVentasFiltrosConsultaStore } from "@/app/store/dashboard/reportes/detalladoVentas/filtrosConsultaStore";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ResumenAsesor {
    consecutivo: string;
    vendedor: string;
    ventas: string;
    compartidas: string;
    ventasmes: string;
    nombre_asesor: string;
    tendencia: string;
    fecha_inicio: string;
    fecha_fin: string;
    fil_estatus: string;
    fil_empresa: string;
    fil_asesor: string;
    fil_asesor_inactivo: string;
    fil_reubicados: string;
    fil_cancelados: string;
}
interface VentasEmpresa {
    razon_social: string;
    fraccionamiento: string;
    ventas: string;
    id_empresa: string;
    id_fraccionamiento: string;
    compartidas: string;
    fecha_inicio: string;
    fecha_fin: string;
    fil_estatus: string;
    fil_empresa: string;
    fil_asesor: string;
    fil_asesor_inactivo: string;
    fil_reubicados: string;
    fil_cancelados: string;
}
interface ResumenEmpresa {
    razon_social: string;
    ventas: VentasEmpresa[];
}
export default function TablaDatosResumen() {
    const resultadoAsesores = useDetalladoVentasFiltrosConsultaStore((state: { resumenAsesores: any }) => state.resumenAsesores);
    const resultadoEmpresas = useDetalladoVentasFiltrosConsultaStore((state: { resumenEmpresas: any }) => state.resumenEmpresas);
    // console.log(resultadoEmpresas);
    function calcularTendencia(ventas_mes: string) {
        let tendencia = 0;

        try {
            const diasEnElMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); // Obtener días del mes actual
            const diaDelMes = new Date().getDate();
            // console.log("DIAS EN EL MES: " + diasEnElMes);
            // console.log("DIAS DEL MES: " + diaDelMes);
            // console.log("VENTAS MES: " + ventas_mes);
            // console.log("TENDENCIA: " + tendencia);

            tendencia = Number(diasEnElMes) / Number(Number(diaDelMes) / Number(ventas_mes));
        } catch (error) {
            console.error("Error al calcular la tendencia:", error);
            tendencia = 0;
        }

        return tendencia;
    }
    return (
        <>
            {/* <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div> */}
            <div className="flex justify-center w-full items-center">
                <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[800px] mx-auto">
                    {/* <TableCaption>GRUPO LOTIFICADORA - REPORTE DE COMISIONES - </TableCaption> */}
                    <TableHeader className="border-2 border-slate-200 shadow-lg">
                        <TableRow>
                            <TableHead className="text-center">Lugar</TableHead>
                            <TableHead className="text-right">Asesor Ventas</TableHead>
                            <TableHead className="text-right">Ventas</TableHead>
                            <TableHead className="text-right">Ventas Compartidas</TableHead>
                            <TableHead className="text-right">Tendencia</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resultadoAsesores.map((asesor: ResumenAsesor) => {
                            const tendenciaCalculada = calcularTendencia(asesor.ventasmes);

                            return (
                                <>
                                    <TableRow key={`${asesor.consecutivo}`}>
                                        <TableCell className="font-medium">{asesor.consecutivo}</TableCell>
                                        <TableCell className="text-right">{asesor.nombre_asesor}</TableCell>
                                        <TableCell className="text-right">{asesor.ventas}</TableCell>
                                        <TableCell className="text-right">{asesor.compartidas}</TableCell>
                                        <TableCell className="text-right">{tendenciaCalculada.toFixed(2)}</TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                        <TableRow key={`asas`}>
                            <TableCell className="font-medium col-span-3" colSpan={2}>
                                Total
                            </TableCell>
                            <TableCell className="text-right" colSpan={1}>
                                {resultadoAsesores
                                    .reduce((acum: number, asesor: ResumenAsesor) => acum + Number(asesor.ventas), 0)
                                    .toFixed(0)}
                            </TableCell>
                            <TableCell className="text-right col-span-1">
                                {resultadoAsesores
                                    .reduce((acum: number, asesor: ResumenAsesor) => acum + Number(asesor.compartidas), 0)
                                    .toFixed(0)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter></TableFooter>
                </Table>
            </div>
            <Separator className="my-4 size-1 bg-white" />
            <div className="flex justify-center w-full items-center">
                <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[800px] mx-auto">
                    {/* <TableCaption>GRUPO LOTIFICADORA - REPORTE DE COMISIONES - </TableCaption> */}
                    <TableHeader className="border-2 border-slate-200 shadow-lg">
                        <TableRow>
                            <TableHead className="text-center">Fraccionamiento</TableHead>
                            <TableHead className="text-right">Ventas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resultadoEmpresas.map((empresa: ResumenEmpresa) => {
                            return (
                                <>
                                    <TableRow key={`${empresa.razon_social}`}>
                                        <TableCell className="font-medium">{empresa.razon_social}</TableCell>
                                    </TableRow>
                                    {empresa.ventas.map((venta: VentasEmpresa) => {
                                        return (
                                            <>
                                                <TableRow key={`${venta.fraccionamiento}`}>
                                                    <TableCell className="text-right">{venta.fraccionamiento}</TableCell>
                                                    <TableCell className="text-right">{venta.ventas}</TableCell>
                                                </TableRow>
                                            </>
                                        );
                                    })}
                                </>
                            );
                        })}
                    </TableBody>
                    <TableFooter></TableFooter>
                </Table>
            </div>
        </>
    );
}
