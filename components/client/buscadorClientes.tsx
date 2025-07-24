"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContratoSelectedStore } from "@/app/store/dashboard/detallesContrato/contratoSelectedStore";

export function BuscadorClientes() {
  const [nombreCliente, setNombreCliente] = useState("");
  const router = useRouter();

  const handleBuscarCliente = (event: React.FormEvent) => {
    event.preventDefault();
    const encodedNombreCliente = encodeURI(nombreCliente);
    //router.replace(`buscarCliente?nombreCliente=${encodedNombreCliente}`);
    // router.replace(
    //   `/private/dashboard/buscarCliente?nombreCliente=${encodedNombreCliente}`
    // );
    router.push(
      `/private/dashboard/buscarCliente?nombreCliente=${encodedNombreCliente}`
    );

    setNombreCliente("");
  };
  const seleccionaContrato = useContratoSelectedStore((state) => state.setContrato);
  const seleccionaCliente = useContratoSelectedStore((state) => state.setCliente);
  seleccionaCliente("");
  seleccionaContrato("");

  return (
    <>
      <form onSubmit={handleBuscarCliente} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="nombreCliente"
          placeholder="Buscar Cliente.."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          value={nombreCliente}
          onChange={(event) => setNombreCliente(event.target.value)}
        />
      </form>
    </>
  );
}
