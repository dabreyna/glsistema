"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import moment from "moment";
import "moment/locale/es";
import { useEffect, useState } from "react";

export const description = "A bar chart with a custom label";

const chartConfig = {
    DESKTOP: {
        label: "Ventas",
        color: "bg-rose-500",
    },
    MOBILE: {
        label: "Ventas",
        color: "bg-rose-500",
    },
    nombre_completo: {
        label: "Ventas",
        color: "bg-rose-500",
    },
    vendedor: {
        label: "Ventas",
        color: "bg-rose-500",
    },
    ventas: {
        color: "bg-rose-500",
    },
} satisfies ChartConfig;

export default function GraficoVentasDashboard() {
    const [dataGrafico, setDataGrafico] = useState<any>(null); // Initialize with null
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/dashboard/graficaVentasMes");
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }
                const data = await response.json();
                setDataGrafico(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const fechaActual = moment().locale("es");
    const fechaMesActual = fechaActual.format("MMMM YYYY");
    return (
        <Card className="xl:col-span-2 themes-wrapper group relative flex flex-col overflow-hidden rounded-xl border shadow transition-all duration-200 ease-in-out hover:z-30">
            <CardHeader>
                <CardTitle>Ventas del Mes</CardTitle>
                <CardDescription>{fechaMesActual}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[400px]">
                    <BarChart
                        accessibilityLayer
                        data={dataGrafico}
                        layout="vertical"
                        compact={false}
                        barSize={30}
                        margin={{
                            left: 20,
                        }}
                    >
                        <CartesianGrid horizontal={true} />
                        <YAxis
                            dataKey="nombre_completo"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={true}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="ventas" type="number" />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="ventas" layout="vertical" fill="bg-rose-500" radius={4}>
                            <LabelList
                                dataKey="nombre_completo" // Change this to the appropriate data key for your chart
                                position="insideLeft"
                                offset={8}
                                className="fill-white"
                                fontSize={12}
                            />
                            <LabelList dataKey="ventas" position="right" offset={8} className="bg-rose-500" fontSize={14} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className="flex gap-2 font-medium leading-none">
          Tendiendo al alza un 5.2% este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Comparado al total de (65) ventas del mes anterior
        </div> */}
            </CardFooter>
        </Card>
    );
}
