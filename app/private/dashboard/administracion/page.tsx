import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightLeft,
  ArrowUpWideNarrow,
  Trophy,
  BookOpenCheck,
  Users,
  Building2,
  Grid2x2,
  FileSpreadsheet,
  BookA,
  RefreshCcwDot,
  SlidersHorizontal,
  BookLock,
} from "lucide-react";


import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default async function AdministracionPage({
  params,
}: {
  params: { clienteId: string };
}) {
  const session = await auth();
  if (!session) {
    redirect("/sistema");
  }


  return (
    <>
    <br />
      <div className="mx-auto grid  flex-1 auto-rows-max gap-4  w-fit">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-1 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
              <CardTitle className="text-center">ADMINISTRACI&Oacute;N</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                    <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-6"> 
                        <div>
                          <Link href="/private/dashboard/administracion/usuarios">
                            <RadioGroupItem value="usuarios" id="usuarios" className="peer sr-only"/>
                            <Label
                              htmlFor="usuarios"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-rose-100 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <Users className="mb-3 h-10 w-10"/>  
                              Usuarios
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/empresas">
                          <RadioGroupItem value="empresas" id="empresas" className="peer sr-only"/>
                          <Label
                            htmlFor="empresas"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                          <Building2 className="mb-3 h-10 w-10" />
                            Empresas
                          </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/fraccionamientos">
                            <RadioGroupItem
                              value="fraccionamientos"
                              id="fraccionamientos"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="fraccionamientos"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <Grid2x2 className="mb-3 h-10 w-10" />
                              Fraccionamientos
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/traspasos">
                            <RadioGroupItem
                              value="traspasos"
                              id="traspasos"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="traspasos"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <ArrowRightLeft className="mb-3 h-10 w-10" />
                              Traspasos
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/listaDePrecios">
                            <RadioGroupItem
                              value="lista_de_precios"
                              id="lista_de_precios"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="lista_de_precios"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <FileSpreadsheet className="mb-3 h-10 w-10" />
                              Lista de precios
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/catalogos">
                            <RadioGroupItem
                              value="catalogos"
                              id="catalogos"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="catalogos"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <BookA className="mb-3 h-10 w-10" />
                                Catalogos
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/politicasProcedimientos">
                            <RadioGroupItem
                              value="politicas_procedimientos"
                              id="politicas_procedimientos"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="politicas_procedimientos"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <BookOpenCheck className="mb-3 h-10 w-10" />
                              Politicas y procedimientos
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/rolMensual">
                            <RadioGroupItem
                              value="rol_mensual"
                              id="rol_mensual"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="rol_mensual"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <RefreshCcwDot className="mb-3 h-10 w-10" />
                              Rol mensual
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/parametros">
                            <RadioGroupItem
                              value="parametros"
                              id="parametros"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="parametros"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <SlidersHorizontal className="mb-3 h-10 w-10" />
                              Parametros
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/ajusteAnual">
                            <RadioGroupItem
                              value="ajuste_anual"
                              id="ajuste_anual"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="ajuste_anual"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <ArrowUpWideNarrow className="mb-3 h-10 w-10" />
                              Ajuste Anual
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/comisiones">
                            <RadioGroupItem
                              value="comisiones"
                              id="comisiones"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="comisiones"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <Trophy className="mb-3 h-10 w-10" />
                              Comisiones
                            </Label>
                          </Link>
                        </div>
                        <div>
                          <Link href="/private/dashboard/administracion/cierreDePeriodos">
                            <RadioGroupItem
                              value="cierre_de_periodos"
                              id="cierre_de_periodos"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="cierre_de_periodos"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <BookLock className="mb-3 h-10 w-10" />
                              Cierre de periodos
                            </Label>
                          </Link>
                        </div>
                    </RadioGroup>
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
