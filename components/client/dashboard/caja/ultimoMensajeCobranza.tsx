"use client";
import { useEffect, useState } from "react";

interface Mensaje {
    comentario: string | null;
    fecha_compromiso: string | null;
    usuario: string | null;
}
interface UltimoMensajeCobranzaProps {
    idContrato: number;
}

export default function UltimoMensajeCobranza({ idContrato }: UltimoMensajeCobranzaProps) {
    const [mensaje, setMensaje] = useState<Mensaje[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/detallesContrato/ultimoMensajeCobranza?idContrato=${idContrato}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setMensaje(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [idContrato]);
    return (
        <>
            {mensaje && mensaje.length > 0 ? (
                <>
                    <div className="container mx-auto px-4 py-3 bg-card text-card-foreground rounded-lg shadow-md border border-border">
                        <div className="grid gap-2">
                            {" "}
                            {/* Reducimos el gap si los elementos son cortos */}
                            <div className="space-y-1">
                                {" "}
                                {/* Agregamos espacio vertical entre los spans */}
                                <p className="text-sm font-semibold text-muted-foreground uppercase">
                                    Cobranza:{" "}
                                    <span className="text-sm font-normal text-destructive line-clamp-3 hover:line-clamp-none transition-all duration-1400 ease-in-out">
                                        {mensaje[0]?.comentario}
                                    </span>
                                </p>
                                <p className="text-sm font-semibold text-muted-foreground uppercase">
                                    Fecha Compromiso:{" "}
                                    <span className="text-sm font-normal text-foreground">{mensaje[0]?.fecha_compromiso}</span>
                                </p>
                                <p className="text-sm font-semibold text-muted-foreground uppercase">
                                    Usuario: <span className="text-sm font-normal text-foreground">{mensaje[0]?.usuario}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* <div className="container mx-auto px-4 py-3 bg-card text-card-foreground rounded-lg shadow-md border border-border">
                        <div className="grid gap-2">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-muted-foreground uppercase">NO HAY MENSAJE DE COBRANZA: </p>
                            </div>
                        </div>
                    </div> */}
                </>
            )}
        </>
    );
}
