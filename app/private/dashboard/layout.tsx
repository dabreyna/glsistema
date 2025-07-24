import { TooltipProvider } from "@/components/ui/tooltip";
import { Asidebar } from "@/components/client/asidebar";
import { HeaderBar } from "@/components/client/headerbar";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { getVentasMes } from "@/lib/datosUsuario";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    // console.log(session);
    const nombreUsuario = session?.user.nombre || "Invitado";
    const perfilUsuario = session?.user.perfil_usuario?.toString() || "";
    const idUsuario = session?.user.id_usuario?.toString() || "";

    interface DatosUsuario {
        id_usuario: string;
        nombre: string;
        perfil_usuario: string;
        ventas_mes?: number;
        metas_mes?: number;
        tendencia?: number;
        puntosCobranza?: number;
    }

    return (
        <>
            <TooltipProvider>
                <div className="flex min-h-screen w-full flex-col bg-muted/40">
                    <Asidebar />
                    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                        <HeaderBar usr={nombreUsuario} perfilUsuario={perfilUsuario} idUsuario={idUsuario} />
                        {/* <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"> */}
                        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
                        <Toaster />
                    </div>
                </div>
            </TooltipProvider>
        </>
    );
}
