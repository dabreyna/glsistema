"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { set } from "lodash";

// import { useListadoCitasStore } from "@/app/store/dashboard/cobranza/agenda/listadoCitasStore";
import { escapeLiteral } from "pg";
import { useEffect, useState } from "react";
import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";

interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}
interface DatosMovimientos {
    no_pago: number;
    fecha_movimiento: string;
    movimiento: string;
    monto_saldo: string;
    interes: string;
    tipo_movimiento: string;
    dias_de_vencimiento: string;
    id_servicio: string;
    id_carga: string;
    no_medidor: string;
}

export default function TablaMovimientos() {
    // const { listadoCitas, setListadoCitas } = useListadoCitasStore();
    const idContrato = useContratoSelectedStore((state) => state.idContrato);
    const [movimientos, setMovimientos] = useState<DatosMovimientos[]>([]);

    useEffect(() => {
        // if(isMounted){
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/detallesContrato/tablaMovimientos?idContrato=${idContrato}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setMovimientos(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        // } else {
        //   setIsMounted(true);
        // }
    }, [idContrato]);
    let total: number = 0;

    return (
        <>
            <Table id="tablaDatos" className="rounded-md border-2 border-slate-200 shadow-sm max-w-[500px]">
                {/* <TableCaption> - GRUPO LOTIFICADORA - </TableCaption> */}
                <TableHeader className="border-2 border-slate-200 shadow-lg">
                    <TableRow>
                        <TableHead className="text-center"># Pago</TableHead>
                        <TableHead className="text-center">Periodo</TableHead>
                        <TableHead className="text-center">Monto</TableHead>
                        <TableHead className="text-center">Intereses</TableHead>
                        <TableHead className="text-center">Movimiento</TableHead>
                        {/* <TableHead className="text-center">Dias vencidos</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {movimientos.map((movimiento) => {
                        total += Number(movimiento.monto_saldo);
                        if (movimiento.movimiento === "MENSUALIDAD") {
                            total += Number(movimiento.interes);
                        }

                        return (
                            <>
                                <TableRow key={`${movimiento.id_carga}-`} className="text-xs">
                                    <TableCell className=" text-xs text-center">{movimiento.no_pago}</TableCell>
                                    <TableCell className=" text-xs text-center">{movimiento.fecha_movimiento}</TableCell>
                                    <TableCell className=" text-xs text-center">
                                        {new Intl.NumberFormat("es-MX", {
                                            style: "currency",
                                            currency: "MXN",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(Number(movimiento.monto_saldo))}
                                    </TableCell>
                                    <TableCell className=" text-xs text-center">
                                        {Number(movimiento.interes) > 0.0 && movimiento.movimiento === "MENSUALIDAD" && (
                                            <TableCell className=" text-xs text-center">
                                                {new Intl.NumberFormat("es-MX", {
                                                    style: "currency",
                                                    currency: "MXN",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }).format(Number(movimiento.interes))}
                                            </TableCell>
                                        )}
                                    </TableCell>
                                    <TableCell className=" text-xs text-center">{movimiento.movimiento}</TableCell>
                                    {/* <TableCell className=" text-xs text-center">{movimiento.dias_de_vencimiento}</TableCell> */}
                                </TableRow>
                                {/* {Number(movimiento.interes) > 0.0 && movimiento.movimiento === "MENSUALIDAD" && (
                                    <TableRow key={`${movimiento.id_carga}-interes`} className="text-xs">
                                        <TableCell className=" text-xs text-center">{movimiento.no_pago}</TableCell>
                                        <TableCell className=" text-xs text-center">{movimiento.fecha_movimiento}</TableCell>
                                        <TableCell className=" text-xs text-center">
                                            {new Intl.NumberFormat("es-MX", {
                                                style: "currency",
                                                currency: "MXN",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(Number(movimiento.interes))}
                                        </TableCell>
                                        <TableCell className=" text-xs text-center">INTERESES</TableCell>
                                    </TableRow>
                                )} */}
                            </>
                        );
                    })}
                    <TableRow key={`totalSaldos`} className="text-xs">
                        <TableCell className=" text-xs text-right" colSpan={2}>
                            Total: &nbsp;&nbsp;
                        </TableCell>
                        <TableCell className=" text-xs text-center" colSpan={1}>
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(Number(total))}
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter></TableFooter>
            </Table>
        </>
    );
}
