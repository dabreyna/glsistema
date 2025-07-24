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
} from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default async function VentasPage({ params }: { params: { clienteId: string } }) {
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }

    //console.log(session);

    return (
        <>
            <br />
            <div className="mx-auto grid  flex-1 auto-rows-max gap-4  w-fit">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-1 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle className="text-center">VENTAS</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-6">
                                        <div>
                                            <Link href="/private/dashboard/ventas/alta/0">
                                                <RadioGroupItem value="altaProspecto" id="altaProspecto" className="peer sr-only" />
                                                <Label
                                                    htmlFor="altaProspecto"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-rose-100 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <UserRoundPlus className="mb-3 h-10 w-10" />
                                                    Nuevo Prospecto
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/ventas/seguimiento">
                                                <RadioGroupItem
                                                    value="seguimientoProspectos"
                                                    id="seguimientoProspectos"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="seguimientoProspectos"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <UserSearch className="mb-3 h-10 w-10" />
                                                    Seguimiento de Prospectos
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/ventas/agenda">
                                                <RadioGroupItem value="agenda" id="agenda" className="peer sr-only" />
                                                <Label
                                                    htmlFor="agenda"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <CalendarClock className="mb-3 h-10 w-10" />
                                                    Agenda
                                                </Label>
                                            </Link>
                                        </div>
                                        {/* <div>
                                            <Link href="/private/dashboard/ventas/bitacora">
                                                <RadioGroupItem value="bitacora" id="bitacora" className="peer sr-only" />
                                                <Label
                                                    htmlFor="bitacora"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <CalendarCheck className="mb-3 h-10 w-10" />
                                                    Bitacora
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
