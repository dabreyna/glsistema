"use client";
import { useEffect, useState } from "react";

interface Mensaje {
    comentario: string | null;
    fecha_comentario: string | null;
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
                const response = await fetch(`/api/dashboard/detallesContrato/ultimoMensajeCaja?idContrato=${idContrato}`);
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
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-muted-foreground uppercase">
                                    Caja:{" "}
                                    <span className="text-sm font-normal text-destructive line-clamp-3 hover:line-clamp-none transition-all duration-1400 ease-in-out ">
                                        {mensaje[0]?.comentario}{" "}
                                    </span>
                                </p>
                                <p className="text-sm font-semibold text-muted-foreground uppercase">
                                    Fecha: <span className="text-sm font-normal text-foreground">{mensaje[0]?.fecha_comentario}</span>
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
                                <p className="text-sm font-semibold text-muted-foreground uppercase">NO HAY MENSAJE EN CAJA: </p>
                            </div>
                        </div>
                    </div> */}
                </>
            )}
        </>
    );
}
