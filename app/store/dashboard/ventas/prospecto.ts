import { create } from "zustand";

interface Prospecto {
  id_cliente: string | null;
  abreviatura: string | null;
  nombre: string | null;
  ap_paterno: string | null;
  ap_materno: string | null;
  fecha_nacimiento: string | null;
  sexo: string | null;
  lugar_nacimiento: string | null;
  ocupacion: string | null;
  calle: string | null;
  numero: string | null;
  entre: string | null;
  ciudad: string | null;
  cp: string | null;
  colonia: string | null;
  estado: string | null;
  pais: string | null;
  tel_cod_casa: string | null;
  tel_casa: string | null;
  tel_cod_cel: string | null;
  tel_cel: string | null;
  tel_cod_trabajo: string | null;
  tel_trabajo: string | null;
  email: string | null;
  lugar_trabajo: string | null;
  domicilio_trabajo: string | null;
  conyuge: string | null;
  estado_civil: string | null;
  nacionalidad: string | null;
  fecha_alta: string | null;
  id_usuario: string | null;
  ultima_modificacion: string | null;
  id_estatus_prospecto: string | null;
  bnd_interesado_prospecto: string | null;
  id_medio_publicitario: string | null;
  tel_usa_cel: string | null;
  tel_usa_casa: string | null;
  tel_usa_oficina: string | null;
  notas: string | null;
  fecha_correo: string | null;
  id_asesor_cobranza: string | null;
}

interface Copropietario  {
  id_copropietario: string | null;
  abreviatura: string | null;
  nombre: string | null;
  ap_paterno: string | null;
  ap_materno: string | null;
  fecha_nacimiento: string | null;
  sexo: string | null;
  lugar_nacimiento: string | null;
  ocupacion: string | null;
  calle: string | null;
  numero: string | null;
  ciudad: string | null;
  cp: string | null;
  colonia: string | null;
  estado: string | null;
  pais: string | null;
  tel_cod_casa: string | null;
  tel_casa: string | null;
  tel_cod_cel: string | null;
  tel_cel: string | null;
  tel_cod_trabajo: string | null;
  tel_trabajo: string | null;
  email: string | null;
  lugar_trabajo: string | null;
  domicilio_trabajo: string | null;
  conyuge: string | null;
  estado_civil: string | null;
  nacionalidad: string | null;
  bnd_permiso: string | null;
  bnd_principal: string | null;
  notas: string | null;
};

interface Beneficiario{
  id_beneficiario :string | null;
  abreviatura :string |null;
  nombre :string | null;
  ap_paterno :string |null;
  ap_materno? :string |null;
  fecha_nacimiento :string |null;
  lugar_nacimiento? :string |null;
  ocupacion? :string |null;
  calle? :string |null;
  numero? :string |null; 
  entre? :string |null;
  ciudad? :string |null;
  cp? :string |null;
  colonia? :string |null;
  estado? :string |null;
  pais? :string |null;
  tel_cod_casa? :string |null;
  tel_casa? :string |null;
  tel_cod_cel? :string |null;
  tel_cel? :string |null;
  tel_cod_trabajo? :string |null;
  tel_trabajo? :string |null;
  email? :string |null;
  lugar_trabajo? :string |null;
  conyuge? :string |null;
  estado_civil? :string |null;
  nacionalidad? :string |null;
  parentesco? :string |null;
}

interface Venta{
  prospecto:Prospecto |null;
  copropietarios:Copropietario[];
  beneficiarios:Beneficiario[];
  setProspecto: (prospecto:Prospecto) => void;
  setCopropietarios: (copropietario:Copropietario) => void;
  setBeneficiarios: (beneficiario:Beneficiario) => void;
}

export const useVentaStore = create<Venta>((set) => ({
  prospecto:null,
  copropietarios:[],
  beneficiarios:[],
  
  setProspecto: (prospecto:Prospecto) => set({ prospecto}),
  //setProspecto: (prospecto:Prospecto) => set((state) => ({ prospecto: [...state.prospecto, prospecto] })),
  setCopropietarios: (copropietario:Copropietario) => set((state) => ({ copropietarios: [...state.copropietarios, copropietario] })),
  setBeneficiarios: (beneficiario:Beneficiario) => set((state) => ({ beneficiarios: [...state.beneficiarios, beneficiario] })),
}));

