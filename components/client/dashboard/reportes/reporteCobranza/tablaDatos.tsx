"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useReporteCobranzaResultadosConsultaStore } from "@/app/store/dashboard/reportes/reporteCobranza/resultadosConsultaStore";
import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { set } from "lodash";

interface Pago {
  no_recibo: string;
  pagos: string;
  monto_cheque: string;
  monto_efectivo: string;
  monto_dlls: string;
  tipo_cambio: string;
  fecha: string;
  usuario: string;
  nombre_usuario: string;
  fraccionamiento: string;
  nombre_cliente: string;
  terreno: string;
  cancelado: string;
  id_tipo_pago: string;
  razon_social: string;
}

export default function TablaDatos() {
  const resultados = useReporteCobranzaResultadosConsultaStore((state) => state.resultados);

  function calculaMonto(porcentaje: string, no_pagos: string, total_terreno: string) {
    const porcentaje_num = Number(porcentaje) / 100;
    const precioTerreno = Number(Number(total_terreno) * porcentaje_num + Number(total_terreno));
    const mensualidad = Number((precioTerreno / Number(no_pagos)).toFixed(2));

    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(mensualidad);
  }
  let total = 0;
  let total1 = 0;
  let total2 = 0;
  let total3 = 0;
  const tt = resultados.map((razon_social) => {
    total += Number(razon_social.pagos.length);
  });
  return (
    <>
      <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div>
      <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm">
        <TableCaption>GRUPO LOTIFICADORA - REPORTE DE COBRANZA - </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center" colSpan={12}></TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="w-[100px]">Recibo</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="text-center">Efectivo</TableHead>
            <TableHead className="text-center">Dolares</TableHead>
            <TableHead className="text-center">Tipo cambio</TableHead>
            <TableHead className="text-right">Cheque</TableHead>
            <TableHead className="text-right">Fecha</TableHead>
            <TableHead className="text-right">Usuario</TableHead>
            <TableHead className="text-right">Fraccionamiento</TableHead>
            <TableHead className="text-center">Cliente</TableHead>
            <TableHead className="text-right">Terreno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resultados.map((razon_social) => (
            <>
              <TableRow key={razon_social.razon_social} className="shadownc-table__row my-row">
                <TableCell colSpan={11} className="font-medium text-xs bg-slate-100" style={{ height: "10px", padding: 2 }}>
                  {razon_social.razon_social}
                </TableCell>
              </TableRow>
              {razon_social.pagos.map((pago) => {
                total1 += Number(pago.pagos);
                total2 += Number(pago.monto_efectivo);
                total3 += Number(pago.monto_dlls);
                return (
                  <TableRow key={`${pago.no_recibo}-${pago.id_tipo_pago}`}>
                    <TableCell className="font-medium text-xs">{pago.no_recibo}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(pago.pagos))}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(pago.monto_efectivo))}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(pago.monto_dlls))}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(pago.tipo_cambio))}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(pago.monto_cheque))}
                    </TableCell>
                    <TableCell className="text-right">{pago.fecha}</TableCell>
                    <TableCell className="text-right">{pago.nombre_usuario}</TableCell>
                    <TableCell className="text-right">{pago.fraccionamiento}</TableCell>
                    <TableCell className="text-right">{pago.nombre_cliente}</TableCell>
                    <TableCell className="text-right">{pago.terreno}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                <TableCell colSpan={1} className="font-semibold text-right">
                  Subtotal:
                  {razon_social.pagos.length}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(razon_social.pagos.reduce((acc, curr) => acc + Number(curr.pagos), 0))}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(razon_social.pagos.reduce((acc, curr) => acc + Number(curr.monto_efectivo), 0))}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(razon_social.pagos.reduce((acc, curr) => acc + Number(curr.monto_dlls), 0))}
                </TableCell>
                {/* <TableCell colSpan={1}></TableCell> */}
              </TableRow>
            </>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
            <TableCell colSpan={1} className="font-semibold">
              Total: {total}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(total1))}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(total2))}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(total3))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
