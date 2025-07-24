"use client";

import { Label } from "@/components/ui/label";
import { usegeneralInventariosFiltrosConsultaStore } from "@/app/store/dashboard/reportes/generalInventarios/filtrosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
// import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Fraccionamiento {
  id_fraccionamiento: string;
  fraccionamiento: string;
}
interface Financiamiento {
  financiamiento: string;
  porcentaje: string;
  id_financiamiento: string;
  no_pagos: string;
}

interface FiltrosConsultaProps {
  listadoFraccionamientos: Fraccionamiento[];
  listadoFinanciamientos: Financiamiento[];
}

interface Financiamiento {
  financiamiento: string;
  porcentaje: string;
  id_financiamiento: string;
  no_pagos: string;
}

export default function FiltrosConsultaGeneralInventarios({ listadoFraccionamientos, listadoFinanciamientos }: FiltrosConsultaProps) {
  const seleccionaResultados = usegeneralInventariosFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);
  const financiamientos = usegeneralInventariosFiltrosConsultaStore((state: { setFinanciamientos: any }) => state.setFinanciamientos);

  const [fraccionamiento, setFraccionamiento] = useState<string>("0");
  // const [terrenos, setTerrenos] = useState<Financiamiento[]>([]);

  function getDatos() {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/dashboard/reportes/generalInventarios?idFraccionamiento=${fraccionamiento}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();
        seleccionaResultados(data);
        financiamientos(listadoFinanciamientos);

        // console.log(listadoFinanciamientos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
        <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
          <Label htmlFor="status">Fraccionamiento</Label>
          <Select onValueChange={setFraccionamiento} defaultValue="0">
            <SelectTrigger id="status" aria-label="Selecciona el fraccionamiento">
              <SelectValue placeholder="Selecciona el fraccionamiento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" id="0">
                Selecciona el fraccionamiento
              </SelectItem>
              {listadoFraccionamientos.map((fraccionamiento) => (
                <SelectItem key={fraccionamiento.id_fraccionamiento} value={fraccionamiento.id_fraccionamiento}>
                  {fraccionamiento.fraccionamiento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator className="my-4 size-1 bg-white" />
      <Button className="p-6" onClick={getDatos}>
        DATOS
      </Button>
    </>
  );
}
