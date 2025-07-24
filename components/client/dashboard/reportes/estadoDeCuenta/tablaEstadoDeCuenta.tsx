"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// import { Estad} from "@/components/client/dashboard/reportes/estadoDeCuenta/estadoDeCuenta";
interface EstadoDeCuenta {
  id_contrato: string;
  total_pagado: number;
  terreno: string;
  concepto: string;
  monto_terreno_inicial: number;
  descuentos: number;
  descuentos_mensualidad: number;
  ajuste_anual: number;
  ajuste_anual_saldo: number;
  saldo_ajustado: number;
  deposito: number;
  pagos: number;
  saldo: number;
  mensualidades_pendientes: number;
  superficie: number;
  deposito_preferente: number;
}
export default function TablaEstadoDeCuenta({ datosEstadoDeCuenta }: { datosEstadoDeCuenta: EstadoDeCuenta[] }) {
  return (
    <>
      <Table
        id={`tablaEstadoDeCuenta-${datosEstadoDeCuenta[0]?.id_contrato}`}
        className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]"
      >
        {/* <TableCaption>
          GRUPO LOTIFICADORA - REPORTE DE ESTADO DE CUENTA -{" "}
        </TableCaption> */}
        <TableHeader className="border-2 border-slate-200 shadow-lg g-1">
          <TableRow>
            <TableHead className="text-center">Terreno</TableHead>
            <TableHead className="text-center">Concepto</TableHead>
            <TableHead className="text-center">Superficie m2</TableHead>
            <TableHead className="text-center">Depósito por preferencia</TableHead>
            <TableHead className="text-center">Descuentos</TableHead>
            <TableHead className="text-center">Ajuste anual</TableHead>
            <TableHead className="text-center">Ajuste anual saldo</TableHead>
            <TableHead className="text-center">Depósito por preferencia financiado</TableHead>
            <TableHead className="text-center">Depósito inicial</TableHead>
            <TableHead className="text-center">Depósito preferente</TableHead>
            <TableHead className="text-center">Total depósito preferente</TableHead>
            <TableHead className="text-center">Saldo</TableHead>
            <TableHead className="text-center">Mens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {datosEstadoDeCuenta.map((resultado) => (
              <TableRow key={`${resultado.id_contrato}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                <TableCell className="text-right">{resultado.terreno}</TableCell>
                <TableCell className="text-right">{resultado.concepto}</TableCell>
                <TableCell className="text-right font-semibold">
                  {new Intl.NumberFormat("es-MX", { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(
                    Number(resultado.superficie)
                  )}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.monto_terreno_inicial))}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.descuentos))}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.ajuste_anual))}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.ajuste_anual_saldo))}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.saldo_ajustado))}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.deposito))}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.deposito_preferente))}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.total_pagado))}
                </TableCell>
                <TableCell colSpan={1} className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.saldo))}
                </TableCell>
                <TableCell className="text-right">{resultado.mensualidades_pendientes}</TableCell>
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>
    </>
  );
}
