"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useajusteAnualFiltrosConsultaStore } from "@/app/store/dashboard/reportes/ajusteAnual/filtrosConsultaStore";
// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { set } from "lodash";

export default function TablaDatos() {
  const resultados = useajusteAnualFiltrosConsultaStore((state) => state.resultados);

  return (
    <>
      <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div>
      <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm">
        <TableCaption>GRUPO LOTIFICADORA - REPORTE DE AJUSTE ANUAL - </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center" colSpan={12}></TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-right">Mes</TableHead>
            <TableHead className="text-right">Año</TableHead>
            <TableHead className="text-right">Cliente</TableHead>
            <TableHead className="text-right">Terreno</TableHead>
            <TableHead className="text-right">Mensualidad Anterior</TableHead>
            <TableHead className="text-right">Saldo Anterior</TableHead>
            <TableHead className="text-right">Importe Ajuste</TableHead>
            <TableHead className="text-right">Mensualidad Actual</TableHead>
            <TableHead className="text-right">Saldo Actual</TableHead>
            <TableHead className="text-right">Mensualidades Pendientes</TableHead>
            <TableHead className="text-right">Resultado</TableHead>
            <TableHead className="text-right">Fecha contrato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resultados.map((resultado) => {
            return (
              <TableRow key={`${resultado.terreno}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                <TableCell className="text-right">{resultado.mes}</TableCell>
                <TableCell className="text-right">{resultado.anio}</TableCell>
                <TableCell className="text-right">{resultado.cliente}</TableCell>
                <TableCell className="text-right">{resultado.terreno}</TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.mensualidad_anterior))}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.saldo_anterior))}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.importe_ajuste))}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.mensualidad_actual))}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.saldo_actual))}
                </TableCell>
                <TableCell className="text-right">{resultado.mensualidades_pendientes}</TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.resultado))}
                </TableCell>
                <TableCell className="text-right">{resultado.fecha_contrato}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
            <TableCell colSpan={4} className="font-semibold">
              Total: {resultados.length}
            </TableCell>

            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(resultados.reduce((acc, curr) => acc + Number(curr.mensualidad_anterior), 0))}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(resultados.reduce((acc, curr) => acc + Number(curr.saldo_anterior), 0))}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(resultados.reduce((acc, curr) => acc + Number(curr.importe_ajuste), 0))}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(resultados.reduce((acc, curr) => acc + Number(curr.mensualidad_actual), 0))}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(resultados.reduce((acc, curr) => acc + Number(curr.saldo_actual), 0))}
            </TableCell>
            <TableCell className="text-right font-semibold"></TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(resultados.reduce((acc, curr) => acc + Number(curr.resultado), 0))}
            </TableCell>
            <TableCell className="text-right font-semibold"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
