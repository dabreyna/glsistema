import { create } from "zustand";

interface Lectura {
  id_movimiento: string;
  id_carga: string;
  id_contrato: string;
  toma_agua: string;
  lectura_actual: string;
  lectura_anterior: string;
  fecha_lectura: string;
  observaciones: string;
  fotos: string;
  importe: string;
  estatus: string;
  estatus_lectura: string;
}


interface reporteResultados {
    resultados: Lectura[];
    idFraccionamiento: string;
    setResultados: (resultados: Lectura[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useLecturasAguaFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    idFraccionamiento: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

