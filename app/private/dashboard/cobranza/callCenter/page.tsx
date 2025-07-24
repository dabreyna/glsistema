import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAsesoresActivos, getClasificaciones, getFraccionamientos, getVencimientos } from "@/lib/cobranza/callcenter/filtrosBusqueda";

import TablaDatos from "@/components/client/dashboard/cobranza/callCenter/tablaDatos";
import FiltrosConsulta from "@/components/client/dashboard/cobranza/callCenter/filtrosConsulta";
import TablaDatos2 from "@/components/client/dashboard/cobranza/callCenter/tablaDatos2";

export default async function CallCenterCobranza() {
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }

    const listaUsuarios = await getAsesoresActivos();
    const listaFraccionamientos = await getFraccionamientos();
    const listaClasificaciones = await getClasificaciones();
    const listaVencimientos = await getVencimientos();

    return (
        <>
            <div className="mx-auto grid  flex-1 auto-rows-max gap-4  w-full">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-1 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-contenedor-reporte">
                            <CardHeader>
                                <CardTitle className="text-center">CALL CENTER COBRANZA</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-6 sm:grid-cols-6">
                                    <Card className="col-span-12">
                                        <CardHeader></CardHeader>
                                        <CardContent>
                                            <>
                                                <FiltrosConsulta
                                                    listaUsuarios={listaUsuarios}
                                                    listaFraccionamientos={listaFraccionamientos}
                                                    listaClasificaciones={listaClasificaciones}
                                                    listaVencimientos={listaVencimientos}
                                                />
                                                <TablaDatos2
                                                    idUsuario={session.user.id_usuario}
                                                    perfilUsuario={session.user.perfil_usuario}
                                                    listaClasificaciones={listaClasificaciones}
                                                />
                                            </>
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
