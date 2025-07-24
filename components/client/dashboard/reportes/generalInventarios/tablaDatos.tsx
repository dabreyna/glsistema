"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { usegeneralInventariosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/generalInventarios/filtrosConsultaStore";
import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { set } from "lodash";

export default function TablaDatos() {
  let total: number = 0;
  let total1: number = 0;
  let total2: number = 0;
  const resultados = usegeneralInventariosFiltrosConsultaStore((state) => state.resultados);
  const financiamientos = usegeneralInventariosFiltrosConsultaStore((state) => state.financiamientos);

  function calculaMonto(porcentaje: number, no_pagos: number, total_terreno: number) {
    const porcentaje_num = Number(porcentaje) / 100;
    const precioTerreno = Number(Number(total_terreno) * porcentaje_num + Number(total_terreno));
    const mensualidad = Number((precioTerreno / Number(no_pagos)).toFixed(3));

    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(mensualidad);
  }

  let total3 = 0;

  return (
    <>
      <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div>
      <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm">
        <TableCaption>GRUPO LOTIFICADORA - REPORTE GENERAL DE INVENTARIO - </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center" colSpan={12}></TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="w-[100px]">Terreno</TableHead>
            <TableHead className="text-right">Superficie</TableHead>
            <TableHead className="text-right">Precio m2</TableHead>
            <TableHead className="text-right">Total</TableHead>

            {financiamientos ? (
              <>
                {financiamientos.map((financiamiento) => (
                  <TableHead key={financiamiento.financiamiento} className="text-right">
                    {financiamiento.financiamiento}
                  </TableHead>
                ))}
              </>
            ) : (
              <>
                <TableHead>cargando Financiamientos...</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {resultados.map((resultado) => (
            <>
              <TableRow key={resultado.manzana} className="shadownc-table__row my-row">
                <TableCell colSpan={9} className="font-medium text-xs bg-slate-100" style={{ height: "10px", padding: 2 }}>
                  Manzana: {resultado.manzana}
                </TableCell>
              </TableRow>
              {resultado.terrenos.map((terreno) => {
                total1 += Number(terreno.superficie);
                total2 += Number(terreno.valor_total);
                total += 1;

                const rowClass =
                  terreno.estatus == 3 || terreno.estatus === 4 ? "text-red-500" : terreno.estatus === 1 ? "text-blue-500" : "";
                console.log(rowClass);
                return (
                  <TableRow key={`${terreno.consecutivo}-${terreno.no_terreno}`} className={rowClass}>
                    <TableCell className="font-medium text-xs">
                      {terreno.nomenclatura}-{terreno.no_manzana}-{terreno.no_terreno}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-MX", { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                        Number(terreno.superficie)
                      )}{" "}
                      m2
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(terreno.precio_m2))}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(terreno.valor_total))}
                    </TableCell>
                    {financiamientos.map((financiamiento) => (
                      <TableCell key={financiamiento.financiamiento} className="text-right">
                        {calculaMonto(financiamiento.porcentaje, financiamiento.no_pagos, terreno.total_terreno)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                <TableCell colSpan={1} className="font-semibold text-right">
                  Subtotal:
                  {resultado.terrenos.length}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "decimal",
                    // currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(resultado.terrenos.reduce((acc, curr) => acc + Number(curr.superficie), 0))}{" "}
                  m2
                </TableCell>
                <TableCell className="text-right font-semibold"></TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(resultado.terrenos.reduce((acc, curr) => acc + Number(curr.valor_total), 0))}
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
                style: "decimal",
                // currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(total1))}{" "}
              m2
            </TableCell>
            <TableCell className="text-right font-semibold"></TableCell>
            <TableCell className="text-right font-semibold">
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(total2))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
