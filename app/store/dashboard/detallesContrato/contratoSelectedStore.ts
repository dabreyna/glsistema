import { create } from "zustand";



type ContratoStore = {
  idCliente: string | null;
  idContrato: string | null;
  idTerreno: string | null;
  setContrato: (contrato_id: string) => void;
  setCliente: (cliente_id: string) => void;
  setTerreno: (terreno_id: string) => void;
}
// interface Contrato{
//   idContrato:string | null
//   seleccionaContrato: (contrato_id: string) => void;
// }

export const useContratoSelectedStore = create<ContratoStore>((set) => ({
  idCliente: null,
  idContrato: null,
  idTerreno: null,
  // setCliente: (cliente_id: string) => set((state) => ({ idCliente: cliente_id })),
  // setContrato: (contrato_id: string) => set((state) => ({ idContrato: contrato_id })),
  setCliente: (cliente_id: string) => set({ idCliente: cliente_id }),
  setContrato: (contrato_id: string) => set({ idContrato: contrato_id }),
  setTerreno: (terreno_id: string) => set({ idTerreno: terreno_id }),

  // seleccionaContrato: (contrato_id: string) => set({ idContrato: contrato_id }),
  // seleccionaCliente: (cliente_id: string) => set({ idCliente: cliente_id }),
}));

