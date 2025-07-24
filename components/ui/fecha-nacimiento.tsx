"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
// import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DatePickerProps {
    startYear?: number;
    endYear?: number;
    onDateChange: (date: Date | undefined) => void; // Callback para enviar la fecha al componente padre
    initialDate?: Date; // Prop para la fecha inicial (opcional)
}

export function FechaNacimiento({
    startYear = getYear(new Date()) - 120,
    endYear = getYear(new Date()) - 18,
    onDateChange,
    initialDate,
}: DatePickerProps) {
    const hoy = new Date(); // Obtiene la fecha actual
    const hace18Anos = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    // const [date, setDate] = React.useState<Date>(hace18Anos);
    console.log(initialDate);
    const [date, setDate] = React.useState<Date>(initialDate ? initialDate : hace18Anos);
    // if (initialDate) {
    //     setDate(initialDate);
    // }

    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

    const handleMonthChange = (month: string) => {
        const newDate = setMonth(date, months.indexOf(month));
        setDate(newDate);
    };

    const handleYearChange = (year: string) => {
        const newDate = setYear(date, parseInt(year));
        setDate(newDate);
    };

    const handleSelect = (selectedData: Date | undefined) => {
        if (selectedData) {
            setDate(selectedData);
        }
        onDateChange(selectedData);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("w-[250px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "LLL dd,y", { locale: es }) : <span>Elige el dia</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="flex justify-between p-2">
                    <Select onValueChange={handleMonthChange} value={months[getMonth(date)]}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleYearChange} value={getYear(date).toString()}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    month={date}
                    // onMonthChange={setDate}
                    // onDayClick={handleSelect}
                    onDayBlur={setDate}
                />
            </PopoverContent>
        </Popover>
    );
}
