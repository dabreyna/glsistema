"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";
import { useEffect,useState } from "react";

interface mensajeCaja {
  comentario: string | null;
  fecha_compromiso: string | null;
  usuario: string | null;
}

export default function UltimoMensajeCobranza() {
    const [isMounted, setIsMounted] = useState(false);
    const [data,setData]=useState<mensajeCaja[]>([]);
    const idCliente = useContratoSelectedStore((state) => state.idCliente);
    const idContrato = useContratoSelectedStore((state) => state.idContrato);

    useEffect(() => {
    if(isMounted){
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/dashboard/detallesContrato/ultimoMensajeCobranza?idContrato=${idContrato}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
          }
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    } else {
      setIsMounted(true);
    }
    }, [idCliente,idContrato,isMounted]);
  return (<>
            {data ? (
            <>
                <div className="container mx-auto px-4 bg-red-100 backdrop-blur-sm drop-shadow-md">
                    <div className="grid md:grid-cols-1 gap-4  xs:grid-cols-1">
                        <div>
                            <span className="text-xs uppercase"><b>Cobranza:</b> <span className="text-xs normal-case text-red-600 text-destructive">{data[0]?.comentario}</span></span>
                            <br />
                            <span className="text-xs uppercase"><b>Fecha Compromiso:</b> <span className="text-xs normal-case">{data[0]?.fecha_compromiso}</span></span>
                            <br />
                            <span className="text-xs uppercase"><b>Usuario:</b> <span className="text-xs normal-case">{data[0]?.usuario}</span></span>
                        </div>
                    </div>
                </div>
            </>
            ) : (
            <span className="text-sm font-normal leading-none">Selecciona Contrato...</span>
            )}
  </>)
  };