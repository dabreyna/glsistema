"use client";

import { logoutAction } from "@/app/actions/logout.action";
import Image from "next/image";
import Link from "next/link";
import { Home, LineChart, Package, Package2, PanelLeft, Search, ShoppingCart, Users2 } from "lucide-react";
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
interface HeaberBarProps {
    usr: string;
    perfilUsuario: string;
    idUsuario: string;
}
// import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BuscadorClientes } from "@/components/client/buscadorClientes";
import { ThemeSwitcher } from "../ui/ThemeSwitcher";
import moment from "moment";
import "moment/locale/es"; // Import Spanish locale

export function HeaderBar({ usr }: HeaberBarProps) {
    moment.locale("es");
    const handleLogout = async () => {
        await logoutAction();
        //router.push("/sistema"); // Redirect to the desired page after logout
    };

    return (
        <>
            <header className="fixed top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline" className="sm:hidden">
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                            >
                                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                <Home className="h-5 w-5" />
                                Dashboard
                            </Link>
                            <Link href="#" className="flex items-center gap-4 px-2.5 text-foreground">
                                <ShoppingCart className="h-5 w-5" />
                                Orders
                            </Link>
                            <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                <Package className="h-5 w-5" />
                                Products
                            </Link>
                            <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                <Users2 className="h-5 w-5" />
                                Customers
                            </Link>
                            <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                <LineChart className="h-5 w-5" />
                                Settingsxx
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <span className="uppercase underline text-center px-5"> {moment().format("dddd, DD [de] MMMM [de]  YYYY")}</span>
                <div className="relative ml-auto flex-1 md:grow-0">
                    <BuscadorClientes />
                </div>
                <ThemeSwitcher />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                            <Image
                                src={"/image/profilePictures/profile3.jpg"}
                                width={36}
                                height={36}
                                alt="Avatar"
                                className="overflow-hidden rounded-full"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <span>{usr}</span>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Soporte</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Salir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
        </>
    );
}
