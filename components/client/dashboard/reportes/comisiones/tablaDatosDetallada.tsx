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

interface Asesor {
    usuario: number;
    nombre: string;
}

  export default function TablaDatosDetallada() {
    const resultados = useComisionesFiltrosConsultaStore((state) => state.detallado);
    const resumen = useComisionesFiltrosConsultaStore((state) => state.resumen);
    const tablaAsesores: Asesor[] = resumen.map((asesor) => ({
        usuario: Number(asesor.usuario),
        nombre: asesor.nombre_asesor
    }));
    

    function nombreAsesor(id:number):string | undefined{
        const asesor = tablaAsesores.find((asesor) => asesor.usuario === id);
        return asesor?.nombre;
    }
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
                    <TableHead className="text-center">Terreno</TableHead>
                    <TableHead className="text-center">Fecha contrato</TableHead>
                    <TableHead className="text-center">Pago de mensualidad</TableHead>
                    <TableHead className="text-center">Cliente</TableHead>
                    <TableHead className="text-center">Activo</TableHead>
                    <TableHead className="text-center"># Pagos</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                    <TableHead className="text-center">Pagado el</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {resultados.map((asesor) => (
                    <>
                      <TableRow key={asesor.asesor} className="shadownc-table__row my-row">
                        <TableCell colSpan={9} className="font-medium text-sm bg-slate-100" style={{ height: '10px', padding: 2,}}>{nombreAsesor(Number(asesor.asesor))}</TableCell>
                      </TableRow>
                      {asesor.comisiones.map((comision) => (
                        <TableRow key={`${comision.asesor}-${comision.id_contrato}-${comision.no_comision}`}>
                            <TableCell className="font-medium text-xs text-center">{comision.terreno}</TableCell>
                            <TableCell className="text-center">{comision.fecha_contrato}</TableCell>
                            <TableCell className="text-center">{comision.fecha_pago}</TableCell>
                            <TableCell className="text-center">{comision.nombre_cliente}</TableCell>
                            <TableCell className="text-left">{comision.cancelado}</TableCell>
                            <TableCell className="text-center">{comision.no_comision} / {comision.max_comision}</TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(comision.monto_primario))}</TableCell>
                            <TableCell className="text-center">{comision.comisionpagada}</TableCell>
                        </TableRow>
                      ))}
                    <TableRow style={{backgroundColor:'#fcf5e5',color:'#b31c45'}}>
                        <TableCell colSpan={6} className="font-semibold text-right"> Acumulado</TableCell>
                        <TableCell className="text-right font-semibold">
                          {new Intl.NumberFormat('es-MX', { 
                            style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                              asesor.comisiones.reduce((acc, curr) => acc + Number(curr.monto_primario), 0)
                              )}
                        </TableCell>
                        <TableCell colSpan={5}></TableCell>
                        {/* <TableCell className="text-right font-semibold"></TableCell> */}
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