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

interface Empresa {
  id_empresa: string;
  nombre: string;
  razon_social: string;
  rfc: string;
  ciudad: string;
  direccion: string;
  representante_legal: string;
  telefono_principal: string;
  email: string;
  estado: string;
}

export default function TablaDatos({empresas}: {empresas: Empresa[]}) {



  return (
    <>
      {/* <div className="flex justify-end">
        <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
          <FileDown style={{ height: "30px", width: "30px" }} />
          PDF
        </Button>
      </div> */}
      <Table
        id="tablaDatos"
        className="rounded-md border-2 border-slate-200 shadow-sm"
      >
        <TableCaption>
          GRUPO LOTIFICADORA - <span className="bg-slate-200">[ADMINISTRACION __ EMPRESAS]</span> -
        </TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg">
          <TableRow className="uppercase bg-slate-200 hover:bg-slate-200">
            <TableHead className="text-center">Nombre</TableHead>
            <TableHead className="text-center">Razón social</TableHead>
            <TableHead className="text-center">RFC</TableHead>
            <TableHead className="text-center">Ciudad</TableHead>
            <TableHead className="text-center">Dirección</TableHead>
            <TableHead className="text-center">Representante legal</TableHead>
            <TableHead className="text-center">Teléfono</TableHead>
            <TableHead className="text-center">Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.map((empresa) => (
            <>
              <TableRow key={empresa.id_empresa} className="hover:bg-slate-100">
                <TableCell className="text-left text-sm p-1">{empresa.nombre}</TableCell>
                <TableCell className="text-left text-sm p-1">{empresa.razon_social}</TableCell>
                <TableCell className="text-left text-sm p-1">{empresa.rfc}</TableCell>
                <TableCell className="text-left text-sm p-1">{empresa.ciudad}</TableCell>
                <TableCell className="text-left text-sm p-1">{empresa.direccion}</TableCell>
                <TableCell className="text-left text-sm p-1">{empresa.representante_legal}</TableCell>
                <TableCell className="text-left text-sm p-1">{empresa.telefono_principal}</TableCell>
                <TableCell className="text-left text-sm p-1">{empresa.email}</TableCell>
              </TableRow>

            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
