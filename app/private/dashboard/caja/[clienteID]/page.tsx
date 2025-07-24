import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCliente } from "@/lib/clientes/cliente";
import { getContratosPorIdClienteOrdenados } from "@/lib/contratos/contrato";
import Caja from "@/components/client/dashboard/caja/caja";

interface Usuario {
    email?: string | null;
    perfil_usuario?: string;
    nombre?: string;
    id_usuario?: string;
}

export default async function CajaPage({ params }: { params: { clienteID: string } }) {
    const session = await auth();
    if (!session) {
        redirect("/sistema");
    }

    const cliente = await getCliente(params.clienteID);
    const contratos = await getContratosPorIdClienteOrdenados(params.clienteID);
    const DatosUsuario: Usuario = { ...session.user };
    return (
        <>
            <div className="mx-auto grid  flex-1 auto-rows-max gap-4 w-full">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-8 ">
                    <Caja ContratosLista={contratos} DatosUsuario={DatosUsuario} Cliente={cliente} />
                </div>
            </div>
        </>
    );
}
