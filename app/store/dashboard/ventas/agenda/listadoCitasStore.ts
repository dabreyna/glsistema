import { create } from "zustand";

interface Cita {
  cliente:string;
  comentario:string;
  nombre_comentario:string;
  hora_compromiso:string;
  id_cliente:string;
  fecha_compromiso:string;
  tel_casa:string;
  tel_usa_casa:string;
  email:string;
  fecha_compromiso_original:string;
  asesor_de_ventas:string;
  tel_cel:string;
  tel_usa_cel:string;
  tel_oficina:string;
  tel_usa_oficina:string;
  id_agenda:string;
  whats:string;
}
 


interface Listado {
    asesor_de_ventas: string;
    citas: Cita[];
}


interface ListadoCitasStore {
    listadoCitas: Listado[];
    setListadoCitas: (resumen: Listado[]) => void; 
}


export const useListadoCitasStore = create<ListadoCitasStore>((set) => ({
    listadoCitas: [],
    setListadoCitas: (resultados) => set({ listadoCitas: resultados }),
}));
