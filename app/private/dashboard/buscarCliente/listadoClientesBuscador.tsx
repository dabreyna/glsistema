"use client";

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

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Link } from "lucide-react";
// import router from "next/router";
import { useRouter } from "next/navigation";

interface ListadoClientesProps {
    data: listadoClientes[] | any[];
}

export type Contrato = {
    terreno: string;
    id_contrato: number;
    estatus: number;
};

export type listadoClientes = {
    id_cliente: number;
    nombre_cliente: string;
    ap_paterno: string;
    contratos: Contrato[];
};

export default function ListadoClientesBuscador({ data }: ListadoClientesProps) {
    const router = useRouter();
    const handleDetallesContrato = (id_cliente: number) => {
        router.push(`/private/dashboard/detallesContrato/${id_cliente}`);
    };
    const handleCaja = (id_cliente: number) => {
        router.push(`/private/dashboard/caja/${id_cliente}`);
    };

    const handleComentariosVentas = (id_cliente: number) => {
        router.push(`/private/dashboard/reportes/comentariosVentas/${id_cliente}`);
    };

    const columns: ColumnDef<listadoClientes>[] = [
        {
            accessorKey: "id_cliente",
            // header: "# de cliente",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        # de cliente
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("id_cliente")}</div>,
        },
        {
            accessorKey: "nombre_cliente",
            // header: "Nombre",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Nombre
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("nombre_cliente")}</div>,
        },
        {
            accessorKey: "contratos",
            header: "Contratos",
            cell: ({ row }) => {
                const contratos = row.getValue("contratos") as Contrato[];
                return (
                    <div className="capitalize">
                        {contratos?.map((contrato) => (
                            <div key={contrato.id_contrato}>
                                {" "}
                                {/* Use id_contrato as a unique key */}
                                <span>{contrato.terreno}</span>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const cliente = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Opciones</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(cliente.id_cliente.toString())}>
                                Copiar # de Cliente
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(cliente.nombre_cliente)}>
                                Copiar Nombre de Cliente
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDetallesContrato(cliente.id_cliente)}>Ver Expediente</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleComentariosVentas(cliente.id_cliente)}>
                                Ver comentarios de ventas
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCaja(cliente.id_cliente)}>Ir a Caja</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filtrar por Nombre..."
                    value={(table.getColumn("nombre_cliente")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("nombre_cliente")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columnas <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Atras
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
