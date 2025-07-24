import { create } from "zustand";

interface Comision {
  consecutivo: string;
  fecha_comentario: string;
  comentario: string;
  donde: string;
  asesor: string;
  id_usuario: string;
  nombre_cliente: string;
  atendido: string;
}

interface reporteResultados {
    resultados: Comision[];
    setResultados: (resultados: Comision[]) => void;
}


export const useComentariosCobranzaFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));