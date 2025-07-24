import { create } from "zustand";


interface Ajuste {
  mes:number;
  anio:number;
  cliente:string;
  terreno:string;
  mensualidad_anterior:number;
  saldo_anterior:number;
  importe_ajuste:number;
  mensualidad_actual:number;
  saldo_actual:number;
  mensualidades_pendientes:number;
  resultado:number;
  fecha_contrato:string;
}




interface reporteResultados {
    resultados: Ajuste[];
    setResultados: (resultados: any[]) => void;
}


export const useajusteAnualFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));

