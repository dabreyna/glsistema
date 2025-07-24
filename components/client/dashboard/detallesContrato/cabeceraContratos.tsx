"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";
import { useEffect,useState } from "react";
// import { Contrato } from '../../../../app/private/dashboard/buscarCliente/listadoClientesBuscador';

interface datosClienteContrato {
  nombre: string | null;
  conyuge: string | null;
  tel_casa: string | null;
  tel_cel: string | null;
  tel_trabajo: string | null;
  email: string | null;
  estado: string | null;
  fecha_nacimiento: string | null;
  medio: string | null;
  vendedor: string | null;
  vendedor_compartido: string | null;
  id_estatus_contrato: string | null;
  estatus: string | null;
  id_terreno: string | null;
  no_terreno: string | null;
  id_manzana: string | null;
  no_manzana: string | null;
  id_fraccionamiento: string | null;
  fraccionamiento: string | null;
  nomenclatura: string | null;
  fecha_contrato: string | null;
  fecha_firma:string | null;
  id_cliente: string | null;
  contrato_entregado: string | null;
}

export default function CabeceraContrato() {
    const [isMounted, setIsMounted] = useState(false);
    const [data,setData]=useState<datosClienteContrato[]>([]);
    const idCliente = useContratoSelectedStore((state) => state.idCliente);
    const idContrato = useContratoSelectedStore((state) => state.idContrato);

    useEffect(() => {
    if(isMounted){
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/dashboard/detallesContrato/datosCabecera?idCliente=${idCliente}&idContrato=${idContrato}`);
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
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-4  xs:grid-cols-1">
                        <div>
                            <span className="text-sm uppercase"><b>Nombre:</b> <span className="text-xs normal-case">{data[0]?.nombre}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Conyuge:</b> <span className="text-xs normal-case">{data[0]?.conyuge}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Telefono de Casa:</b> <span className="text-xs normal-case">{data[0]?.tel_casa}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Telefono Celular:</b><span className="text-xs normal-case"> {data[0]?.tel_cel}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Telefono de Trabajo:</b> <span className="text-xs normal-case">{data[0]?.tel_trabajo}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Email:</b> <span className="text-xs normal-case">{data[0]?.email}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Estado Civil:</b> <span className="text-xs normal-case">{data[0]?.estado}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Fecha Nacimiento:</b> <span className="text-xs normal-case">{data[0]?.fecha_nacimiento}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Medio:</b> <span className="text-xs normal-case">{data[0]?.medio}</span></span>
                            <br />
                        </div>
                        <div>
                            <span className="text-sm uppercase"><b>Vendedor:</b><span className="text-xs normal-case"> {data[0]?.vendedor}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Vendedor Compartido:</b><span className="text-xs normal-case"> {data[0]?.vendedor_compartido}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Estatus:</b><span className="text-xs normal-case"> {data[0]?.estatus}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Terreno:</b><span className="text-xs normal-case"> {data[0]?.nomenclatura}-{data[0]?.no_manzana}-{data[0]?.no_terreno}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Fraccionamiento:</b><span className="text-xs normal-case"> {data[0]?.fraccionamiento}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Fecha Alta de Contrato:</b><span className="text-xs normal-case"> {data[0]?.fecha_contrato}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Fecha Firma de Contrato:</b><span className="text-xs normal-case"> {data[0]?.fecha_firma}</span></span>
                            <br />
                            <span className="text-sm uppercase"><b>Contrato Entregado:</b><span className="text-xs normal-case"> {data[0]?.contrato_entregado}</span></span>
                        </div>
                    </div>
                </div>
            </>
            ) : (
            <span className="text-sm font-normal leading-none">Selecciona Contrato...</span>
            )}
  </>)
  };