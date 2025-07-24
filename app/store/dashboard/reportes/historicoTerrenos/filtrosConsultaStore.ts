import { create } from "zustand";

interface Contrato {
    nombre_cliente: string;
    fecha_contrato: string;
    fecha_cancelacion: string;
    precio_terreno: string;
    precio_m2_inicial: string;
}
interface Terreno{
    id_terreno: string;
    terreno:string;
    superficie:string;
    precio_m2:string;
    total_terreno:string;
    contratos: Contrato[];
}


interface reporteResultados {
    resultados: Terreno[];
    idFraccionamiento: string;
    setResultados: (resultados: Terreno[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useHistoricoTerrenosFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    idFraccionamiento: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

