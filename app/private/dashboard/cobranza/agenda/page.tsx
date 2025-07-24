import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getClasificacion } from "@/lib/cobranza/agenda/tiposClasificacion";
import FiltrosConsulta from "@/components/client/dashboard/cobranza/agenda/filtrosConsulta";
import TablaCitas from "@/components/client/dashboard/cobranza/agenda/tablaCitas";
import TablaCompromisos from "@/components/client/dashboard/cobranza/agenda/tablaCompromisos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import moment from "moment";
// import "moment/locale/es";
// import { format } from "date-fns";
// import { now } from "lodash";

export default async function AgendaCobranza() {
    const listaClasificacion = await getClasificacion();
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }
    // const fecha = "2022-02-23";
    // const fechaTitutloAgenda = moment(fecha).format("dddd, DD [de] MMMM [de] YYYY");
    return (
        <>
            <div className="mx-auto grid  flex-1 auto-rows-max gap-4  w-full">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-1 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle className="text-center">AGENDA</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-12 sm:grid-cols-12">
                                    <Card className="col-span-3">
                                        <CardHeader></CardHeader>
                                        <CardContent className="items-center">
                                            <FiltrosConsulta
                                                id_usuario={session.user.id_usuario}
                                                perfil_usuario={session.user.perfil_usuario}
                                            />
                                        </CardContent>
                                    </Card>
                                    <Card className="col-span-9">
                                        <CardHeader></CardHeader>
                                        <CardContent>
                                            {/* TODO
                                                METER 2 TABS, EN EL PRIMERO EL LISTADO DE CITAS Y EN EL SEGUNDO EL LISTADO DE COMPROMISOS
                                                LA DE COMPROMISOS METERLA ENTRE LUNES Y MARTES.. 
                                            */}
                                            <Tabs defaultValue="ventas" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="citas">CITAS</TabsTrigger>
                                                    <TabsTrigger value="compromisos">COMPROMISOS DE PAGO</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="citas">
                                                    <TablaCitas
                                                        listaClasificacion={listaClasificacion}
                                                        idUsuario={session.user.id_usuario}
                                                        perfilUsuario={session.user.perfil_usuario}
                                                    />
                                                </TabsContent>
                                                <TabsContent value="compromisos">
                                                    <TablaCompromisos
                                                        listaClasificacion={listaClasificacion}
                                                        idUsuario={session.user.id_usuario}
                                                        perfilUsuario={session.user.perfil_usuario}
                                                    />
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
