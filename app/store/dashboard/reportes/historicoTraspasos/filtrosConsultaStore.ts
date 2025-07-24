import { create } from "zustand";


interface Traspaso {
fecha:string;
comision:string;
monto_comision:string;
comentarios:string;
folio_recibo:string;
recibo_id:string;
clienteanterior:string;
clientenuevo:string;
manzana:string;
terreno:string;
fraccionamiento:string;
fecha_recibo:string;
}


interface reporteResultados {
    resultados: Traspaso[];
    setResultados: (resultados: any[]) => void;
}


export const useHistoricoTraspasosFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));

