import { create } from "zustand";
import { id } from 'date-fns/locale';

interface Cita {
    id_contrato: string;
    id_cliente: string;
    nombre_cliente: string;
    fecha_compromiso: string;
    comentario: string;
    asesor: string;
    nombre_asesor: string;
}
 
interface Compromiso {
    id_contrato: string;
    id_cliente: string;
    nombre_cliente: string;
    fecha_compromiso: string;
    comentarios: string;
    monto: string;
    asesor: string;
    nombre_asesor: string;
}

interface Citas {
    citas: Cita[];
}


interface ListadoCitasStore {
    listadoCitas: Cita[];
    listadoCompromisos: Compromiso[];
    setListadoCitas: (resumen: Cita[]) => void; 
    setListadoCompromisos: (resumen: Compromiso[]) => void;
}


export const useListadoCitasStore = create<ListadoCitasStore>((set) => ({
    listadoCitas: [],
    listadoCompromisos: [],
    setListadoCitas: (resultados) => set({ listadoCitas: resultados }),
    setListadoCompromisos: (resultados) => set({ listadoCompromisos: resultados }),
}));
