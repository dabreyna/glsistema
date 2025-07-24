import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFraccionamientos } from "@/lib/reportes/catalogoClientes/fraccionamientos";
import { getListadoServicios } from "@/lib/generales/servicios";

import FiltrosConsultaServiciosVencidos from "@/components/client/dashboard/atencionCliente/serviciosVencidos/filtrosConsulta";
import TablaDatos from "@/components/client/dashboard/atencionCliente/serviciosVencidos/tablaDatos";

// import TablaDatosDetallada from "@/components/client/dashboard/reportes/comisiones/tablaDatosDetallada";

export default async function ServiciosVencidos() {
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }

    const listaFraccionamientos = await getFraccionamientos();
    const listaServicios = await getListadoServicios();

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
                                            <FiltrosConsultaServiciosVencidos
                                                listaFraccionamientos={listaFraccionamientos}
                                                listaServicios={listaServicios}
                                            />
                                            <TablaDatos />
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
