import { create } from "zustand";

interface Saldo {
  consecutivo:string;
  id_contrato: string;
  terreno: string;
  nombre_cliente: string;
  precio_original: string;
  precio_actual: string;
  pagado: string;
  saldo: string;
  fecha_contrato: string; 
}


interface reporteResultados {
    resultados: Saldo[];
    setResultados: (resultados: Saldo[]) => void;
}


export const useSaldosCuentasPorCobrarConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));

