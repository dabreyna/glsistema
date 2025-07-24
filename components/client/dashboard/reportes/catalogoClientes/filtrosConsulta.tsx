"use client";

// export default function FiltrosConsultaCatalogoClientes() {
//   return <></>;
// }

//   {

import { Label } from "@/components/ui/label";
import { useCatalogoClientesFiltrosConsultaStore } from "@/app/store/dashboard/reportes/catalogoClientes/filtrosConsultaStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { get } from "lodash";

interface estatusTerreno {
  id_estatus: string;
  estatus: string;
}

interface fraccionamiento {
  id_fraccionamiento: string;
  fraccionamiento: string;
}

interface FiltrosConsultaProps {
  listaFraccionamientos: fraccionamiento[];
  listaEstatus: estatusTerreno[];
  id_usuario: string | undefined | null;
  perfil_usuario: string | undefined | null;
}
interface Manzana {
  id_manzana: string;
  no_manzana: string;
}
interface Terreno {
  id_terreno: string;
  no_terreno: string;
}

export default function FiltrosConsultaCatalogoClientes({
  id_usuario,
  perfil_usuario,
  listaFraccionamientos,
  listaEstatus,
}: FiltrosConsultaProps) {
  // { className }: React.HTMLAttributes<HTMLDivElement>
  const seleccionaResultados = useCatalogoClientesFiltrosConsultaStore(
    (state: { setResultados: any }) => state.setResultados
  );

  const [fraccionamiento, setFraccionamiento] = useState<string>("0");
  const [manzanas, setManzanas] = useState<Manzana[]>([]);
  const [manzana, setManzana] = useState<string>("0");
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [terreno, setTerreno] = useState<string>("0");
  // const [estatusLista, setEstatusLista] = useState<estatusTerreno[]>([]);
  const [estatus, setEstatus] = useState<string>("0");

  useEffect(() => {
    const getManzanas = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/reportes/catalogoClientes/filtros/manzanas?idFraccionamiento=${fraccionamiento}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();
        setManzanas(data);
      } catch (error) {
        console.error(error);
      }
    };
    getManzanas();
    setTerrenos([]);
  }, [fraccionamiento]); // Update  whenever filters changes

  useEffect(() => {
    const getTerrenos = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/reportes/catalogoClientes/filtros/terrenos?idManzana=${manzana}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();
        setTerrenos(data);
      } catch (error) {
        console.error(error);
      }
    };
    getTerrenos();
  }, [manzana]); // Update  whenever filters changes

  function getDatos() {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/reportes/catalogoClientes?idFraccionamiento=${fraccionamiento}&idManzana=${manzana}&idTerreno=${terreno}&idEstatus=${estatus}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();
        seleccionaResultados(data);
        console.log(data);
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
          <Select onValueChange={setFraccionamiento}>
            <SelectTrigger id="status" aria-label="Selecciona el medio">
              <SelectValue placeholder="Selecciona el medio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" id="0">
                Todos
              </SelectItem>
              {listaFraccionamientos.map((fraccionamiento) => (
                <SelectItem
                  key={fraccionamiento.id_fraccionamiento}
                  value={fraccionamiento.id_fraccionamiento}
                >
                  {fraccionamiento.fraccionamiento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <Label htmlFor="status">Manzana</Label>
          <Select onValueChange={setManzana}>
            <SelectTrigger id="status" aria-label="Selecciona el medio">
              <SelectValue placeholder="Selecciona el medio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" id="0">
                Todos
              </SelectItem>
              {manzanas.map((manzana) => (
                <SelectItem key={manzana.id_manzana} value={manzana.id_manzana}>
                  {manzana.no_manzana}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <Label htmlFor="status">Terreno</Label>
          <Select onValueChange={setTerreno}>
            <SelectTrigger id="status" aria-label="Selecciona el medio">
              <SelectValue placeholder="Selecciona el medio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" id="0">
                Todos
              </SelectItem>
              {terrenos.map((terreno) => (
                <SelectItem key={terreno.id_terreno} value={terreno.id_terreno}>
                  {terreno.no_terreno}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <Label htmlFor="status">Estatus</Label>
          <Select onValueChange={setEstatus}>
            <SelectTrigger id="status" aria-label="Selecciona el medio">
              <SelectValue placeholder="Selecciona el medio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" id="0">
                Todos
              </SelectItem>
              {listaEstatus.map((estadoTerreno) => (
                <SelectItem
                  key={estadoTerreno.id_estatus}
                  value={estadoTerreno.id_estatus}
                >
                  {estadoTerreno.estatus}
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
