import { create } from "zustand";

interface Contrato {
    nomenclatura: string;
    no_manzana: string;
    no_terreno: string;
    nombre_cliente: string;
    fraccionamiento: string;
    fecha_cancelacion: string;
    mensualidades_pagadas: string;
    mensualidades_vencidas: string;
    capital_vencido: string;
    pagado: string;
    mensualidad_actual: string;
    fecha_contrato: string;
    monto_terreno_actual: string;
    monto_terreno_inicial: string;
    saldo_pendiente: string;
    superficie: string;
    nombre_vendedor: string;
    comentarios_cancelacion: string;
    cargo_cancelacion: string;
    monto_devolucion: string;
    estatus_carta: string;
    id_contrato: string;
    asesor_carta_devolucion: string;
    asesor_cobranza: string;

}


interface reporteResultados {
    resultados: Contrato[];
    idFraccionamiento: string;
    setResultados: (resultados: Contrato[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useCanceladosFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    idFraccionamiento: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

