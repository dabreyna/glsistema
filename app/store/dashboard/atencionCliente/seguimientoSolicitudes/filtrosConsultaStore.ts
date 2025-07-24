import { create } from "zustand";

interface Cliente {
  cliente:string;
  nombreusuario:string;
  // fraccionamiento:string;
  // no_manzana:string;
  // no_terreno:string;
  nomenclatura:string;
  id_solicitud_servicio:string;
  id_servicio:string;
  id_contrato:string;
  id_usuario:string;
  estado:string;
  medio_solicitud:string;
  transformador:string;
  medio_envio_presupuesto:string;
  cuenta_cespm:string;
  folio_seguimiento_cfe:string;
  fecha_solicitud:string;
  fecha_marcado:string;
  fecha_carta_lista_entrega:string;
  fecha_entrega_cliente:string;
  fecha_compra:string;
  fecha_envio:string;
  fecha_carta_recepcion_cliente:string;
  fecha_instalacion_1:string;
  fecha_instalacion_2:string;
  fecha_solicitud_presupuesto:string;
  fecha_presupuesto_recibido:string;
  fecha_revision_contraloria:string;
  fecha_presupuesto_autorizado:string;
  fecha_entrega_paquete:string;
  fecha_presupuesto_conexion:string;
  fecha_pago_presupuesto:string;
  fecha_conexion:string;
  fecha_solicitud_contrato:string;
  fecha_instalacion_medidor:string;
  fecha_envio_presupuesto:string;
  fecha_pago_anticipo:string;
  fecha_envio_contrato_cespm:string;
  fecha_descubrimiento:string;
  fecha_medidor_cespm:string;
  fecha_envio_solicitud_cfe:string;
  fecha_medidor_cfe:string;
  dias:string;
  dias2:string;
  archivo:string;
}


interface reporteResultados {
    resultados: Cliente[];
    idFraccionamiento: string;
    idServicio: string;
    setResultados: (resultados: Cliente[]) => void;
    setIdFraccionamiento: (idFraccionamiento: string) => void;
    setIdServicio: (idServicio: string) => void;
}


export const useSeguimientoSolicitudesFiltrosConsultaStore = create<reporteResultados>((set) => ({
    resultados: [],
    idFraccionamiento: "",
    idServicio: "",
    setIdFraccionamiento: (idFraccionamiento) => set({ idFraccionamiento: idFraccionamiento }),
    setIdServicio: (idServicio) => set({ idServicio: idServicio }),
    setResultados: (resultados) => set({ resultados: resultados }),
}));

