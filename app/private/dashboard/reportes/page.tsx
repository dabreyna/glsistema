import Image from "next/image";
import Link from "next/link";
import {
    ArrowRightLeft,
    ArrowUpWideNarrow,
    BookUser,
    BookOpenText,
    ChartArea,
    ChartBarDecreasing,
    ChartNoAxesCombined,
    ChartPie,
    ChartScatter,
    ClipboardCheck,
    FileClock,
    FileDigit,
    FileOutput,
    HandCoins,
    History,
    LandPlot,
    MessageSquareText,
    NotebookPen,
    PanelsTopLeft,
    PhoneForwarded,
    ReceiptText,
    Scale,
    TriangleAlert,
    Trophy,
    UserCheck,
    Wallet,
    BookOpenCheck,
    Percent,
    ThumbsDown,
} from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default async function ReportesPage({ params }: { params: { clienteId: string } }) {
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }

    return (
        <>
            <br />
            <div className="mx-auto grid  flex-1 auto-rows-max gap-4  w-fit">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-1 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle>REPORTES</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="ventas" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="ventas">VENTAS</TabsTrigger>
                                        <TabsTrigger value="cobranza">COBRANZA</TabsTrigger>
                                        <TabsTrigger value="atencionCliente">ATENCION AL CLIENTE</TabsTrigger>
                                        <TabsTrigger value="administracion">ADMINISTRACION</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="ventas">
                                        <div>
                                            <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <Link href="/private/dashboard/reportes/terrenosDisponibles">
                                                        <RadioGroupItem
                                                            value="terrenos_disponibles"
                                                            id="terrenos_disponibles"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="terrenos_disponibles"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-rose-100 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <LandPlot className="mb-3 h-10 w-10" />
                                                            Terrenos disponibles
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/mercadotecnia">
                                                        <RadioGroupItem value="mercadotecnia" id="mercadotecnia" className="peer sr-only" />
                                                        <Label
                                                            htmlFor="mercadotecnia"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ChartScatter className="mb-3 h-10 w-10" />
                                                            Mercadotecnia
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/detalladoVentas">
                                                        <RadioGroupItem
                                                            value="detallado_ventas"
                                                            id="detallado_ventas"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="detallado_ventas"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ChartNoAxesCombined className="mb-3 h-10 w-10" />
                                                            Detallado de ventas
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/comisiones">
                                                        <RadioGroupItem value="comisiones" id="comisiones" className="peer sr-only" />
                                                        <Label
                                                            htmlFor="comisiones"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <Trophy className="mb-3 h-10 w-10" />
                                                            Comisiones
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/comentariosVentas">
                                                        <RadioGroupItem
                                                            value="comentarios_ventas"
                                                            id="comentarios_ventas"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="comentarios_ventas"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <MessageSquareText className="mb-3 h-10 w-10" />
                                                            Comentarios de ventas
                                                        </Label>
                                                    </Link>
                                                </div>
                                                {/* <div>
                                                    <Link href="/private/dashboard/reportes/catalogoClientes">
                                                        <RadioGroupItem
                                                            value="catalogo_clientes"
                                                            id="catalogo_clientes"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="catalogo_clientes"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <BookUser className="mb-3 h-10 w-10" />
                                                            Catalogo de clientes
                                                        </Label>
                                                    </Link>
                                                </div> */}
                                                <div>
                                                    <Link href="/private/dashboard/reportes/ventasMaduradas">
                                                        <RadioGroupItem
                                                            value="ventas_maduradas"
                                                            id="ventas_maduradas"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="ventas_maduradas"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <UserCheck className="mb-3 h-10 w-10" />
                                                            Ventas Maduradas
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/inventarioOcupacion">
                                                        <RadioGroupItem
                                                            value="inventario_ocupacion"
                                                            id="inventario_ocupacion"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="inventario_ocupacion"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ChartPie className="mb-3 h-10 w-10" />
                                                            Inventario vs. Ocupación
                                                        </Label>
                                                    </Link>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="cobranza">
                                        <div>
                                            <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <Link href="/private/dashboard/reportes/estadoDeCuenta">
                                                        <RadioGroupItem
                                                            value="estado_de_cuenta"
                                                            id="estado_de_cuenta"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="estado_de_cuenta"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <FileDigit className="mb-3 h-10 w-10" />
                                                            Estado de cuenta
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/detalladoDePagos">
                                                        <RadioGroupItem
                                                            value="detallado_de_pagos"
                                                            id="detallado_de_pagos"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="detallado_de_pagos"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ReceiptText className="mb-3 h-10 w-10" />
                                                            Detallado de pagos
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/cancelados">
                                                        <RadioGroupItem value="cancelados" id="cancelados" className="peer sr-only" />
                                                        <Label
                                                            htmlFor="cancelados"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <FileOutput className="mb-3 h-10 w-10" />
                                                            Cancelados
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/bitacoraDeLlamadas">
                                                        <RadioGroupItem
                                                            value="bitacora_de_llamadas"
                                                            id="bitacora_de_llamadas"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="bitacora_de_llamadas"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <PhoneForwarded className="mb-3 h-10 w-10" />
                                                            Bitacora de llamadas
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/reporteCobranza">
                                                        <RadioGroupItem
                                                            value="reporte_cobranza"
                                                            id="reporte_cobranza"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="reporte_cobranza"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <HandCoins className="mb-3 h-10 w-10" />
                                                            Reporte de cobranza
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/asignacionCarga">
                                                        <RadioGroupItem
                                                            value="asignacion_carga"
                                                            id="asignacion_carga"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="asignacion_carga"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <Scale className="mb-3 h-10 w-10" />
                                                            Asignacion de carga
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/comentariosCobranza">
                                                        <RadioGroupItem
                                                            value="comentarios_cobranza"
                                                            id="comentarios_cobranza"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="comentarios"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <MessageSquareText className="mb-3 h-10 w-10" />
                                                            Comentarios
                                                        </Label>
                                                    </Link>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="atencionCliente">
                                        <div>
                                            <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <Link href="/private/dashboard/reportes/catalogoClientes">
                                                        <RadioGroupItem
                                                            value="catalogo_clientes"
                                                            id="catalogo_clientes"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="catalogo_clientes"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <BookUser className="mb-3 h-10 w-10" />
                                                            Catalogo de clientes
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/historicoTraspasos">
                                                        <RadioGroupItem
                                                            value="historico_traspasos"
                                                            id="historico_traspasos"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="traspasos"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ArrowRightLeft className="mb-3 h-10 w-10" />
                                                            Traspasos
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/contratosPagados">
                                                        <RadioGroupItem
                                                            value="contratos_pagados"
                                                            id="contratos_pagados"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="contratos_pagados"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ClipboardCheck className="mb-3 h-10 w-10" />
                                                            Contratos pagados
                                                        </Label>
                                                    </Link>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="administracion">
                                        <div>
                                            <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-6">
                                                <div>
                                                    <Link href="/private/dashboard/reportes/generalInventarios">
                                                        <RadioGroupItem
                                                            value="general_inventarios"
                                                            id="general_inventarios"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="general_inventarios"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <NotebookPen className="mb-3 h-10 w-10" />
                                                            General Inventarios
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/ajusteAnual">
                                                        <RadioGroupItem value="ajuste_anual" id="ajuste_anual" className="peer sr-only" />
                                                        <Label
                                                            htmlFor="ajuste_anual"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ArrowUpWideNarrow className="mb-3 h-10 w-10" />
                                                            Ajuste Anual
                                                        </Label>
                                                    </Link>
                                                </div>
                                                {/* <div>
                                                    <Link href="/private/dashboard/reportes/historicoTraspasos">
                                                        <RadioGroupItem
                                                            value="historico_traspasos"
                                                            id="historico_traspasos"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="traspasos"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ArrowRightLeft className="mb-3 h-10 w-10" />
                                                            Traspasos
                                                        </Label>
                                                    </Link>
                                                </div> */}
                                                <div>
                                                    <Link href="/private/dashboard/reportes/saldosVencidos">
                                                        <RadioGroupItem
                                                            value="saldos_vencidos"
                                                            id="saldos_vencidos"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="saldos_vencidos"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <TriangleAlert className="mb-3 h-10 w-10" />
                                                            Saldos Vencidos
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/recuperacionDeCartera">
                                                        <RadioGroupItem
                                                            value="recuperacion_de_cartera"
                                                            id="recuperacion_de_cartera"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="recuperacion_de_cartera"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <Wallet className="mb-3 h-10 w-10" />
                                                            Recuperacion de cartera
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/historicoTerrenos">
                                                        <RadioGroupItem
                                                            value="historico_terrenos"
                                                            id="historico_terrenos"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="historico_terrenos"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <FileClock className="mb-3 h-10 w-10" />
                                                            Historico de terrenos
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/devolucionProgramada">
                                                        <RadioGroupItem
                                                            value="devolucion_programada"
                                                            id="devolucion_programada"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="devolucion_programada"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <History className="mb-3 h-10 w-10" />
                                                            Devolucion Programada
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/descuentosAplicados">
                                                        <RadioGroupItem
                                                            value="descuentos_aplicados"
                                                            id="descuentos_aplicados"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="descuentos_aplicados"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <Percent className="mb-3 h-10 w-10" />
                                                            Descuentos aplicados
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/saldosCuentasPorCobrar">
                                                        <RadioGroupItem
                                                            value="saldos_cuentas_por_cobrar"
                                                            id="saldos_cuentas_por_cobrar"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="saldos_cuentas_por_cobrar"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ChartBarDecreasing className="mb-3 h-10 w-10" />
                                                            Saldos de cuentas por cobrar
                                                        </Label>
                                                    </Link>
                                                </div>
                                                {/* <div>
                                                    <Link href="/private/dashboard/reportes/contratosPagados">
                                                        <RadioGroupItem
                                                            value="contratos_pagados"
                                                            id="contratos_pagados"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="contratos_pagados"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ClipboardCheck className="mb-3 h-10 w-10" />
                                                            Contratos pagados
                                                        </Label>
                                                    </Link>
                                                </div> */}
                                                <div>
                                                    <Link href="/private/dashboard/reportes/carteraVencida">
                                                        <RadioGroupItem
                                                            value="cartera_vencida"
                                                            id="cartera_vencida"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="cartera_vencida"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ThumbsDown className="mb-3 h-10 w-10" />
                                                            Cartera vencida
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/estadisticos">
                                                        <RadioGroupItem value="estadisticos" id="estadisticos" className="peer sr-only" />
                                                        <Label
                                                            htmlFor="estadisticos"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <ChartArea className="mb-3 h-10 w-10" />
                                                            Estadisticos
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/estadisticoDetalle">
                                                        <RadioGroupItem
                                                            value="estadistico_detalle"
                                                            id="estadistico_detalle"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="estadistico_detalle"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <PanelsTopLeft className="mb-3 h-10 w-10" />
                                                            Estadistico detalle
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/corteCajaDetalle">
                                                        <RadioGroupItem
                                                            value="corte_caja_detalle"
                                                            id="corte_caja_detalle"
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="corte_caja_detalle"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <BookOpenText className="mb-3 h-10 w-10" />
                                                            Corte caja detalle
                                                        </Label>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="/private/dashboard/reportes/corteCaja">
                                                        <RadioGroupItem value="corte_caja" id="corte_caja" className="peer sr-only" />
                                                        <Label
                                                            htmlFor="corte_caja"
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <BookOpenCheck className="mb-3 h-10 w-10" />
                                                            Corte caja
                                                        </Label>
                                                    </Link>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                            <CardFooter className="justify-center border-t p-4"></CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
