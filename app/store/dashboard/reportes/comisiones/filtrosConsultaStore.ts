import { create } from "zustand";

interface Comision {
    asesor: string;
    terreno: string;
    fecha_contrato: string;
    fecha_pago: string;
    nombre_cliente: string;
    cancelado: string;
    no_comision: string;
    monto_primario: string;
    id_contrato: string;
    max_comision: string;
    comisionpagada: string | null;
}
interface Asesor {
    asesor: string;
    comisiones: Comision[];
}

interface Resumen {
    nombre_asesor: string;
    generado: string;
    pagado: string;
    saldo: string;
    usuario: string;
}

interface ComisionesStore {
    resumen: Resumen[];
    detallado: Asesor[];
    setResumen: (resumen: Resumen[]) => void;
    setDetallado: (detallado: Asesor[]) => void;
}

// interface reporteResultados {
//     resultados: Resultado[];
//     setResultados: (resultados: Resultado[]) => void;
// }


export const useComisionesFiltrosConsultaStore = create<ComisionesStore>((set) => ({
    resumen: [],
    detallado: [],
    setResumen: (resultados) => set({ resumen: resultados }),
    setDetallado: (resultados) => set({ detallado: resultados }),
}));

