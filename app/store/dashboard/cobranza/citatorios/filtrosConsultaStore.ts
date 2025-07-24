import { create } from "zustand";

interface Cliente {
    nomenclatura: string;
    nombre_cliente: string;
    fecha_contrato:string;
    atrasadas:string;
    id_contrato:string;
    id_fraccionamiento:string;
    id_manzana: string;
    id_terreno: string;
}


interface reporteResultados {
    resultados: Cliente[];
    idFraccionamiento: string;
    setResultados: (resultados: Cliente[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useCitatoriosFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    idFraccionamiento: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

