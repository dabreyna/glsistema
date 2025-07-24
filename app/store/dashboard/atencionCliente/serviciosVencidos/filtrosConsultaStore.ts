import { create } from "zustand";

interface SaldoVencido {
terreno: string;
nombre_cliente: string;
fecha_contrato: string;
servicio: string;
mes1: string;
mes2: string;
mes3: string;
mes4: string;
dia_vencimiento: string;
mensualidades_vencidas: string;
monto_vencido: string;
monto_pagado: string;
}


interface reporteResultados {
    resultados: SaldoVencido[];
    setResultados: (resultados: SaldoVencido[]) => void;
}


export const useServiciosVencidosFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));

