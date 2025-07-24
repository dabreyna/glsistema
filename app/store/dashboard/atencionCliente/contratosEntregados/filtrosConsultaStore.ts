import { create } from "zustand";

interface Resultado {
    id_contrato: string;
    id_cliente: string;
    terreno: string;
    nombre_cliente: string;
    fecha_contrato: string;
    fecha_firma: string;
    contrato_entregado: string;
    estatus_contrato: string;
}



interface reporteResultados {
    resultados: Resultado[];
    setResultados: (resultados: Resultado[]) => void;
}


export const useContratosEntregadosFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));

