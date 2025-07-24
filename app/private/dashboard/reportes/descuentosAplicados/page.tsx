import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUsuarios } from "@/lib/reportes/reporteCobranza/filtrosBusqueda";
import { getFraccionamientos } from "@/lib/reportes/catalogoClientes/fraccionamientos";

// import TablaDatos from "@/components/client/dashboard/reportes/detalladoDePagos/tablaDatos";
import TablaDatos from "@/components/client/dashboard/reportes/descuentosAplicados/tablaDatos";

// import TablaDatosDetallada from "@/components/client/dashboard/reportes/comisiones/tablaDatosDetallada";
import FiltrosConsultaReporteCobranza from "@/components/client/dashboard/reportes/descuentosAplicados/filtrosConsulta";

export default async function ReporteCobranza() {
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }

    const listaFraccionamientos = await getFraccionamientos();
    const listaUsuarios = await getUsuarios();

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
                                            <FiltrosConsultaReporteCobranza
                                                listaFraccionamientos={listaFraccionamientos}
                                                listaUsuarios={listaUsuarios}
                                            />
                                            <TablaDatos />
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
