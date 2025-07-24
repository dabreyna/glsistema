"use client";

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {useFraccionamientoSelectedStore} from '@/app/store/dashboard/reportes/terrenosDisponibles/fraccionamientoSelectedStore'; 

interface Fraccionamiento {
    id_fraccionamiento: string;
    fraccionamiento: string;
  }
  
  interface ListadoFraccionamientosProps {
    Fraccionamientos: Fraccionamiento[];
  }

export default function ListadoFraccionamientos({ Fraccionamientos }: ListadoFraccionamientosProps) {
    const seleccionaFraccionamiento = useFraccionamientoSelectedStore((state: { setFraccionamiento: any; }) => state.setFraccionamiento);
    const nombreFraccionamiento = useFraccionamientoSelectedStore((state: { setNombre: any; }) => state.setNombre);

    const handleFraccionamientoElegido = (value: string) => {
        const fraccionamientoSeleccionado = Fraccionamientos.find(
            (fraccionamiento) => fraccionamiento.id_fraccionamiento === value);
        if (fraccionamientoSeleccionado) {
            seleccionaFraccionamiento(fraccionamientoSeleccionado.id_fraccionamiento);
            nombreFraccionamiento(fraccionamientoSeleccionado.fraccionamiento);
        }
      };
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"> 
                <RadioGroup onValueChange={handleFraccionamientoElegido} className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                    {Fraccionamientos.map((fraccionamiento) => (
                    <div className="flex items-center space-x-2"  key={fraccionamiento.id_fraccionamiento}>
                        <RadioGroupItem key={fraccionamiento.id_fraccionamiento} 
                                        value={fraccionamiento.id_fraccionamiento} 
                                        id={fraccionamiento.fraccionamiento} />
                            <Label htmlFor={fraccionamiento.fraccionamiento}>
                                {fraccionamiento.fraccionamiento}
                            </Label>
                    </div>
                    ))}
                </RadioGroup>
            </div>
        </>
    )
}