import { create } from "zustand";


type FraccionamientoStore = {
  idFraccionamiento: string | null;
  nombre: string | null;
  setFraccionamiento: (fraccionamiento_id: string) => void;
  setNombre: (nombreFraccionamiento: string) => void;
}


export const useFraccionamientoSelectedStore = create<FraccionamientoStore>((set) => ({
  idFraccionamiento: null,
  nombre: null,
  setFraccionamiento: (fraccionamiento_id: string) => set({ idFraccionamiento: fraccionamiento_id }),
  setNombre: (nombreFraccionamiento: string) => set({ nombre: nombreFraccionamiento }),
}));

