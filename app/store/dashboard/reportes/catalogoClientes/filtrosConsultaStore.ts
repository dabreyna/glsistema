import { create } from "zustand";

interface Resultado {
    consecutivo: string;
    terreno: string;
    nombrecliente: string;
    calle: string;
    numero: string;
    entre: string;
    colonia: string;
    tel_cel: string;
    email: string;
    ciudad: string;
    estado: string;
    cp: string;
    fecha_nacimiento: string;
    dia_vencimiento: string;
    meses_atraso: string;
    mens_pagadas: string;
    // estatus: string;
}

interface reporteResultados {
    resultados: Resultado[];
    setResultados: (resultados: Resultado[]) => void;
}


export const useCatalogoClientesFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));

