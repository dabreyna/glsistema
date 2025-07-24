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

// import { useComisionesFiltrosConsultaStore } from '@/app/store/dashboard/reportes/comisiones/filtrosConsultaStore'; //BORRAR
import { useCatalogoClientesFiltrosConsultaStore } from "@/app/store/dashboard/reportes/catalogoClientes/filtrosConsultaStore";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";


  export default function TablaDatos() {
    // const resultados = useComisionesFiltrosConsultaStore((state) => state.resumen);
    const resultados = useCatalogoClientesFiltrosConsultaStore((state) => state.resultados);

    return (
        <>
            <div className="flex justify-end">
              <Button id="toPDF" className="p-6"  onClick={() =>alert('PENDIENTE') }> 
                <FileDown style={{height:'30px',width:'30px'}}/>PDF
              </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE CATALOGO DE CLIENTES - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow >
                        <TableHead className="text-center text-xs uppercase">#</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Terreno</TableHead>
                        <TableHead className=" text-center text-xs p-2 uppercase">Cliente</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Calle</TableHead>
                        <TableHead className=" text-center text-xs p-2 uppercase">Numero</TableHead>
                        <TableHead className=" text-center text-xs p-2 uppercase">Entre</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Colonia</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Telefono</TableHead>
                        <TableHead className="text-center text-xs uppercase">Email</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Ciudad</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Estado</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">CP</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Fecha Nacimiento</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Dia Vencimiento</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Meses Atraso</TableHead>
                        <TableHead className=" text-right text-xs p-2 uppercase">Mens. Pagadas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {resultados.map((cliente) => (
                    <>
                        <TableRow key={`${cliente.consecutivo}`}>
                            <TableCell className="text-xs p-2">{cliente.consecutivo}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.terreno}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.nombrecliente}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.calle}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.numero}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.entre}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.colonia}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.tel_cel}</TableCell>
                            <TableCell className=" text-right text-xs p-2 lowercase">{cliente.email}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.ciudad}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.estado}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.cp}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.fecha_nacimiento}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.dia_vencimiento}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.meses_atraso}</TableCell>
                            <TableCell className=" text-right text-xs p-2">{cliente.mens_pagadas}</TableCell>
                            {/* <TableCell className="text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(asesor.generado))}</TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(asesor.pagado))}</TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(asesor.saldo))}</TableCell> */}
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