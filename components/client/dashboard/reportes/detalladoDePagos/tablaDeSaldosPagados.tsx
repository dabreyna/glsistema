"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface MensualidadPagada {
  fecha_movimiento: string;
  fecha_pago: string;
  monto_pagado: string;
  no_pago: number;
  id_tipo_movimiento: number;
  recibo: number;
  intereses: string;
  descuentos: string;
}

export default function TablaDeSaldosPagados({ datosSaldosPagados }: { datosSaldosPagados: MensualidadPagada[] }) {
  let totalIntereses = 0;
  let totalMensualidades = 0;
  let totalDescuentos = 0;
  return (
    <>
      <Table id={`tablaMensualidadesVencidas`} className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]">
        <TableHeader className="border-2 border-slate-200 shadow-lg g-1">
          <TableRow>
            <TableHead className="text-center">Fecha vencimiento</TableHead>
            <TableHead className="text-center">Recibo</TableHead>
            <TableHead className="text-center">Fecha pago</TableHead>
            <TableHead className="text-right">Descuento</TableHead>
            <TableHead className="text-right">Intereses</TableHead>
            <TableHead className="text-right">Mensualidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {datosSaldosPagados.map((resultado) => {
              const intereses = parseFloat(resultado.intereses);
              const descuentos = parseFloat(resultado.descuentos);
              const mensualidad = parseFloat(resultado.monto_pagado);

              // const deposito = parseFloat(resultado.deposito);

              totalIntereses = totalIntereses + intereses;
              totalMensualidades = totalMensualidades + mensualidad;
              totalDescuentos = totalDescuentos + descuentos;
              return (
                <TableRow key={`${resultado.no_pago}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                  <TableCell className="text-center">{resultado.fecha_movimiento}</TableCell>
                  <TableCell className="text-center">{resultado.recibo}</TableCell>
                  <TableCell className="text-center">{resultado.fecha_pago}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(descuentos))}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(resultado.intereses))}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(resultado.monto_pagado))}
                  </TableCell>
                </TableRow>
              );
            })}
          </>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              SUBTOTALES
            </TableCell>
            <TableCell colSpan={1} className="text-right">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(totalDescuentos))}
              <br />
              Descuentos
            </TableCell>
            <TableCell colSpan={1} className="text-right">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(totalIntereses))}
              <br />
              Intereses
            </TableCell>
            <TableCell colSpan={1} className="text-right">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(totalMensualidades))}
              <br />
              Mensualidades
            </TableCell>
            <TableCell colSpan={1}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
