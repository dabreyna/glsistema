import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getTiposEstadoCivil,
    getTiposMediosPublicitarios,
    getFraccionamientos,
    getFinanciamientos,
    getTipoVenta,
    getTipoCambio,
} from "@/lib/ventas/prospecto";

// import Beneficiarios from "@/components/client/dashboard/ventas/beneficiario";
// import Referencias from "@/components/client/dashboard/ventas/referencia";
import Prospecto from "@/components/client/dashboard/ventas/prospecto";
import ProspectoInicial from "@/components/client/dashboard/ventas/prospectoInicial";
import TerrenoProspecto from "@/components/client/dashboard/ventas/terreno";
// import Copropietarios from "@/components/client/dashboard/ventas/copropietario";

export default async function DetallesContratos({ params }: { params: { idCliente: string } }) {
    // console.log("IDCLIENTE: " + params.idCliente);
    // console.log("IDCONTRATO: " + params.idContrato);

    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }
    const listaEstadosCivil = await getTiposEstadoCivil();
    const listaMediosPublicitarios = await getTiposMediosPublicitarios();
    const listaFraccionamientos = await getFraccionamientos();
    const listaFinanciamientos = await getFinanciamientos();
    const listaTipoVenta = await getTipoVenta();
    const editarNumeroPagos = session.user.perfil_usuario?.toString() === "1" ? true : false;
    const tipoCambio = await getTipoCambio();
    const idUsuario = session.user.id_usuario?.toString() != undefined ? session.user.id_usuario.toString() : "";
    const perfilUsuario = session.user.perfil_usuario?.toString() != undefined ? session.user.perfil_usuario.toString() : "";

    return (
        <>
            <div className="mx-auto grid  flex-1 auto-rows-max gap-4 w-full">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-1 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-1">
                            <CardHeader></CardHeader>
                            <CardContent>
                                <Tabs defaultValue="Prospecto" className="w-full">
                                    <TabsList className="grid w-full grid-cols-6">
                                        <TabsTrigger value="Prospecto">Paso #1</TabsTrigger>
                                        <TabsTrigger value="Copropietarios" disabled className="visible hidden">
                                            Copropietarios
                                        </TabsTrigger>
                                        <TabsTrigger value="Beneficiarios" disabled className="visible hidden">
                                            Beneficiarios
                                        </TabsTrigger>
                                        <TabsTrigger value="Referencias" disabled className="visible hidden">
                                            Referencias
                                        </TabsTrigger>
                                        <TabsTrigger value="Requisitos" disabled className="visible hidden">
                                            Requisitos
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="Prospecto">
                                        {params.idCliente != "0" ? (
                                            <Prospecto
                                                idCliente={params.idCliente}
                                                listaEstadosCivil={listaEstadosCivil}
                                                listaMediosPublicitarios={listaMediosPublicitarios}
                                                idUsuario={idUsuario}
                                            />
                                        ) : (
                                            <ProspectoInicial
                                                idCliente={params.idCliente}
                                                listaEstadosCivil={listaEstadosCivil}
                                                listaMediosPublicitarios={listaMediosPublicitarios}
                                                idUsuario={idUsuario}
                                            />
                                        )}
                                        {/* <Prospecto
                                            idCliente={params.idCliente}
                                            listaEstadosCivil={listaEstadosCivil}
                                            listaMediosPublicitarios={listaMediosPublicitarios}
                                            idUsuario={idUsuario}
                                        /> */}
                                        <TerrenoProspecto
                                            idCliente={params.idCliente}
                                            listaFraccionamientos={listaFraccionamientos}
                                            listaFinanciamientos={listaFinanciamientos}
                                            listaMediosPublicitarios={listaMediosPublicitarios}
                                            listaTipoVenta={listaTipoVenta}
                                            editarNumeroPagos={editarNumeroPagos}
                                            tipoCambio={tipoCambio}
                                            idUsuario={idUsuario}
                                            perfilUsuario={perfilUsuario}
                                        />
                                    </TabsContent>
                                    <TabsContent value="Copropietarios"></TabsContent>
                                    <TabsContent value="Beneficiarios"></TabsContent>
                                    <TabsContent value="Referencias"></TabsContent>
                                    <TabsContent value="Requisitos"></TabsContent>
                                </Tabs>
                            </CardContent>
                            {/* <CardFooter className="justify-center border-t p-4"></CardFooter> */}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
