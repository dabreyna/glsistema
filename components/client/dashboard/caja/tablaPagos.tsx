"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TablaPagosProps {
    Tabla: { [key: string]: any }[];
}

export default function TablaPagos({ Tabla }: TablaPagosProps) {
    useEffect(() => {}, [Tabla]);
    return (
        <>
            {Tabla && Tabla.length > 0 ? (
                <>
                    <div className="container mx-auto px-4 py-3 bg-card text-card-foreground rounded-lg shadow-md border border-border">
                        <div className="grid gap-2">
                            <div className="space-y-1">
                                <Table id="tablaDatos" className="rounded-md border border-slate-200 shadow-sm max-w-[full]">
                                    <TableCaption> </TableCaption>
                                    <TableHeader className="border border-slate-200 bg-red-700 text-white">
                                        <TableRow>
                                            {Object.keys(Tabla[0]).map((key) => (
                                                <TableHead className="text-center w-[30px] text-white" key={key}>
                                                    {key}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <>
                                            {Tabla.map((row, rowIndex) => (
                                                <TableRow key={rowIndex}>
                                                    {Object.values(row).map((value, colIndex) => (
                                                        <TableCell className="text-center text-xs p-1" key={colIndex}>
                                                            {String(value)}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="container mx-auto px-4 py-3 bg-card text-card-foreground rounded-lg shadow-md border border-border">
                        <div className="grid gap-2">
                            <div className="space-y-1">
                                <p className="text-3xl font-semibold text-muted-foreground uppercase"></p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
