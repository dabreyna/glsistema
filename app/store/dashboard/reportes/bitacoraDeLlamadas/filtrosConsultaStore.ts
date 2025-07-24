import { create } from "zustand";

interface Bitacora {
    nombre_asesor:string;
    id_clasificacion: number;
    id_usuario:number;
    clasificacion:string;
    id_tipo_comentario:number;
    tipo:string;
    cont:string;
    fil_asesor:string;
    fil_fecha_inicio:string;
    fil_fecha_fin:string;
    fil_cliente:string;
    fil_clasificacion:string;
}


interface reporteResultados {
    resultados: Bitacora[];
    // idFraccionamiento: string;
    setResultados: (resultados: Bitacora[]) => void;
    // setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useBitacoraDeLlamadasFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    // idFraccionamiento: "",
    // setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

