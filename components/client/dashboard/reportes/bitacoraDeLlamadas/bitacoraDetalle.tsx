import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import logoLotificadora from "@/public/logo.png";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import TablaEstadoDeCuenta from "@/components/client/dashboard/reportes/detalladoDePagos/tablaEstadoDeCuenta";
import TablaDeSaldosPagados from "@/components/client/dashboard/reportes/detalladoDePagos/tablaDeSaldosPagados";
import TablaDeServiciosPagados from "@/components/client/dashboard/reportes/detalladoDePagos/tablaDeServiciosPagados";
import TablaResumenSaldosVencidos from "@/components/client/dashboard/reportes/detalladoDePagos/tablaResumenSaldosVencidos";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Detalles {
  numero_fila: string;
  terreno: string;
  nombre_cliente: string;
  id_cliente: string;
  fecha_agenda: string;
  clasificacion: string;
  comentario: string;
  tel_cel: string;
  tel_casa: string;
  tel_trabajo: string;
  email: string;
}

interface BitacoraDetalleProps {
  id_asesor: number;
  fil_asesor: string;
  fil_fecha_ini: string;
  fil_fecha_fin: string;
  fil_cliente: string;
  fil_clasificacion: string;
  asesor: string;
}

export function BitacoraDeLlamadasDetalle({
  id_asesor,
  fil_asesor,
  fil_fecha_ini,
  fil_fecha_fin,
  fil_cliente,
  fil_clasificacion,
  asesor,
}: BitacoraDetalleProps) {
  const [dataBitacora, setDataBitacora] = useState<Detalles[]>([]);
  function print() {
    // window.print();
    // document.getElementById("tablaDatos").style.display = "none";
  }

  const fetchData = async () => {
    try {
      const response =
        await fetch(`/api/dashboard/reportes/bitacoraDeLlamadas/detalles?id_asesor=${id_asesor}&fil_asesor=${fil_asesor}&fil_fecha_ini=${fil_fecha_ini}
        &fil_fecha_fin=${fil_fecha_fin}&fil_cliente=${fil_cliente}&fil_clasificacion=${fil_clasificacion}&asesor=${asesor}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();
      setDataBitacora(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={fetchData} className="uppercase">
          Ver Detalles
        </Button>
      </DialogTrigger>
      <DialogContent className=" md:max-w-full sm:min-w-[430px] lg:max-w-[95%] h-[90%]">
        <ScrollArea className="h-6/6 w-full rounded-md border p-4">
          <DialogHeader>
            <DialogTitle className="text-center uppercase">DETALLE BITACORA DE LLAMADAS</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-6">
              <span className="text-lg text-center uppercase">
                ASESOR: {asesor} - PERIODO {fil_fecha_ini} - {fil_fecha_fin}
              </span>
              <Separator className="my-4" />
              <Table id={`tablaBitacoraDeLlamadas`} className="rounded-md border-2 border-slate-200 shadow-sm max-w-[full]">
                {/* <TableCaption>
          GRUPO LOTIFICADORA - REPORTE DE ESTADO DE CUENTA -{" "}
        </TableCaption> */}
                <TableHeader className="border-2 border-slate-200 shadow-lg g-1">
                  <TableRow>
                    <TableHead className="text-center">Terreno</TableHead>
                    <TableHead className="text-center">Cliente</TableHead>
                    <TableHead className="text-center">Fecha</TableHead>
                    <TableHead className="text-center">Telefonos</TableHead>
                    <TableHead className="text-center">Clasificación</TableHead>
                    <TableHead className="text-center">Comentarios</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <>
                    {dataBitacora.map((resultado) => (
                      <TableRow key={`${resultado.numero_fila}`} className="hover:bg-slate-100 hover:font-semibold hover:cursor-pointer">
                        <TableCell className="text-right">{resultado.terreno}</TableCell>
                        <TableCell className="text-right">{resultado.nombre_cliente}</TableCell>
                        <TableCell className="text-right">{resultado.fecha_agenda}</TableCell>
                        <TableCell className="text-left">
                          Casa: {resultado.tel_casa}
                          <br />
                          Celular: {resultado.tel_cel}
                          <br />
                          Trabajo: {resultado.tel_trabajo}
                          <br />
                          Email: {resultado.email}
                        </TableCell>
                        <TableCell className="text-center">{resultado.clasificacion}</TableCell>
                        <TableCell className="text-left text-wrap">{resultado.comentario}</TableCell>
                      </TableRow>
                    ))}
                  </>
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <SheetClose asChild>
            <Button>Imprimir</Button>
          </SheetClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
