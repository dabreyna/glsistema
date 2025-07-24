import { create } from "zustand";

interface Comentario {
  fecha: string;
  nombre_cliente: string;
  comentario: string;
  nombre_asesor: string;
  terreno: string;
  id_comentario: string;
  id_usuario: string;
}

interface reporteResultados {
    resultados: Comentario[];
    setResultados: (resultados: Comentario[]) => void;
}


export const useComentariosFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));