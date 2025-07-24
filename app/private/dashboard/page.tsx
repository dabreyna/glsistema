import { auth } from "@/auth";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import GraficoVentasDashboard from "@/components/client/dashboard/graficoVentas";
import ListadoVentasRecientesDashboard from "@/components/client/dashboard/listadoVentasRecientes";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/sistema");
  }

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
          <GraficoVentasDashboard />
          <Card x-chunk="dashboard-01-chunk-5" className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Ventas Recientes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <ListadoVentasRecientesDashboard />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
