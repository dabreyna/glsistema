import { create } from "zustand";

interface Pago {
  no_recibo:string;
  pagos:string;
  monto_cheque:string;
  monto_efectivo:string;
  monto_dlls:string;
  tipo_cambio:string;
  fecha:string;
  usuario:string;
  nombre_usuario:string;
  fraccionamiento:string;
  nombre_cliente:string;
  terreno:string;
  cancelado:string;
  id_tipo_pago:string;
  razon_social:string;
}


interface RazonSocial {
  razon_social: string;
  pagos: Pago[];
}



interface reporteResultados {
    resultados: RazonSocial[];
    // idFraccionamiento: string;
    setResultados: (resultados: RazonSocial[]) => void;
    // setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useReporteCobranzaResultadosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    // idFraccionamiento: "",
    // setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));




