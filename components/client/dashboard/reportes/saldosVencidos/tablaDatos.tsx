"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSaldosVencidosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/saldosVencidos/filtrosConsultaStore";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TablaDatos() {
  const saldosVencidos = useSaldosVencidosFiltrosConsultaStore((state) => state.resultados);

  return (
    <>
      <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div>

      <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]">
        <TableCaption>GRUPO LOTIFICADORA - REPORTE DE SALDOS VENCIDOS - </TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg">
          <TableRow>
            <TableHead className="text-center p-2">Terreno</TableHead>
            <TableHead className="text-center p-2">Cliente</TableHead>
            <TableHead className="text-center p-2">Fecha contrato</TableHead>
            <TableHead className="text-center p-2">Servicio</TableHead>
            <TableHead className="text-center p-2">Mes1</TableHead>
            <TableHead className="text-center p-2">Mes2</TableHead>
            <TableHead className="text-center p-2">Mes3</TableHead>
            <TableHead className="text-center p-2">Mes4</TableHead>
            <TableHead className="text-center p-2 sm:w-[50px] md:w-[50px] lg:w-[50px]">Dia vencimiento</TableHead>
            <TableHead className="text-center sm:w-[50px] md:w-[50px] lg:w-[50px] p-2">Mensualidades vencidas</TableHead>
            <TableHead className="text-center p-2">Adeudo total</TableHead>
            <TableHead className="text-center p-2">Total pagado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {saldosVencidos.map((saldoVencido) => (
              <TableRow key={`${saldoVencido.terreno}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                <TableCell className="text-right">{saldoVencido.terreno}</TableCell>
                <TableCell className="text-right">{saldoVencido.nombre_cliente}</TableCell>
                <TableCell className="text-center">{saldoVencido.fecha_contrato}</TableCell>
                <TableCell className="text-center">{saldoVencido.servicio}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(saldoVencido.mes1))}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(saldoVencido.mes2))}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(saldoVencido.mes3))}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(saldoVencido.mes4))}
                </TableCell>
                <TableCell className="text-center">{saldoVencido.dia_vencimiento}</TableCell>
                <TableCell className="text-center">{saldoVencido.mensualidades_vencidas}</TableCell>
                <TableCell className="text-right">{saldoVencido.monto_vencido}</TableCell>
                <TableCell className="text-right">{saldoVencido.monto_pagado}</TableCell>
              </TableRow>
            ))}
            <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
              <TableCell colSpan={1} className="font-semibold">
                Total:{" " + saldosVencidos.length}
              </TableCell>
              <TableCell className="text-right font-semibold" colSpan={3}></TableCell>
              <TableCell className="text-right font-semibold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.mes1), 0)))}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.mes2), 0)))}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.mes3), 0)))}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.mes4), 0)))}
              </TableCell>
              <TableCell className="text-center font-semibold" colSpan={2}></TableCell>

              <TableCell className="text-right font-semibold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.monto_vencido), 0)))}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(saldosVencidos.reduce((acc, curr) => acc + Number(curr.monto_pagado), 0)))}
              </TableCell>
            </TableRow>
          </>
        </TableBody>
      </Table>
    </>
  );
}
