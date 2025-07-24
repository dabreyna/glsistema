"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useState } from "react";

interface ServicioVencido {
  no_pago: number;
  fecha: string;
  monto_saldo: string;
  servicio: string;
}

export default function TablaDeServiciosVencidos({ datosServiciosVencidos }: { datosServiciosVencidos: ServicioVencido[] }) {
  let totalServicios = 0;
  return (
    <>
      <Table
        id={`tablaMensualidadesVencidas`}
        className="rounded-md border-2 border-slate-200 shadow-sm max-w-[800px] items-center relative"
      >
        <TableCaption>SERVICIOS VENCIDOS</TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg g-1">
          <TableRow>
            <TableHead className="text-center">Fecha</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-center">Servicio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {datosServiciosVencidos.map((resultado) => {
              const monto = parseFloat(resultado.monto_saldo);
              // const deposito = parseFloat(resultado.deposito);

              totalServicios = totalServicios + monto;
              return (
                <TableRow key={`${resultado.no_pago}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                  <TableCell className="text-center">{resultado.fecha}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(resultado.monto_saldo))}
                  </TableCell>
                  <TableCell className="text-center">{resultado.servicio}</TableCell>
                </TableRow>
              );
            })}
          </>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1} className="text-center">
              SUBTOTALES
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
