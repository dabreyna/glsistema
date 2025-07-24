import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAsesores, getClasificacion } from "@/lib/ventas/seguimiento/filtrosBusqueda";
import TablaDatos from "@/components/client/dashboard/ventas/seguimiento/tablaDatos";
import FiltrosConsultaSeguimiento from "@/components/client/dashboard/ventas/seguimiento/filtrosConsulta";

export default async function SeguimientoProspectos() {
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }

    const listaAsesores = await getAsesores();
    const listaClasificacion = await getClasificacion();
    const idUsuario = session.user.id_usuario?.toString() != undefined ? session.user.id_usuario.toString() : "";
    const perfilUsuario = session.user.perfil_usuario?.toString() != undefined ? session.user.perfil_usuario.toString() : "";

    return (
        <>
            <div className="mx-auto grid  flex-1 auto-rows-max gap-4  w-full">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-1 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-contenedor-reporte">
                            <CardHeader>
                                <CardTitle className="text-center"></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-6 sm:grid-cols-6">
                                    <Card className="col-span-12">
                                        <CardHeader></CardHeader>
                                        <CardContent>
                                            <FiltrosConsultaSeguimiento
                                                listaAsesores={listaAsesores}
                                                listaClasificacion={listaClasificacion}
                                                idUsuario={idUsuario}
                                                perfilUsuario={perfilUsuario}
                                            />
                                            <TablaDatos
                                                listaClasificacion={listaClasificacion}
                                                idUsuario={session.user.id_usuario}
                                                perfilUsuario={session.user.perfil_usuario}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                            {/* <CardFooter className="justify-center border-t p-4"></CardFooter> */}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
