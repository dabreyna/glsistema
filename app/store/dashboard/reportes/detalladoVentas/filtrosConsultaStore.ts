import { create } from "zustand";



interface ResumenAsesor {
  consecutivo: string;
  vendedor: string;
  ventas: string;
  compartidas: string;
  ventasmes: string;
  nombre_asesor: string;
  tendencia: string;
  fecha_inicio: string;
  fecha_fin: string;
  fil_estatus: string;
  fil_empresa: string;
  fil_asesor: string;
  fil_asesor_inactivo: string;
  fil_reubicados: string;
  fil_cancelados: string;
}

interface VentasEmpresa {
  razon_social: string;
  fraccionamiento: string;
  ventas: string;
  id_empresa: string;
  id_fraccionamiento: string;
  compartidas: string;
  fecha_inicio: string;
  fecha_fin: string;
  fil_estatus: string;
  fil_empresa: string;
  fil_asesor: string;
  fil_asesor_inactivo: string;
  fil_reubicados: string;
  fil_cancelados: string;
}
interface ResumenEmpresa {
  razon_social: string;
  ventas:VentasEmpresa[];
}

interface VentasDetalladas{
  consecutivo:string;
  fraccionamiento:string;
  nomenclatura:string;
  no_manzana:string;
  no_terreno:string;
  nombre_asesor:string;
  superficie:string;
  mediopublicitario:string;
  nombre_cliente:string;
  tel_cel:string;
  mensualidad_actual:string;
  fecha_contrato:string;
  monto_terreno_actual:string;
  estatus:string;
  financiamiento:string;
  id_contrato:string;
  enganche:string;
  pagado:string;
  mens_pagadas:string;
  mens_pendientes:string;
  fecha_estatus:string;
}

interface DetalladoAsesores{
  nombre_asesor: string;
  ventas: VentasDetalladas[];
}

interface ComisionesStore {
    resumenAsesores: ResumenAsesor[];
    resumenEmpresas: ResumenEmpresa[];
    detallado: DetalladoAsesores[];
    setResumenAsesores: (resumen: ResumenAsesor[]) => void;
    setResumenEmpresas: (resumen: ResumenEmpresa[]) => void;
    setDetallado: (detallado: DetalladoAsesores[]) => void;
}



export const useDetalladoVentasFiltrosConsultaStore = create<ComisionesStore>((set) => ({
    resumenAsesores: [],
    resumenEmpresas: [],
    detallado: [],
    setResumenAsesores: (resultados) => set({ resumenAsesores: resultados }),
    setResumenEmpresas: (resultados) => set({ resumenEmpresas: resultados }),
    setDetallado: (resultados) => set({ detallado: resultados }),
}));

