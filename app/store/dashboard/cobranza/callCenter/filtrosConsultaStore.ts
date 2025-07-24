import { create } from "zustand";

interface Cliente {
    id_contrato:string;
    // nomenclatura: string;
    // no_manzana: string;
    terreno: string;
    nombre: string;
    id_cliente:string;
    dia_vencimiento:string;
    mensualidades_vencidas:string;
    monto_vencido:string;
    nombre_asesor:string;
    tipo_vencimiento:string;
    compromiso_pago:string;
    fecha_compromiso:string;
    clasificacion:string;
    semaforo:string;
    cliente_nuevo:string;
}


interface reporteResultados {
    resultados: Cliente[];
    idFraccionamiento: string;
    setResultados: (resultados: Cliente[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useCallCenterFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    idFraccionamiento: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

