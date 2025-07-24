import { create } from "zustand";

interface Resultado {
    consecutivo: string;
    cliente: string;
    ubicacion: string;
    fecha_alta: string;
    fecha_estatus: string;
    asesor: string;
    medio: string;
    estatus: string;
}

interface reporteResultados {
    resultados: Resultado[];
    setResultados: (resultados: Resultado[]) => void;
}


export const useMercadotecniaFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));

