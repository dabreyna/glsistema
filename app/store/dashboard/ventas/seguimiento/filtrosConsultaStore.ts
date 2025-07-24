import { create } from "zustand";

interface Cliente {
id_usuario:string;
id_cliente:string;
semaforo:string;
nombre_cliente:string;
nombre_asesor:string;
fecha_alta:string;
fecha_prox_llamada:string;
interesado:string;
medio:string;
tel_casa:string;
tel_cel:string;
tel_trabajo:string;
mail:string;
ultimo_comentario:string;
clasificacion:string;
notas:string;
}

interface Prospectos{
    nombre_asesor:string;
    clientes:Cliente[];
}

interface reporteResultados {
    resultados: Prospectos[];
    // idFraccionamiento: string;
    setResultados: (resultados: Prospectos[]) => void;
    // setIdFraccionamiento: (idFraccionamiento: string) => void;
}


export const useSeguimientoFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    // idFraccionamiento: "",
    // setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

