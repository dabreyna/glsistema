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
    UnfoldHorizontal,
} from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default async function CobranzaPage({ params }: { params: { clienteId: string } }) {
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
                                <CardTitle className="text-center">COBRANZA</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-6">
                                        <div>
                                            <Link href="/private/dashboard/cobranza/comentarios">
                                                <RadioGroupItem value="comentarios" id="comentarios" className="peer sr-only" />
                                                <Label
                                                    htmlFor="comentarios"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-rose-100 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <MessageSquareText className="mb-3 h-10 w-10" />
                                                    Comentarios
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/cobranza/callCenter">
                                                <RadioGroupItem value="callCenter" id="callCenter" className="peer sr-only" />
                                                <Label
                                                    htmlFor="callCenter"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <Headset className="mb-3 h-10 w-10" />
                                                    Call Center
                                                </Label>
                                            </Link>
                                        </div>
                                        {/* <div>
                          <Link href="/private/dashboard/cobranza/callCenterSC">
                          <RadioGroupItem value="callCenterSC" id="callCenterSC" className="peer sr-only"/>
                          <Label
                            htmlFor="callCenterSC"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                          <HeartHandshake className="mb-3 h-10 w-10" />
                          Call Center SC
                          </Label>
                          </Link>
                        </div> */}
                                        <div>
                                            <Link href="/private/dashboard/cobranza/agenda">
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
                                        <div>
                                            <Link href="/private/dashboard/cobranza/citatorios">
                                                <RadioGroupItem value="citatorios" id="citatorios" className="peer sr-only" />
                                                <Label
                                                    htmlFor="citatorios"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <CalendarArrowDown className="mb-3 h-10 w-10" />
                                                    Citatorios
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/cobranza/cartaDevolucion">
                                                <RadioGroupItem value="cartaDevolucion" id="cartaDevolucion" className="peer sr-only" />
                                                <Label
                                                    htmlFor="cartaDevolucion"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <PanelLeftClose className="mb-3 h-10 w-10" />
                                                    Carta Devolucion
                                                </Label>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/private/dashboard/cobranza/transferenciaClientes">
                                                <RadioGroupItem
                                                    value="transferenciaClientes"
                                                    id="transferenciaClientes"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="transferenciaClientes"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <UnfoldHorizontal className="mb-3 h-10 w-10" />
                                                    Transferencia de Clientes
                                                </Label>
                                            </Link>
                                        </div>
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
