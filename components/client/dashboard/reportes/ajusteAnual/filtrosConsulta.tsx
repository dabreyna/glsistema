"use client";

import { Label } from "@/components/ui/label";
import { useajusteAnualFiltrosConsultaStore } from "@/app/store/dashboard/reportes/ajusteAnual/filtrosConsultaStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
// import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { getListadoAjustesAnuales } from "@/lib/reportes/ajusteAnual/filtrosBusqueda";

interface Fraccionamiento {
  id_fraccionamiento: string;
  fraccionamiento: string;
}
interface Ajuste {
  anio: string;
}
interface FiltrosConsultaProps {
  listadoFraccionamientos: Fraccionamiento[];
  listadoAjustesAnuales: Ajuste[];
}

export default function FiltrosConsultaAjusteAnual({ listadoFraccionamientos, listadoAjustesAnuales }: FiltrosConsultaProps) {
  const seleccionaResultados = useajusteAnualFiltrosConsultaStore((state: { setResultados: any }) => state.setResultados);

  const meses: any = {
    "1": "Enero",
    "2": "Febrero",
    "3": "Marzo",
    "4": "Abril",
    "5": "Mayo",
    "6": "Junio",
    "7": "Julio",
    "8": "Agosto",
    "9": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre",
  };

  const [fraccionamiento, setFraccionamiento] = useState<string>("0");
  const [mesAjuste, setMesAjuste] = useState<string>("0");
  const [anioAjuste, setAnioAjuste] = useState<string>("0");

  function getDatos() {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/reportes/ajusteAnual?idFraccionamiento=${fraccionamiento}&mesAjuste=${mesAjuste}&anioAjuste=${anioAjuste}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();
        seleccionaResultados(data);
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
        <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
          <Label htmlFor="status">Mes</Label>
          <Select onValueChange={setMesAjuste} defaultValue="0">
            <SelectTrigger id="status" aria-label="Selecciona el mes">
              <SelectValue placeholder="Selecciona el mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" id="0">
                Selecciona el mes
              </SelectItem>
              {Object.keys(meses).map((key) => (
                <SelectItem key={key} value={key}>
                  {meses[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
          <Label htmlFor="status">Año Ajuste</Label>
          <Select onValueChange={setAnioAjuste} defaultValue="0">
            <SelectTrigger id="status" aria-label="Selecciona el año">
              <SelectValue placeholder="Selecciona el año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" id="0">
                Selecciona el año
              </SelectItem>
              {listadoAjustesAnuales.map((anio) => (
                <SelectItem key={anio.anio} value={anio.anio}>
                  {anio.anio}
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
