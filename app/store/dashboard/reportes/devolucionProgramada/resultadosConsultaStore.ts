import { create } from "zustand";
import { id } from 'date-fns/locale';

interface Devolucion {
  nombre_cliente: string;
  id_contrato: string;
  terreno: string;
  monto_devolucion: string;
  fecha_pago: string;
  no_pago: string;
  monto: string;
  fecha_contrato: string;
  fecha_cancelacion: string;
  razon_social: string; 
  saldo: string;
}


interface RazonSocial {
  razon_social: string;
  devoluciones: Devolucion[];
}



interface reporteResultados {
    resultados: RazonSocial[];
    // idFraccionamiento: string;
    setResultados: (resultados: RazonSocial[]) => void;
    // setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useReporteDevolucionProgramadaResultadosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    // idFraccionamiento: "",
    // setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));




