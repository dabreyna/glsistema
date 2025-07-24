import { create } from "zustand";

type PolizaStore = {
  idPoliza: string;
  setPoliza: (poliza_id: string) => void;

}

export const usePolizaSelectedStore = create<PolizaStore>((set) => ({
  idPoliza: "",
  setPoliza: (poliza_id: string) => set({ idPoliza: poliza_id }),
}));

