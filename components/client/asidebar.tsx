import Image from "next/image";
import Link from "next/link";
import logoLotificadora from "@/public/logos/android-chrome-512x512.png";
import { BadgeDollarSign, BookKey, Calculator, ClipboardList, FileSliders, HandCoins, Handshake, Home, Settings } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Asidebar() {
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        href="#"
                        className="group flex h-9 w-9  items-center justify-center rounded-full bg-transparent text-lg font-semibold  md:h-8 md:w-8 md:text-base"
                    >
                        <Image src={logoLotificadora} alt="Grupo Lotificadora" className="h-4 w-4 scale-150 transition-all" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/private/dashboard"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-amber-500 hover:text-foreground md:h-8 md:w-8"
                            >
                                <Home className="h-5 w-5" />
                                <span className="sr-only">Dashboard</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/private/dashboard/ventas"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-amber-500 hover:text-foreground md:h-8 md:w-8"
                            >
                                <BadgeDollarSign className="h-5 w-5" />

                                <span className="sr-only">Ventas</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Ventas</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/private/dashboard/cobranza"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-amber-500 hover:text-foreground md:h-8 md:w-8"
                            >
                                <HandCoins className="h-5 w-5" />
                                <span className="sr-only">Cobranza</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Cobranza</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/private/dashboard/atencionCliente"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-amber-500 hover:text-foreground md:h-8 md:w-8"
                            >
                                <Handshake className="h-5 w-5" />
                                <span className="sr-only">Atencion al Cliente</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Atencion al Cliente</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/private/dashboard/reportes"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-amber-500 hover:text-foreground md:h-8 md:w-8"
                            >
                                <ClipboardList className="h-5 w-5" />
                                <span className="sr-only">Reportes</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Reportes</TooltipContent>
                    </Tooltip>
                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/private/dashboard/administracion"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-amber-500 hover:text-foreground md:h-8 md:w-8"
                            >
                                <BookKey className="h-5 w-5" />
                                <span className="sr-only">Administracion</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Administracion</TooltipContent>
                    </Tooltip> */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/private/dashboard/contabilidad"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-amber-500 hover:text-foreground md:h-8 md:w-8"
                            >
                                <Calculator className="h-5 w-5" />
                                <span className="sr-only">Contabilidad</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Contabilidad</TooltipContent>
                    </Tooltip>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settingszzzzz</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settingszzzz</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
        </>
    );
}
