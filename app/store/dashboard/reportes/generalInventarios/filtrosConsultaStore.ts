import { create } from "zustand";


interface Terreno {
    consecutivo: string;
    nomenclatura: string;
    fraccionamiento: string;
    no_manzana: string;
    no_terreno: string;
    superficie: number;
    precio_m2: number;
    total_terreno: number;
    deposito: string;
    estatus: number;
    valor_total: number;
    id_terreno: number;
}
interface Financiamiento{
    financiamiento: string;
    porcentaje: number;
    id_financiamiento: number;
    no_pagos: number;
}

interface Manzana {
    manzana: string;
    terrenos: Terreno[];
}


interface reporteResultados {
    resultados: Manzana[];
    financiamientos: Financiamiento[];
    // idFraccionamiento: string;
    setResultados: (resultados: any[]) => void;
    setFinanciamientos: (financiamientos: Financiamiento[]) => void;
    // setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const usegeneralInventariosFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    financiamientos: [],
    // idFraccionamiento: "",
    // setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
    setFinanciamientos: (financiamientos) => set({ financiamientos: financiamientos }),
}));

