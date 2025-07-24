"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useState } from "react";

interface MensualidadVencida {
  no_pago: number;
  fecha: string;
  fecha2: string;
  deposito: string;
  deposito_preferente: string;
  intereses: string;
  dias?: string;
}
interface ServicioVencido {
  no_pago: number;
  fecha: string;
  monto_saldo: string;
  servicio: string;
}
interface TablaResumenSaldosVencidosProps {
  datosSaldosVencidos: MensualidadVencida[];
  datosServiciosVencidos: ServicioVencido[];
}

export default function TablaResumenSaldosVencidos({ datosSaldosVencidos, datosServiciosVencidos }: TablaResumenSaldosVencidosProps) {
  let totalServicios = 0;
  let totalMensualidades = 0;
  let totalIntereses = 0;
  for (const mensualidad in datosSaldosVencidos) {
    totalMensualidades = totalMensualidades + parseFloat(datosSaldosVencidos[mensualidad].deposito_preferente);
    totalIntereses = totalIntereses + parseFloat(datosSaldosVencidos[mensualidad].intereses);
  }
  for (const servicio in datosServiciosVencidos) {
    totalServicios = totalServicios + parseFloat(datosServiciosVencidos[servicio].monto_saldo);
  }
  return (
    <>
      <Table
        id={`tablaResumenSaldosVencidos`}
        className="rounded-md border-2 border-slate-200 shadow-sm max-w-[400px] items-center relative"
      >
        <TableCaption>RESUMEN DE SALDOS VENCIDOS</TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg g-1">
          <TableRow>
            <TableHead className="text-center">Concepto</TableHead>
            <TableHead className="text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            <TableRow className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
              <TableCell className="text-lef">Mensualidades</TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(totalMensualidades))}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
              <TableCell className="text-center">Intereses</TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(totalIntereses))}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
              <TableCell className="text-center">Servicios</TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(totalServicios))}
              </TableCell>
            </TableRow>
          </>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1} className="text-center">
              TOTAL
            </TableCell>
            <TableCell colSpan={1} className="text-right">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(totalMensualidades + totalServicios + totalIntereses))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
