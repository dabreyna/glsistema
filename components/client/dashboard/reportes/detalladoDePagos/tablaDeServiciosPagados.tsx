"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useState } from "react";

interface ServicioPagado {
  fecha_vencimiento: string;
  recibo: number;
  monto: string;
  fecha_pago: string;
  servicio: string;
}

export default function TablaDeServiciosPagados({ datosServiciosPagados }: { datosServiciosPagados: ServicioPagado[] }) {
  let totalServicios = 0;
  return (
    <>
      <Table
        id={`tablaMensualidadesVencidas`}
        className="rounded-md border-2 border-slate-200 shadow-sm max-w-[800px] items-center relative"
      >
        <TableCaption>SERVICIOS PAGADOS</TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg g-1">
          <TableRow>
            <TableHead className="text-center">Fecha vencimiento</TableHead>
            <TableHead className="text-center">Recibo</TableHead>
            <TableHead className="text-center">Fecha pago</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-center">Servicio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {datosServiciosPagados.map((resultado) => {
              const monto = parseFloat(resultado.monto);
              // const deposito = parseFloat(resultado.deposito);

              totalServicios = totalServicios + monto;
              return (
                <TableRow key={`${resultado.recibo}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                  <TableCell className="text-center">{resultado.fecha_vencimiento}</TableCell>
                  <TableCell className="text-right">{resultado.recibo}</TableCell>
                  <TableCell className="text-center">{resultado.fecha_pago}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(resultado.monto))}
                  </TableCell>
                  <TableCell className="text-left">{resultado.servicio}</TableCell>
                </TableRow>
              );
            })}
          </>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              SUBTOTAL
            </TableCell>
            <TableCell colSpan={1} className="text-right">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(totalServicios))}
            </TableCell>
            <TableCell colSpan={1}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
