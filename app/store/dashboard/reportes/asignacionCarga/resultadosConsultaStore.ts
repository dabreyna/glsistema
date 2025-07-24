import { create } from "zustand";

interface Resultado {
  consecutivo: string;
  terreno:  string;
  id_contrato:  string;
  id_cliente:  string;
  nombre_cliente:  string;
  fecha_contrato:  string;
  monto_vencido:  string;
  id_tipo_vencimiento:  string;
  monto_pagado:  string;
  mensualidades_vencidas:  string;
  dia_vencimiento:  string;
  monto_pagado_mes:  string;
  atendido:  string;
  id_asesor_cobranza:  string;
  asesor:  string;
  id_estatus_contrato:  string;
  puntuacion:  string;
}


interface reporteResultados {
    resultados: Resultado[];
    // idFraccionamiento: string;
    setResultados: (resultados: Resultado[]) => void;
    // setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useReporteAsignacionCargaResultadosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    // idFraccionamiento: "",
    // setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

// useReporteAsignacionCargaResultadosConsultaStore