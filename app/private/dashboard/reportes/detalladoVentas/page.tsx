import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getEmpresas } from "@/lib/reportes/reporteCobranza/filtrosBusqueda";
import { getAsesoresActivos, getEstatusContrato, getAsesoresInactivos } from "@/lib/reportes/detalladoVentas/filtrosBusqueda";
import TablaDatosDetallada from "@/components/client/dashboard/reportes/detalladoVentas/tablaDatosDetallada";
import TablaDatosResumen from "@/components/client/dashboard/reportes/detalladoVentas/tablaDatosResumen";

import FiltrosConsultaDetalladoVentas from "@/components/client/dashboard/reportes/detalladoVentas/filtrosConsulta";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ReporteDetalladoVentas() {
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }

    const listaEmpresas = await getEmpresas();
    const listaAsesoresActivos = await getAsesoresActivos();
    const listaAsesoresInactivos = await getAsesoresInactivos();
    const listaEstatusContrato = await getEstatusContrato();

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
                                            <FiltrosConsultaDetalladoVentas
                                                listaEmpresas={listaEmpresas}
                                                listaAsesoresActivos={listaAsesoresActivos}
                                                listaAsesoresInactivos={listaAsesoresInactivos}
                                                listaEstatusContrato={listaEstatusContrato}
                                                id_usuario={session.user.id_usuario}
                                                perfil_usuario={session.user.perfil_usuario}
                                            />
                                            <Tabs defaultValue="resumen" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="resumen">RESUMEN</TabsTrigger>
                                                    <TabsTrigger value="detallado">DETALLADO</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="resumen">
                                                    <div>
                                                        <TablaDatosResumen />
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="detallado">
                                                    <TablaDatosDetallada />
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
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
