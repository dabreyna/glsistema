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
} from "@/components/ui/table";

//import { useInventarioOcupacionFiltrosConsultaStore } from "@/app/store/dashboard/reportes/terrenosDisponibles/fraccionamientoSelectedStore";
import { useInventarioOcupacionFiltrosConsultaStore } from "@/app/store/dashboard/reportes/inventarioOcupacion/filtrosConsultaStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Resultados } from "../../../../../app/private/dashboard/buscarCliente/resultados";
import router from "next/router";
import { useRouter } from "next/navigation";

export default function TablaDatos() {
  const idFraccionamiento = useInventarioOcupacionFiltrosConsultaStore(
    (state) => state.idFraccionamiento
  );
  const manzanas = useInventarioOcupacionFiltrosConsultaStore(
    (state) => state.resultados
  );
  // console.log(manzanas);
  const router = useRouter();
  const handleDetallesCliente = (id_cliente: string) => {
    if (id_cliente != "") {
      router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
    }
  };
  return (
    <>
      <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div>
      <Table
        id="tablaDatos"
        className="rounded-md border-2 border-slate-200 shadow-sm"
      >
        <TableCaption>
          GRUPO LOTIFICADORA - REPORTE DE INVENTARIO VS. OCUPACION -{" "}
        </TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg">
          <TableRow>
            <TableHead className="w-[100px]">Terreno</TableHead>
            <TableHead className="text-right">Ubicación</TableHead>
            <TableHead className="text-right">Superficie</TableHead>
            <TableHead className="text-right">Precio m2</TableHead>
            <TableHead className="text-right">Precio Terreno</TableHead>
            <TableHead className="text-right">Cliente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manzanas.map((manzana) => (
            <>
              <TableRow
                key={manzana.manzana}
                className="shadownc-table__row my-row"
              >
                <TableCell
                  colSpan={9}
                  className="font-medium text-xs bg-slate-100"
                  style={{ height: "10px", padding: 2 }}
                >
                  Manzana: {manzana.manzana}
                </TableCell>
              </TableRow>
              {manzana.terrenos.map((terreno) => (
                <TableRow
                  key={`${terreno.id_contrato}-${terreno.no_terreno}`}
                  className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer"
                >
                  <TableCell className="font-medium text-xs">
                    {terreno.no_terreno}
                  </TableCell>
                  <TableCell className="text-right">
                    {terreno.nomenclatura}-{terreno.no_manzana}-
                    {terreno.no_terreno}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("es-MX", {
                      style: "decimal",
                      currency: "MXN",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(terreno.superficie))}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(terreno.precio_m2))}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(terreno.precio_financiar))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/private/dashboard/detallesContrato/${terreno.id_cliente}`}
                      className="text-blue-500 underline"
                      target="_blank"
                    >
                      {terreno.nombre_cliente}
                    </Link>
                  </TableCell>
                  {/* {financiamientos.map((financiamiento)=>(
                            <TableCell key={financiamiento.financiamiento} className="text-right">{calculaMonto(financiamiento.porcentaje,financiamiento.no_pagos,terreno.total_terreno)}</TableCell>
                          ))} */}
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
