import { create } from "zustand";

interface Resultado {
    id_cliente: string;
    nombre_cliente: string;
    terreno: string;
    fecha: string;
    asesor_ventas: string;
    id_etatus_contrato: string;
    id_contrato: string;
    madurada: string;
    mes1: string;
    mes2: string;
    mes3: string;
    mes4: string;
    mes5: string;
    mes6: string;
}

interface reporteResultados {
    resultados: Resultado[];
    mesInicio: string;
    setResultados: (resultados: Resultado[]) => void;
    setMesInicio: (mesInicio: string) => void;
}


export const useVentasMaduradasFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    mesInicio: '',
    setResultados: (resultados) => set({ resultados: resultados }),
    setMesInicio: (mesInicio) => set({ mesInicio: mesInicio }),
}));

