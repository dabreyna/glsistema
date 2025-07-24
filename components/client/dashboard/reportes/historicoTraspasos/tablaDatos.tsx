"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useHistoricoTraspasosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/historicoTraspasos/filtrosConsultaStore";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import "moment/locale/es";

export default function TablaDatos() {
  const resultados = useHistoricoTraspasosFiltrosConsultaStore((state) => state.resultados);

  return (
    <>
      <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div>
      <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm">
        <TableCaption>GRUPO LOTIFICADORA - REPORTE HISTORICO DE TRASPASOS - </TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg">
          <TableRow>
            <TableHead className="text-center uppercase">Fraccionamiento</TableHead>
            <TableHead className="text-center uppercase">Manzana</TableHead>
            <TableHead className="text-center uppercase">Terreno</TableHead>
            <TableHead className="text-center uppercase">Fecha en sistema</TableHead>
            <TableHead className="text-center uppercase">Fecha de recibo</TableHead>
            <TableHead className="text-center uppercase">Comision</TableHead>
            <TableHead className="text-center uppercase">Monto de comision</TableHead>
            <TableHead className="text-center uppercase">Cliente anterior</TableHead>
            <TableHead className="text-center uppercase">Cliente nuevo</TableHead>
            <TableHead className="text-center uppercase">Recibo</TableHead>
            <TableHead className="text-center uppercase">Comentarios</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resultados.length > 0 ? (
            resultados.map((resultado, index) => (
              <TableRow key={index} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                <TableCell className="text-left border-2 border-slate-200 ">{resultado.fraccionamiento}</TableCell>
                <TableCell className="text-left border-2 border-slate-200 ">{resultado.manzana}</TableCell>
                <TableCell className="text-left border-2 border-slate-200 ">{resultado.terreno}</TableCell>
                <TableCell className="text-center border-2 border-slate-200 ">{resultado.fecha}</TableCell>
                <TableCell className="text-center border-2 border-slate-200 ">{resultado.fecha_recibo}</TableCell>
                <TableCell className="text-center border-2 border-slate-200 ">{resultado.comision}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(resultado.monto_comision))}
                </TableCell>
                {/* <TableCell className="text-center border-2 border-slate-200 ">{resultado.monto_comision}</TableCell> */}
                <TableCell className="text-left border-2 border-slate-200 ">{resultado.clienteanterior}</TableCell>
                <TableCell className="text-left border-2 border-slate-200 ">{resultado.clientenuevo}</TableCell>
                <TableCell className="text-left border-2 border-slate-200 ">{resultado.folio_recibo}</TableCell>
                <TableCell className="text-left border-2 border-slate-200 ">{resultado.comentarios}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="font-medium text-xs bg-slate-100" style={{ height: "10px", padding: 2 }}>
                No hay datos, verificar los filtros
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </>
  );
}
