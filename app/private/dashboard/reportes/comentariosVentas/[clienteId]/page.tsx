import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getComentarios } from "@/lib/reportes/comentariosVentas/comentarios";
import { FileDown } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ComentariosVentas({
    params,
  }: {
    params: { clienteId: string };
  }) {
    const session = await auth();
    if (!session) {
      redirect("/sistema");
    }
  
    //const { getCliente } = await import("@/lib/clientes/cliente");
    //const { getContratosPorIdCliente } = await import("@/lib/contratos/contrato");
  
    const comentariosVentas = await getComentarios(params.clienteId);
  
    return(
        <>
        <div className="mx-auto grid  flex-1 auto-rows-max gap-4 w-full">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-12 lg:gap-12">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-12 lg:gap-12">
                <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                    <CardTitle className="text-3xl text-center uppercase"> 
                        Comentarios Ventas
                        <br />
                        {params.clienteId}
                        </CardTitle>
                    <CardDescription>
                        
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex justify-end">
              {/* <Button id="toPDF" className="p-6"  onClick={() =>alert('PENDIENTE') }> 
                <FileDown style={{height:'30px',width:'30px'}}/>PDF
              </Button> */}
            </div>
            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm">
                <TableCaption>GRUPO LOTIFICADORA - REPORTE DE COMENTARIOS VENTAS - </TableCaption>
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow >
                    <TableHead className="text-center w-[150px]">Fecha</TableHead>
                    <TableHead className="text-center">Comentario</TableHead>
                    <TableHead className="text-center">Departamento</TableHead>
                    <TableHead className="text-center">Responsable</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {comentariosVentas.map((comentario) => (
                    <TableRow key={comentario.comentario}>
                        <TableCell className="font-medium text-xs text-center  w-[150px]">{comentario.fecha_comentario}</TableCell>
                        <TableCell className="text-left lg:w-[60%] md:w-[80%]">{comentario.comentario}</TableCell>
                        <TableCell className="text-center">{comentario.donde}</TableCell>
                        <TableCell className="text-center uppercase">{comentario.responsable}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
                <TableFooter>
                </TableFooter>  
                </Table>
                </CardContent>
                </Card>
                </div>
            </div>
        </div>
        </>
    );
}