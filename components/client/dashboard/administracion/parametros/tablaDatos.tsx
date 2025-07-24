"use client";

import { useMercadotecniaFiltrosConsultaStore } from '@/app/store/dashboard/reportes/mercadotecnia/filtrosConsultaStore';
import { Separator } from "@/components/ui/separator";
import * as React from "react"
 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';



export default function TablaDatos() {
    const seleccionaResultados = useMercadotecniaFiltrosConsultaStore((state: { setResultados: any; }) => state.setResultados);

      
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 "> 
                <Label htmlFor="status">Días de gracia</Label>
                <Input type="text" placeholder="9" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                <Label htmlFor="status">Mensaje inicial</Label>
                <Input type="text" placeholder="El fin de un ciclo es el principio de algo nuevo, Bienvenidos." className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />


            <Separator className="my-2 size-1 bg-white" />
            <Button className="p-6">Guardar</Button>
        </>
    )
}