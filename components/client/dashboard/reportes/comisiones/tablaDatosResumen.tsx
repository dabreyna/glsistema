"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { useComisionesFiltrosConsultaStore } from '@/app/store/dashboard/reportes/comisiones/filtrosConsultaStore';
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";


  export default function TablaDatosResumen() {
    const resultados = useComisionesFiltrosConsultaStore((state) => state.resumen);

    return (
        <>
            <div className="flex justify-end">
              <Button id="toPDF" className="p-6"  onClick={() =>alert('PENDIENTE') }> 
                <FileDown style={{height:'30px',width:'30px'}}/>PDF
              </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE COMISIONES - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow >
                        <TableHead className="text-center">Asesor</TableHead>
                        <TableHead className="text-right">Generado</TableHead>
                        <TableHead className="text-right">Pagado</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {resultados.map((asesor) => (
                    <>
                        <TableRow key={`${asesor}`}>
                            <TableCell className="font-medium">{asesor.nombre_asesor}</TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(asesor.generado))}</TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(asesor.pagado))}</TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(asesor.saldo))}</TableCell>
                        </TableRow>
                    </>
                    ))}
                </TableBody>
                <TableFooter>
                </TableFooter>
            </Table>
        </>
    )
}