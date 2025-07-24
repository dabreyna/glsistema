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
                <Label htmlFor="status"># de meses</Label>
                <Input type="text" placeholder="6" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                <Label htmlFor="status">Comisión mensual (Pesos)</Label>
                <Input type="text" placeholder="1000.00" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                <Label htmlFor="status">Comisión por venta de contado (Pesos)</Label>
                <Input type="text" placeholder="15000.00" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />


            <Separator className="my-2 size-1 bg-white" />
            <Button className="p-6">Guardar</Button>
        </>
    )
}