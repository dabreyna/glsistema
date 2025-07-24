"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useComentariosFiltrosConsultaStore } from "@/app/store/dashboard/cobranza/comentarios/filtrosConsultaStore";
// import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function TablaDatos() {
  const comentarios = useComentariosFiltrosConsultaStore((state) => state.resultados);
  const router = useRouter();
  // const handleDetallesCliente = (id_cliente: string) => {
  //   if (id_cliente != "") {
  //     router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
  //   }
  // };
  return (
    <>
      <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div>

      <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]">
        <TableCaption>GRUPO LOTIFICADORA - REPORTE COMENTARIOS COBRANZA - </TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg">
          <TableRow>
            <TableHead className="text-center w-[80px] p-0">Fecha</TableHead>
            <TableHead className="text-center p-0">Cliente</TableHead>
            <TableHead className="text-center p-0 ">Comentario</TableHead>
            <TableHead className="text-center p-0 w-[200px]">Asesor</TableHead>
            <TableHead className="text-center p-0 w-[180px]">Terreno</TableHead>
            {/* <TableHead className="text-center">Clasificacion</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {comentarios.map((comentario) => (
              <TableRow key={`${comentario.id_comentario}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                <TableCell className="text-center max-w-[100px] uppercase">{comentario.fecha}</TableCell>
                <TableCell className="text-center max-w-[150px] uppercase">{comentario.nombre_cliente}</TableCell>
                <TableCell className="text-center max-w-[500px]">{comentario.comentario}</TableCell>
                <TableCell className="text-left max-w-[150px] uppercase">{comentario.nombre_asesor}</TableCell>
                <TableCell className="text-center max-w-[20px]">{comentario.terreno}</TableCell>
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>
    </>
  );
}
