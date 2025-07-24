import Image from "next/image";
import Link from "next/link";
import {
    ArrowRightLeft,
    ArrowUpWideNarrow,
    Trophy,
    BookOpenCheck,
    Users,
    Building2,
    Grid2x2,
    FileSpreadsheet,
    BookA,
    RefreshCcwDot,
    SlidersHorizontal,
    BookLock,
    UserRoundPlus,
    UserSearch,
    CalendarClock,
    CalendarCheck,
    MessageSquareText,
    Headset,
    HeartHandshake,
    CalendarArrowDown,
    PanelLeftClose,
    Repeat,
    TriangleAlert,
    BookCheck,
    BookX,
} from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default async function AtencionClientePage({ params }: { params: { clienteId: string } }) {
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
                                <CardTitle className="text-center">ATENCION AL CLIENTE</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-6">
                                        <div>
                                            <Link href="/private/dashboard/atencionCliente/seguimientoSolicitudes">
                                                <RadioGroupItem
                                                    value="seguimientoSolicitudes"
                                                    id="seguimientoSolicitudes"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="seguimientoSolicitudes"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-rose-100 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <MessageSquareText className="mb-3 h-10 w-10" />
                                                    Seguimiento Solicitudes
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/atencionCliente/concentradoServicios">
                                                <RadioGroupItem
                                                    value="concentradoServicios"
                                                    id="concentradoServicios"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="concentradoServicios"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <Headset className="mb-3 h-10 w-10" />
                                                    Concentrado de Servicios
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/atencionCliente/serviciosVencidos">
                                                <RadioGroupItem
                                                    value="servicios_vencidos"
                                                    id="servicios_vencidos"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="servicios_vencidos"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <TriangleAlert className="mb-3 h-10 w-10" />
                                                    Servicios Vencidos
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/atencionCliente/lecturasAgua">
                                                <RadioGroupItem value="lecturasAgua" id="lecturasAgua" className="peer sr-only" />
                                                <Label
                                                    htmlFor="lecturasAgua"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <CalendarClock className="mb-3 h-10 w-10" />
                                                    Lecturas de Agua
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/atencionCliente/listadoTomasAgua">
                                                <RadioGroupItem value="listadoTomasAgua" id="listadoTomasAgua" className="peer sr-only" />
                                                <Label
                                                    htmlFor="listadoTomasAgua"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <CalendarArrowDown className="mb-3 h-10 w-10" />
                                                    Listado de Tomas de Agua
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/atencionCliente/contratosEntregados">
                                                <RadioGroupItem
                                                    value="contratosEntregados"
                                                    id="contratosEntregados"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="contratosEntregados"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <BookCheck className="mb-3 h-10 w-10" />
                                                    Contratos Entregados
                                                </Label>
                                            </Link>
                                        </div>
                                        {/* <div>
                                            <Link href="/private/dashboard/atencionCliente/contratosNoEntregados">
                                                <RadioGroupItem
                                                    value="contratosNoEntregados"
                                                    id="contratosNoEntregados"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="contratosNoEntregados"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <BookX className="mb-3 h-10 w-10" />
                                                    Contratos No Entregados
                                                </Label>
                                            </Link>
                                        </div> */}
                                    </RadioGroup>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-center border-t p-4"></CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
