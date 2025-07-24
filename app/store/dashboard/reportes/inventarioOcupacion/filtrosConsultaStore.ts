import { create } from "zustand";


interface Terreno {
    no_terreno: string;
    nomenclatura: string;
    no_manzana: string;
    superficie: string;
    precio_m2: string;
    precio_financiar: string;
    nombre_cliente: string;
    id_cliente: string;
    id_contrato: string;
    fraccionamiento: string;
}

interface Manzana {
    manzana: string;
    terrenos: Terreno[];
}

// interface DatosTerrenos {
//     data: Manzana[];
// }

interface reporteResultados {
    resultados: Manzana[];
    idFraccionamiento: string;
    setResultados: (resultados: any[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useInventarioOcupacionFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    idFraccionamiento: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

