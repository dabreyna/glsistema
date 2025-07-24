"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { BtnEditar } from "@/components/client/dashboard/contabilidad/btnEditar";
import { BtnEliminar } from "@/components/client/dashboard/contabilidad/btnEliminar";
import { BtnGenerar } from "@/components/client/dashboard/contabilidad/btnGenerar";
import { BtnBloquear } from "@/components/client/dashboard/contabilidad/btnBloquear";

interface Poliza {
    fecha_inicio: string;
    fecha_fin: string;
    concepto_poliza: string;
    id_poliza: string;
    bnd_contabilizado: string;
    id_empresa: string;
    nombre: string;
}
interface Empresa {
    id_empresa: string;
    razon_social: string;
}

interface TablaDatosProps {
    listaPolizas: Poliza[];
    listaEmpresas: Empresa[];
}

export default function TablaDatos({ listaPolizas }: TablaDatosProps) {
    // console.log(listaPolizas[0]);
    let textobtn = "";
    return (
        <>
            <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm">
                <TableCaption>GRUPO LOTIFICADORA - POLIZAS - </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center" colSpan={12}></TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-center">Fecha Inicio</TableHead>
                        <TableHead className="text-center">Fecha Fin</TableHead>
                        <TableHead className="text-center">Poliza</TableHead>
                        <TableHead className="text-center">Empresa</TableHead>
                        <TableHead className="text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listaPolizas.map((poliza) => {
                        console.log(poliza.bnd_contabilizado);
                        //const textobtn = poliza.bnd_contabilizado.toString() === "true" ? "Bloquear" : "Desbloquear";
                        if (poliza.bnd_contabilizado.toString() === "true") {
                            textobtn = "Desbloquear";
                        } else {
                            textobtn = "Bloquear";
                        }
                        return (
                            <>
                                <TableRow key={poliza.id_poliza} className="shadownc-table__row my-row">
                                    <TableCell className="font-medium text-xs" style={{ height: "10px", padding: 2 }}>
                                        {poliza.fecha_inicio}
                                    </TableCell>
                                    <TableCell className="text-center font-medium text-xs">{poliza.fecha_fin}</TableCell>
                                    <TableCell className="text-center font-medium text-xs">{poliza.concepto_poliza}</TableCell>
                                    <TableCell className="text-right font-medium text-xs">{poliza.nombre} </TableCell>
                                    <TableCell>
                                        <BtnEditar id={poliza.id_poliza} />
                                        <BtnEliminar
                                            id={poliza.id_poliza}
                                            poliza={poliza.concepto_poliza}
                                            empresa={poliza.nombre}
                                            fFin={poliza.fecha_fin}
                                            fInicio={poliza.fecha_inicio}
                                        />
                                        <BtnGenerar id={poliza.id_poliza} />
                                        <BtnBloquear
                                            id={poliza.id_poliza}
                                            textobtn={textobtn}
                                            bndContabilizado={poliza.bnd_contabilizado}
                                        />
                                    </TableCell>
                                </TableRow>
                            </>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
