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

import { useMercadotecniaFiltrosConsultaStore } from '@/app/store/dashboard/reportes/mercadotecnia/filtrosConsultaStore';
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";


  export default function TablaDatos() {
    const resultados = useMercadotecniaFiltrosConsultaStore((state) => state.resultados);

    return (
        <>
            <div className="flex justify-end">
              <Button id="toPDF" className="p-6"  onClick={() =>alert('PENDIENTE') }> 
                <FileDown style={{height:'30px',width:'30px'}}/>PDF
              </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE MERCADOTECNIA - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow >
                    <TableHead className="w-[100px]">Consecutivo</TableHead>
                    <TableHead className="text-center">Cliente</TableHead>
                    <TableHead className="text-center">Ubicaci&oacute;n</TableHead>
                    <TableHead className="text-center">Fecha alta cliente</TableHead>
                    <TableHead className="text-center">Fecha estatus</TableHead>
                    <TableHead className="text-center">Asesor</TableHead>
                    <TableHead className="text-center">Medio</TableHead>
                    <TableHead className="text-center">Estatus</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    resultados.length > 0 ? (
                      resultados.map((resultado,index) => (
                        <TableRow key={resultado.consecutivo} >
                          <TableCell>{resultado.consecutivo}</TableCell>
                          <TableCell className="text-left border-2 border-slate-200 ">{resultado.cliente}</TableCell>
                          <TableCell className="text-left border-2 border-slate-200">{resultado.ubicacion}</TableCell>
                          <TableCell className="text-center border-2 border-slate-200 ">{resultado.fecha_alta}</TableCell>
                          <TableCell className="text-center border-2 border-slate-200 ">{resultado.fecha_estatus}</TableCell>
                          <TableCell className="text-left border-2 border-slate-200 ">{resultado.asesor}</TableCell>
                          <TableCell className="text-left border-2 border-slate-200 ">{resultado.medio}</TableCell>
                          <TableCell className="text-left border-2 border-slate-200 ">{resultado.estatus}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="font-medium text-xs bg-slate-100" style={{ height: '10px', padding: 2,}}>No hay datos, verificar los filtros</TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
                <TableFooter>
                </TableFooter>
            </Table>
        </>
    )
}