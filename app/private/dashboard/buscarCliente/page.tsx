import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import * as React from "react";

import { Resultados } from "./resultados";
export default async function BuscarClientePage() {
  const session = await auth();
  if (!session) {
    redirect("/sistema");
  }

  return (
    <>
      <div className="mx-auto grid  flex-1 auto-rows-max gap-4 w-full">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-2 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-0-chunk-0">
              <CardHeader>
                <CardTitle>Resultados</CardTitle>
                <CardDescription>texto pendiente</CardDescription>
              </CardHeader>
              <CardContent>
                <Resultados />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
