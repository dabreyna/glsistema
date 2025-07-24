"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useContratosPagadosConsultaStore } from "@/app/store/dashboard/reportes/contratosPagados/resultadosConsultaStore";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// interface Saldo {
//     consecutivo: string;
//     id_contrato: string;
//     terreno: string;
//     nombre_cliente: string;
//     precio_original: string;
//     precio_actual: string;
//     pagado: string;
//     saldo: string;
//     fecha_contrato: string;
// }

export default function TablaDatos() {
    const resultados = useContratosPagadosConsultaStore((state) => state.resultados);

    return (
        <>
            <div className="flex justify-end">
                <Button id="toPDF" className="p-6" onClick={() => alert("PENDIENTE")}>
                    <FileDown style={{ height: "30px", width: "30px" }} />
                    PDF
                </Button>
            </div>
            <Table id="tablaDatos" className="rounded-md border-1 border-slate-200 shadow-sm max-w-[full] mx-auto">
                <TableCaption>GRUPO LOTIFICADORA - SALDOS CONTRATOS PAGADOS - </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center" colSpan={12}></TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-left">Terreno</TableHead>
                        <TableHead className="text-center">Cliente</TableHead>
                        <TableHead className="text-center">Precio Original</TableHead>
                        <TableHead className="text-center">Precio Inventario</TableHead>
                        <TableHead className="text-center">Pagado</TableHead>
                        <TableHead className="text-center">Ultimo Pago</TableHead>
                        <TableHead className="text-center">Fecha contrato</TableHead>
                        <TableHead className="text-center">Superficie</TableHead>
                        <TableHead className="text-center">Tel_casa</TableHead>
                        <TableHead className="text-center">Tel_cel</TableHead>
                        <TableHead className="text-center">Tel_ofi</TableHead>
                        <TableHead className="text-center max-w-[90px]">Tel_casa_usa</TableHead>
                        <TableHead className="text-center max-w-[90px]">Tel_cel_usa</TableHead>
                        <TableHead className="text-center max-w-[90px]">Tel_ofi_usa</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resultados.map((saldo) => (
                        <>
                            <TableRow key={`${saldo.id_contrato}-${saldo.nomenclatura}`} className="text-xs">
                                <TableCell className="text-xs text-center">
                                    {saldo.nomenclatura}-{saldo.no_manzana}-{saldo.no_terreno}
                                </TableCell>
                                <TableCell className="text-left">{saldo.nombre_cliente}</TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldo.monto_terreno_inicial))}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldo.precioinventario))}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "currency",
                                        currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldo.pagado))}
                                </TableCell>
                                <TableCell className="text-left">{saldo.ultimo_pago}</TableCell>
                                <TableCell className="text-left">{saldo.fecha_contrato}</TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat("es-MX", {
                                        style: "decimal",
                                        // currency: "MXN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(saldo.superficie))}
                                </TableCell>
                                <TableCell className="text-center">{saldo.casa_mx}</TableCell>
                                <TableCell className="text-center">{saldo.cel_mx}</TableCell>
                                <TableCell className="text-center">{saldo.trabajo_mx}</TableCell>
                                <TableCell className="text-center max-w-[50px]">{saldo.tel_usa_casa}</TableCell>
                                <TableCell className="text-center max-w-[50px]">{saldo.tel_usa_cel}</TableCell>
                                <TableCell className="text-center max-w-[50px]">{saldo.tel_usa_oficina}</TableCell>
                            </TableRow>
                        </>
                    ))}
                    <TableRow style={{ backgroundColor: "#fcf5e5", color: "#b31c45" }}>
                        <TableCell colSpan={3} className="font-semibold text-center">
                            Total: {resultados.length}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
}
