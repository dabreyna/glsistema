import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTiposEstadoCivil, getTiposMediosPublicitarios, getIDTerreno } from "@/lib/ventas/prospecto";

import Beneficiarios from "@/components/client/dashboard/ventas/beneficiario";
import Referencias from "@/components/client/dashboard/ventas/referencias";
import Prospecto from "@/components/client/dashboard/ventas/prospecto";
import Copropietarios from "@/components/client/dashboard/ventas/copropietario";
import Requisitos from "@/components/client/dashboard/ventas/requisitos";

export default async function DetallesContratos({ params }: { params: { idCliente: string; idContrato: string } }) {
    // console.log("IDCLIENTE: " + params.idCliente);
    // console.log("IDCONTRATO: " + params.idContrato);

    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }
    const listaEstadosCivil = await getTiposEstadoCivil();
    const listaMediosPublicitarios = await getTiposMediosPublicitarios();
    // const listaFraccionamientos = await getFraccionamientos();
    // const listaFinanciamientos = await getFinanciamientos();
    // const listaTipoVenta = await getTipoVenta();
    // const editarNumeroPagos = session.user.perfil_usuario?.toString() === "1" ? true : false;
    // const tipoCambio = await getTipoCambio();
    const idUsuario = session.user.id_usuario?.toString() != undefined ? session.user.id_usuario.toString() : "";
    const idTerreno = await getIDTerreno(params.idContrato);
    console.log(idTerreno);

    function crearCorridaPagos() {
        console.log("IDCLIENTE: " + params.idCliente);
        console.log("IDCONTRATO: " + params.idContrato);
    }
    return (
        <>
            <div className="mx-auto grid  flex-1 auto-rows-max gap-4 w-full">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-1 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-1">
                            <CardHeader></CardHeader>
                            <CardContent>
                                <Tabs defaultValue="Copropietarios" className="w-full">
                                    <TabsList className="grid w-full grid-cols-6">
                                        <TabsTrigger value="Prospecto">Propietario</TabsTrigger>
                                        <TabsTrigger value="Copropietarios">Copropietarios</TabsTrigger>
                                        <TabsTrigger value="Beneficiarios">Beneficiarios</TabsTrigger>
                                        <TabsTrigger value="Referencias">Referencias</TabsTrigger>
                                        <TabsTrigger value="Requisitos">Requisitos</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="Prospecto">
                                        <Prospecto
                                            idCliente={params.idCliente}
                                            listaEstadosCivil={listaEstadosCivil}
                                            listaMediosPublicitarios={listaMediosPublicitarios}
                                            idUsuario={idUsuario}
                                        />
                                    </TabsContent>
                                    <TabsContent value="Copropietarios">
                                        <Copropietarios
                                            idContrato={params.idContrato}
                                            listaEstadosCivil={listaEstadosCivil}
                                            // listaMediosPublicitarios={listaMediosPublicitarios}
                                            idUsuario={idUsuario}
                                            idTerreno={idTerreno}
                                        />
                                    </TabsContent>
                                    <TabsContent value="Beneficiarios">
                                        <Beneficiarios
                                            idContrato={params.idContrato}
                                            listaEstadosCivil={listaEstadosCivil}
                                            // listaMediosPublicitarios={listaMediosPublicitarios}
                                            idUsuario={idUsuario}
                                            idTerreno={idTerreno}
                                        />
                                    </TabsContent>
                                    <TabsContent value="Referencias">
                                        <Referencias idContrato={params.idContrato} idUsuario={idUsuario} idTerreno={idTerreno} />
                                    </TabsContent>
                                    <TabsContent value="Requisitos">
                                        <Requisitos
                                            idContrato={params.idContrato}
                                            idUsuario={idUsuario}
                                            idTerreno={idTerreno}
                                            idCliente={params.idCliente}
                                        />
                                        {/* <Card>
                                            <CardHeader>
                                                <CardTitle></CardTitle>
                                                <CardDescription></CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <Table>
                                                    <TableCaption></TableCaption>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="">Requisito|</TableHead>
                                                            <TableHead>Carga de documentos</TableHead>
                                                            <TableHead>Archivo</TableHead>
                                                            <TableHead className="text-right"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="font-medium">Identificación Oficial</TableCell>
                                                            <TableCell>
                                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                                    <Label htmlFor="picture">Documento</Label>
                                                                    <Input id="picture" type="file" />
                                                                    <Button variant="outline">Guardar</Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>35690_2023-01-01.pdf</TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">Comprobante de Domicilio</TableCell>
                                                            <TableCell>
                                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                                    <Label htmlFor="picture">Documento</Label>
                                                                    <Input id="picture" type="file" />
                                                                    <Button variant="outline">Guardar</Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>35690_2023-01-01.pdf</TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">Croquis de ubicacion</TableCell>
                                                            <TableCell>
                                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                                    <Label htmlFor="picture">Documento</Label>
                                                                    <Input id="picture" type="file" />
                                                                    <Button variant="outline">Guardar</Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>35690_2023-01-01.pdf</TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                            <CardFooter>
                                                <BtnTerminarVenta idCliente={params.idCliente} idContrato={params.idContrato} />
                                            </CardFooter>
                                        </Card> */}
                                    </TabsContent>
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
