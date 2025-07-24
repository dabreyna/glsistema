import { create } from "zustand";

interface Contrato {
  nomenclatura: string;
  no_manzana: string;
  no_terreno: string;
  nombre_cliente: string;
  monto_terreno_inicial: string;
  monto_terreno_actual: string;
  superficie: string;
  pagado2: string;
  pagado: string;
  saldo:string;
  fecha_contrato: string;
  id_contrato: string;
  ultimo_pago: string;
  casa_mx: string;
  cel_mx: string;
  trabajo_mx: string;
  tel_usa_casa: string;
  tel_usa_cel: string;
  tel_usa_oficina: string;
  precioinventario: string;
}


interface reporteResultados {
    resultados: Contrato[];
    setResultados: (resultados: Contrato[]) => void;
}


export const useContratosPagadosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));

