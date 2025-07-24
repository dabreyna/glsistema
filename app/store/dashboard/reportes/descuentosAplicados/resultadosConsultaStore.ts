import { create } from "zustand";

interface Descuento {
consecutivod: string;
consecutivo: string;
nombre_cliente: string;
terreno: string;
recibo: string;
fecha_movimiento: string;
mensualidadcubierta: string;
monto: string;
porcentaje: string;
tipo: string;
justificacion: string;
asesor: string;
ejecutivo: string;
}


interface reporteResultados {
    resultados: Descuento[];
    setResultados: (resultados: Descuento[]) => void;
}


export const useDescuentosAplicadosResultadosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    setResultados: (resultados) => set({ resultados: resultados }),
}));




