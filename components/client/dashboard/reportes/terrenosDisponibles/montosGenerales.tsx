
// import { Suspense } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { getDatos } from "@/lib/reportes/terrenosDisponibles/montosGenerales";



export default function MontosGenerales({datos}:{datos:any}) {
    // const datos = await getDatos();

    return (
        <>
        {/* <Suspense fallback={<div>Cargando Datos...</div>}> */}
        <Card className="col-span-2 mb-2" style={{backgroundColor:'#fcf5e5',color:'#b31c45'}}>
            <CardContent className="p-4" >
                <div className="grid grid-cols-1 gap-2">
                    <span className="font-semibold text-center text-uppercase uppercase text-sm">Terrenos Disponibles</span>
                <span className="text-center font-black" style={{backgroundColor:'#fcf5e5'}}>{datos.total_terrenos}</span>
                </div>
            </CardContent>
        </Card>
        <br />
        <Card className="col-span-2 mb-2" style={{backgroundColor:'#fcf5e5',color:'#b31c45'}}>
            <CardContent className="p-4" >
                <div className="grid grid-cols-1 gap-4">
                    <span className="font-semibold text-center text-uppercase uppercase text-sm">Superficie Total</span>
                <span className="text-center font-black">{datos.total_superficie}</span>
                </div>
            </CardContent>
        </Card>
        <br />
        <Card className="col-span-2 mb-2" style={{backgroundColor:'#fcf5e5',color:'#b31c45'}}>
            <CardContent className="p-4" >
                <div className="grid grid-cols-1 gap-4">
                    <span className="font-semibold text-center text-uppercase uppercase text-sm">Valor Estimado</span>
                <span className="text-center font-black">{datos.total_valor}</span>
                </div>
            </CardContent>
        </Card>
        {/* </Suspense> */}
        </>
        )
}