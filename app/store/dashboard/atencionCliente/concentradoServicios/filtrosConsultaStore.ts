import { create } from "zustand";

interface Servicios {
  nomenclatura:string;
  nombre_cliente:string;
  estatus:string;
  calle:string;
  id:string;
  id_terreno:string;
  no_transformador:string;
  transformador_instalado:string;
  transformador_en_uso:string;
  servicio_de_luz:string;
  servicio_de_agua:string;
  biodigestor:string;
  solicitud_de_marcado:string;
  carta_finiquito:string;
  escrituras:string;
  clave_catastral:string;
  obra_hidraulica:string;
}


interface reporteResultados {
    resultados: Servicios[];
    idFraccionamiento: string;
    idServicio: string;
    setResultados: (resultados: Servicios[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
    setIdServicio: (idServicio: string) => void;
}


export const useConcentradoServiciosFiltrosConsultaStore = create<reporteResultados>()((set) => ({
    resultados: [],
    idFraccionamiento: "",
    idServicio: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setIdServicio: (idServicio) => set({ idServicio: idServicio }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

