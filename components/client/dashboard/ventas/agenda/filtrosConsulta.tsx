"use client";

import { useListadoCitasStore } from "@/app/store/dashboard/ventas/agenda/listadoCitasStore";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import moment from "moment";

interface FiltrosConsultaProps {
    id_usuario: string | undefined | null;
    perfil_usuario: string | undefined | null;
}

export default function FiltrosConsultaComisiones({ id_usuario, perfil_usuario }: FiltrosConsultaProps) {
    // const tablaResumen = useListadoCitasStore((state: { setResumen: any }) => state.setResumen);
    const { listadoCitas, setListadoCitas } = useListadoCitasStore();
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    useEffect(() => {
        datos();
    }, [date]);

    const datos = () => {
        if (!date) {
            setDate(new Date());
        }
        const fecha = moment(date).format("DD/MM/YYYY");
        const fetchResumen = async () => {
            try {
                const response = await fetch(
                    `/api/dashboard/ventas/agenda/listarCitas?fecha=${fecha}&idUsuario=${id_usuario}&perfil=${perfil_usuario}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setListadoCitas(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchResumen();
    };

    return (
        <>
            <div className="flex justify-center items-center">
                <Calendar mode="single" selected={date} onSelect={setDate} locale={es} numberOfMonths={1} className="rounded-md border" />
            </div>
            <Separator className="my-4 size-1 bg-white" />
        </>
    );
}
