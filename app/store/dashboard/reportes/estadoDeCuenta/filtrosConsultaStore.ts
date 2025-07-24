import { create } from "zustand";

interface Contrato {
    nombre_cliente: string;
    nomenclatura: string;
    no_manzana: string;
    no_terreno: string;
    id_contrato: string;
}


interface reporteResultados {
    resultados: Contrato[];
    idFraccionamiento: string;
    setResultados: (resultados: Contrato[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useEstadoDeCuentaFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    idFraccionamiento: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

