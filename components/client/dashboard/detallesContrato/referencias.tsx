"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";


import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";
import { useEffect,useState } from "react";
import { EditarReferencia } from "./editarReferencia";

interface datosReferencia {
  id_referencia :any;
  abreviatura :string |null;
  nombre :string;
  ap_paterno :string |null;
  ap_materno? :string |null;
  calle? :string |null;
  numero? :any |null; 
  entre? :any |null; 
  ciudad? :string |null;
  cp? :any |null;
  colonia? :string |null;
  estado? :string |null;
  pais? :string |null;
  tel_cod_casa? :string |null;
  tel_casa? :string |null;
  tel_cod_cel? :string |null;
  tel_cel? :string |null;
  parentesco? :string |null;
  observaciones? :string |null;
}
interface listadoReferencias{
  Referencias :datosReferencia[];
}

export default function Referencias() {
    // const [isMounted, setIsMounted] = useState(false);
    const [data,setData]=useState<datosReferencia[]>([]);
    const idContrato = useContratoSelectedStore((state) => state.idContrato);

    const handleGuardarCambios =(newData:datosReferencia[])=>{
      const index = data.findIndex((referencia)=>referencia.id_referencia===newData[0].id_referencia);
      const newReferencias = [...data];
      newReferencias[index]=newData[0];
      setData(newReferencias);

      //setData(newData);
      // console.log("guardando cambios");
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/dashboard/detallesContrato/datosReferencia?idContrato=${idContrato}`);
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
    }, [idContrato]);
// console.log(data)
  return (<>
            {data ? (
              <>
              {data.map((referencia)=>(
                <Card key={referencia.id_referencia}>
                  <CardHeader>
                    <CardTitle>Referencia: <span className="text-sm">{referencia.abreviatura} {referencia.nombre} {referencia.ap_paterno} {referencia?.ap_materno}</span></CardTitle>
                    <CardDescription className="space-y-2 text-gray-700 font-medium">
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                            <div className="container mx-auto px-4">
                                <div className="grid md:grid-cols-2 gap-4  xs:grid-cols-1">
                                    <div>
                                        {/* <span className="text-sm uppercase"><b></b> <span className="text-xs normal-case">{copropietario.abreviatura}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Nombre:</b> <span className="text-xs normal-case">{copropietario.nombre} {copropietario.ap_paterno} {copropietario?.ap_materno}</span></span>
                                        <br /> */}
                                        <span className="text-sm uppercase"><b>Calle:</b> <span className="text-xs normal-case">{referencia.calle}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Numero:</b> <span className="text-xs normal-case">{referencia.numero}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Entre:</b> <span className="text-xs normal-case">{referencia.entre}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Ciudad:</b> <span className="text-xs normal-case">{referencia.ciudad}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Codigo Postal:</b> <span className="text-xs normal-case">{referencia.cp}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Colonia:</b> <span className="text-xs normal-case">{referencia.colonia}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Estado:</b> <span className="text-xs normal-case">{referencia.estado}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Pais:</b> <span className="text-xs normal-case">{referencia.pais}</span></span>
                                        <br />
                                    </div>
                                    <div>
                                        <span className="text-sm uppercase"><b>Telefono de Casa:</b> <span className="text-xs normal-case">{referencia.tel_cod_casa}{referencia.tel_casa}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Telefono Celular:</b><span className="text-xs normal-case">{referencia.tel_cod_cel} {referencia.tel_cel}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Parentesco:</b> <span className="text-xs normal-case">{referencia.parentesco}</span></span>
                                        <br />
                                        <span className="text-sm uppercase"><b>Observaciones:</b> <span className="text-xs normal-case">{referencia.observaciones}</span></span>
                                        <br />
                                    </div>
                                </div>
                            </div>
                      </CardContent>
                      <CardFooter>
                        <EditarReferencia referencia={referencia} onGuardar={handleGuardarCambios}/>
                      </CardFooter>
                    </Card>))}
                    </>
                  ) : (
                  <span className="text-sm font-normal leading-none">Selecciona Contrato...</span>
                  )}
  </>)
  };