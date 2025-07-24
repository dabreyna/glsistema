"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLecturasAguaFiltrosConsultaStore } from "@/app/store/dashboard/atencionCliente/lecturasAgua/filtrosConsultaStore";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/hooks/use-toast";
import { Square, SquareX, Trash2 } from "lucide-react";

export default function TablaDatos() {
    const toast = useToast();
    const lecturas = useLecturasAguaFiltrosConsultaStore((state) => state.resultados);
    // const router = useRouter();
    // const handleDetallesCliente = (id_cliente: string) => {
    //     if (id_cliente != "") {
    //         router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
    //     }
    // };
    const getSemaforoComponent = (semaforo: string) => {
        switch (semaforo) {
            case "SUSPENDIDA":
                return <Square className="bg-amber-500 text-amber-500 rounded  w-[30px] h-[30px]" />;
            case "ACTIVA":
                return <Square className="bg-blue-500 text-blue-500 rounded  w-[30px] h-[30px]" />;
            default:
                return null; // Or a default component if needed
        }
    };
    const deleteLectura = (idM: number, idC: number) => {
        console.log(idM);
        console.log(idC);
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/atencionCliente/lecturasAgua/eliminar?idM=${idM}&idC=${idC}`);
                if (!response.ok) {
                    toast.toast({
                        title: "ERROR",
                        description: "Algo sucedio y no se pudo actualizar la informacion, intentalo de nuevo.",
                        variant: "destructive",
                        duration: 1750,
                    });
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                toast.toast({
                    title: `ORDEN EJECUTADA`,
                    description: `Lectura eliminada exitosamente.`,
                    variant: "primary",
                    duration: 1750,
                });
                // Eliminar(ocultar) la fila del DOM
                const rowToRemove = document.getElementById(`L_${idC}`);
                if (rowToRemove) {
                    rowToRemove.hidden = true; // Ocultar fila, por que si se usa el remove() se elimina del DOM y al volver a cargar la consulta genera error al generar la tabla
                }
                const data = await response.json();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    };

    let cont = 0;
    // console.log(idServicio);
    function tablaDatos() {
        return (
            <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                <TableCaption>- GRUPO LOTIFICADORA - </TableCaption>
                <TableHeader className="border border-slate-200 bg-red-700 text-white">
                    <TableRow>
                        <TableHead className="text-center w-[30px] text-white">#</TableHead>
                        <TableHead className="text-white">Contrato</TableHead>
                        <TableHead className="text-white">Toma</TableHead>
                        <TableHead className="w-[160px] text-white">
                            Lectura <br /> Anterior
                        </TableHead>
                        <TableHead className="w-[160px] text-white">
                            Lectura <br /> Actual
                        </TableHead>
                        <TableHead className="w-[160px] text-white">
                            Fecha <br /> Lectura
                        </TableHead>
                        <TableHead className="text-white">Observaciones</TableHead>
                        <TableHead className="text-white">Fotos</TableHead>
                        <TableHead className="text-white">Importe</TableHead>
                        <TableHead className="text-white">
                            Estatus
                            <br />
                            Toma
                        </TableHead>
                        <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {lecturas.map((lectura) => {
                            cont++;
                            const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                const newData = event.target.value;
                                const col = event.target.id;
                                // actualizarDatos(cliente.id_solicitud_servicio, newData, col, 1);
                            };

                            return (
                                <>
                                    <TableRow key={lectura.id_carga} id={`L_${lectura.id_carga}`}>
                                        <TableCell className="text-center text-xs p-1">{cont}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{lectura.id_contrato}</TableCell>
                                        <TableCell className="text-left uppercase text-xs p-1">{lectura.toma_agua}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{lectura.lectura_anterior}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{lectura.lectura_actual}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{lectura.fecha_lectura}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{lectura.observaciones}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{lectura.fotos}</TableCell>
                                        <TableCell className="text-left text-xs p-1">{lectura.importe}</TableCell>
                                        <TableCell className="text-center font-medium text-xs p-1">
                                            {getSemaforoComponent(lectura.estatus)}
                                        </TableCell>
                                        <TableCell className="text-center text-xs p-1">
                                            <button
                                                className="btn btn-ghost btn-md"
                                                onClick={() => deleteLectura(Number(lectura.id_movimiento), Number(lectura.id_carga))}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        );
    }

    return (
        <>
            <div className="flex justify-end p-2">
                {/* Botón PDF (Comentado) */}
                {/* <Square className="bg-green-500 text-green-500 rounded  w-[20px] h-[20px] " />
                &nbsp; EN CURSO &nbsp; */}
                <Square className="bg-amber-500 text-amber-500 rounded  w-[20px] h-[20px]" />
                &nbsp; SUSPENDIDA&nbsp;
                <Square className="bg-blue-500 text-blue-500 rounded  w-[20px] h-[20px]" />
                &nbsp; ACTIVA&nbsp;
                {/* <SquareX className="bg-red-500 text-white rounded w-[20px] h-[20px]" />
                &nbsp; CANCELADO&nbsp; */}
            </div>

            {(() => {
                return tablaDatos(); // Retorna el resultado de la función
            })()}
        </>
    );
}
