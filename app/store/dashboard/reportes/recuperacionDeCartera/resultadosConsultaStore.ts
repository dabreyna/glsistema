import { create } from "zustand";

interface Cartera {
  id_empresa: string;
  razon_social: string;
  fraccionamiento: string;
  exigible: string;
  cobranza_real: string;
  cobranza_otros: string;
}


interface RazonSocial {
  razon_social: string;
  cartera: Cartera[];
}



interface reporteResultados {
    resultados: RazonSocial[];
    // idFraccionamiento: string;
    setResultados: (resultados: RazonSocial[]) => void;
    // setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useReporteRecuperacionDeCarteraResultadosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    // idFraccionamiento: "",
    // setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));




