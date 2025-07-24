"use client";
import { Button } from "@/components/ui/button";
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

interface Precio {
  id_fraccionamiento:string;
  fraccionamiento:string;
  tipo_terreno:string;
  id_tipo_terreno:string;
  precio_m2:string;
}

export default function TablaDatos({precios}: {precios: Precio[]}) {



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
          GRUPO LOTIFICADORA - <span className="bg-slate-200">[ADMINISTRACION __ LISTA DE PRECIOS]</span> -
        </TableCaption>
        <TableHeader className="border-2 border-slate-200 shadow-lg">
          <TableRow className="uppercase bg-slate-200 hover:bg-slate-200">
            <TableHead className="text-center">Fraccionamiento</TableHead>
            <TableHead className="text-center">Tipo de terreno</TableHead>
            <TableHead className="text-center">Precio x m2</TableHead>
            <TableHead className="text-center"></TableHead>
            <TableHead className="text-center"></TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {precios.map((precio) => ( 
            <>
              <TableRow key={precio.id_fraccionamiento} className="hover:bg-slate-100">
                <TableCell className="text-left text-sm p-1">{precio.fraccionamiento}</TableCell>
                <TableCell className="text-left text-sm p-1">{precio.tipo_terreno}</TableCell>
                <TableCell className="text-left text-sm p-1">{precio.precio_m2}</TableCell>
                <TableCell className="text-left text-sm p-1"></TableCell>
                <TableCell className="text-left text-sm p-1">
                <Button className="p-6">Actualizar</Button>
                </TableCell>
              </TableRow>

            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
