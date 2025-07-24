import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      perfil_usuario?: string,
      nombre?: string,
      id_usuario?: string,
    } & DefaultSession["user"];
  }

  interface User {
    perfil_usuario?: string,
    nombre?: string,
    id_usuario?: string,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    perfil_usuario?: string,
    nombre?: string,
    id_usuario?: string,
  }
}