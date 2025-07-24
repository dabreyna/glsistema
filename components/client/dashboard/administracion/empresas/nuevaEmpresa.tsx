"use client";

import { useMercadotecniaFiltrosConsultaStore } from '@/app/store/dashboard/reportes/mercadotecnia/filtrosConsultaStore';
import { Separator } from "@/components/ui/separator";
import * as React from "react"
 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";


export default function NuevaEmpresa() {
    const seleccionaResultados = useMercadotecniaFiltrosConsultaStore((state: { setResultados: any; }) => state.setResultados);

      
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 "> 
                {/* <Label htmlFor="status">Nombre</Label> */}
                <Input type="text" placeholder="Nombre" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Razón Social</Label> */}
                <Input type="text" placeholder="Razón Social" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">RFC</Label> */}
                <Input type="text" placeholder="RFC" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Ciudad</Label> */}
                <Input type="text" placeholder="Ciudad" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Estado</Label> */}
                <Input type="text" placeholder="Estado" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Dirección</Label> */}
                <Input type="text" placeholder="Dirección" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Representante legal	</Label> */}
                <Input type="text" placeholder="Representante legal" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Teléfono</Label> */}
                <Input type="text" placeholder="Teléfono" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Correo electrónico</Label> */}
                <Input type="text" placeholder="Correo electrónico" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Nombre folios recibos</Label> */}
                <Input type="text" placeholder="Nombre folios recibos" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                {/* <Label htmlFor="status">Nombre folios notas de crédito</Label> */}
                <Input type="text" placeholder="Nombre folios notas de crédito" className="w-full"/>
            </div>
            <Separator className="my-2 size-1 bg-white" />



            <Separator className="my-2 size-1 bg-white" />
            <Button className="p-6">Guardar</Button>
        </>
    )
}