"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useCallCenterFiltrosConsultaStore } from "@/app/store/dashboard/cobranza/callCenter/filtrosConsultaStore";
// import { useEffect, useState } from "react";
import { FileDown, Square, SquareCheck, SquareX } from "lucide-react";
import { Button } from "@/components/ui/button";

import { AltaAgenda } from "@/components/client/dashboard/cobranza/callCenter/altaAgenda";
import { HistorialAgenda } from "@/components/client/dashboard/cobranza/callCenter/historialAgenda";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Link } from "lucide-react";
import * as React from "react";
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { clientes } from "@prisma/client";

interface Clasificacion {
    id_clasificacion: string;
    clasificacion: string;
}

interface TablaDatosProps {
    idUsuario?: string;
    perfilUsuario?: string;
    listaClasificaciones: Clasificacion[];
}
export type Cliente = {
    id_contrato: string;
    terreno: string;
    nombre: string;
    id_cliente: string;
    dia_vencimiento: string;
    mensualidades_vencidas: string;
    monto_vencido: string;
    nombre_asesor: string;
    tipo_vencimiento: string;
    compromiso_pago: string;
    fecha_compromiso: string;
    clasificacion: string;
    semaforo: string;
    cliente_nuevo: string;
};
function getSemaforoComponent(semaforo: string) {
    // console.log(semaforo);
    switch (semaforo) {
        case "ROJO":
            return <Square className="bg-red-500 text-red-500 rounded ml-6" />;
        case "AMARILLO":
            return <Square className="bg-amber-500 text-amber-500 rounded ml-6" />;
        case "VERDE":
            return <Square className="bg-green-500 text-green-500 rounded ml-6" />;
        case "VERDE_PALOMA":
            return <SquareCheck className="bg-green-500 text-white rounded ml-6" />;
        default:
            return null; // Or a default component if needed
    }
}

export default function TablaDatos2({ idUsuario, perfilUsuario, listaClasificaciones }: TablaDatosProps) {
    const clientes = useCallCenterFiltrosConsultaStore((state) => state.resultados) as Cliente[];

    const columns: ColumnDef<Cliente>[] = [
        {
            accessorKey: "semaforo",
            header: () => null,
            cell: ({ row }) => getSemaforoComponent(row.getValue("semaforo")),
        },
        {
            accessorKey: "id_cliente",
            // header: "# de cliente",
            header: ({ column }) => {
                return <># de cliente</>;
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("id_cliente")}</div>,
        },
        {
            accessorKey: "terreno",
            // header: "Terreno con nomenclatura",
            header: ({ column }) => {
                return <>Terreno</>;
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("terreno")}</div>,
        },
        {
            accessorKey: "nombre",
            // header: "Nombre",
            header: ({ column }) => {
                return <>Cliente</>;
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("nombre")}</div>,
        },
        {
            accessorKey: "dia_vencimiento",
            // header: "Nombre",
            header: ({ column }) => {
                return <>Día Vencimiento</>;
            },
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("dia_vencimiento")}</div>,
        },
        {
            accessorKey: "mensualidades_vencidas",
            // header: "Nombre",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Meses Vencidos
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("mensualidades_vencidas")}</div>,
        },
        {
            accessorKey: "monto_vencido",
            // header: "Monto Vencido",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Monto Vencido
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    {/* {row.getValue("monto_vencido")} */}
                    {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(Number(row.getValue("monto_vencido")))}
                </div>
            ),
        },
        {
            accessorKey: "tipo_vencimiento",
            // header: "Nombre",
            header: ({ column }) => {
                return <>Tipo Vencimiento</>;
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("tipo_vencimiento")}</div>,
        },
        {
            accessorKey: "clasificacion",
            // header: "Nombre",
            header: ({ column }) => {
                return <>Clasificación</>;
            },
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("clasificacion")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const cliente = row.original;
                return (
                    <>
                        <AltaAgenda
                            idCliente={cliente.id_cliente}
                            listaClasificacion={listaClasificaciones}
                            idContrato={cliente.id_contrato}
                            idUsuario={idUsuario}
                            perfilUsuario={perfilUsuario}
                            clienteNombre={cliente.nombre}
                        />
                        <HistorialAgenda id={cliente.id_contrato} />
                    </>
                    // <DropdownMenu>
                    //     <DropdownMenuTrigger asChild>
                    //         <Button variant="ghost" className="h-8 w-8 p-0">
                    //             <span className="sr-only">Opciones</span>
                    //             <DotsHorizontalIcon className="h-4 w-4" />
                    //         </Button>
                    //     </DropdownMenuTrigger>
                    //     <DropdownMenuContent align="end">
                    //         <DropdownMenuLabel>ACCIONES</DropdownMenuLabel>
                    //         <DropdownMenuSeparator />
                    //         <DropdownMenuItem>
                    //             {
                    //                 <AltaAgenda
                    //                     idCliente={cliente.id_cliente}
                    //                     listaClasificacion={listaClasificaciones}
                    //                     idContrato={cliente.id_contrato}
                    //                     idUsuario={idUsuario}
                    //                     perfilUsuario={perfilUsuario}
                    //                     clienteNombre={cliente.nombre}
                    //                 />
                    //             }
                    //         </DropdownMenuItem>
                    //         <DropdownMenuItem onClick={() => {}}>Agendar Compromiso</DropdownMenuItem>
                    //     </DropdownMenuContent>
                    // </DropdownMenu>
                );
            },
        },
    ];
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable<Cliente>({
        data: clientes,
        columns,
        onSortingChange: setSorting,
        // onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        // onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });
    let consecutivo = 0;
    return (
        <div className="w-full">
            <br />
            <div className="rounded-md border">
                <Table className="w-full caption-bottom text-sm">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="h-10 px-2 text-center align-middle font-medium text-muted-foreground "
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-1 align-middle">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {/* {table.getFilteredSelectedRowModel().rows.length} of{" "} */}
                    {table.getFilteredRowModel().rows.length} Cliente(s) encontrado(s).
                </div>
                {/* <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Atras
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Siguiente
                    </Button>
                </div> */}
            </div>
        </div>
    );
}
