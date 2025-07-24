"use client";
// import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import BtnTerminarVenta from "./btnTerminarVenta";

interface ReferenciaProps {
    idContrato: string;
    // listaMediosPublicitarios: MedioPublicitario[];
    idUsuario: string;
    idTerreno: string;
    idCliente: string;
}

export default function Requisitos({ idContrato, idUsuario, idTerreno, idCliente }: ReferenciaProps) {
    const { toast } = useToast();
    // const router = useRouter();
    const [identificacionFrente, setIdentificacionFrente] = useState<string>("");
    const [identificacionReverso, setIdentificacionReverso] = useState<string>("");
    const [comprobanteDomicilio, setComprobanteDomicilio] = useState<string>("");
    const [croquisUbicacion, setCroquisUbicacion] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedInput, setSelectedInput] = useState<string>("");
    const [uploading, setUploading] = useState(false); // Track upload state

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const f = event.target.id;
        console.log(f);
        setSelectedInput(f);
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSave = async (documento: string) => {
        if (!selectedFile || selectedInput != documento) {
            alert("Por favor selecciona un archivo para subir."); // Basic error handling
            return;
        }

        setUploading(true); // Set uploading state to true
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("idCliente", idCliente);
        formData.append("idContrato", idContrato);
        formData.append("documento", documento);
        formData.append("idTerreno", idTerreno);

        try {
            const response = await fetch("/api/dashboard/utilerias/documentos/cargaArchivo", {
                // Corrected path
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("---->" + data.Message); // Log the response from the API
                // setIdentificacionFrente(selectedFile.name); // Update the displayed filename
                if (documento === "identificacionFrente") {
                    setIdentificacionFrente(data.Message); // Update the displayed filename
                } else if (documento === "identificacionReverso") {
                    setIdentificacionReverso(data.Message); // Update the displayed filename
                } else if (documento === "comprobanteDomicilio") {
                    setComprobanteDomicilio(data.Message); // Update the displayed filename
                } else if (documento === "croquisUbicacion") {
                    setCroquisUbicacion(data.Message); // Update the displayed filename
                }
                alert("Archivo guardado correctamente"); // Provide user feedback
            } else {
                const errorData = await response.json();
                // console.error("Upload failed:", errorData);
                alert("No se pudo guardar el archivo.");
            }
        } catch (error) {
            // console.error("Ocurrio un error al subir el archivo:", error);
            alert("Ocurrio un error al subir el archivo:");
        } finally {
            setUploading(false); // Reset uploading state
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Table>
                        <TableCaption></TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Requisito</TableHead>
                                <TableHead>Carga de documentos</TableHead>
                                <TableHead>Archivo</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Identificación Oficial (Frente)</TableCell>
                                <TableCell>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="identificacionFrente">Documento</Label>
                                        <Input
                                            id="identificacionFrente"
                                            type="file"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                            placeholder="Selecciona un archivo"
                                        />
                                        <Button
                                            variant="default"
                                            onClick={() => handleSave("identificacionFrente")}
                                            disabled={uploading} // Disable button during upload
                                            className="max-w-[100px]"
                                            size={"sm"}
                                            id="btnSubirIdentificacionFrente"
                                        >
                                            {uploading ? "Uploading..." : "Subir"} {/* Conditional button text */}
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{identificacionFrente}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Identificación Oficial (Reverso)</TableCell>
                                <TableCell>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="identificacionReverso">Documento</Label>
                                        <Input
                                            id="identificacionReverso"
                                            type="file"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                            placeholder="Selecciona un archivo"
                                        />
                                        <Button
                                            variant="default"
                                            onClick={() => handleSave("identificacionReverso")}
                                            disabled={uploading} // Disable button during upload
                                            className="max-w-[100px]"
                                            size={"sm"}
                                        >
                                            {uploading ? "Uploading..." : "Subir"} {/* Conditional button text */}
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{identificacionReverso}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Comprobante de Domicilio</TableCell>
                                <TableCell>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="comprobanteDomicilio">Documento</Label>
                                        <Input
                                            id="comprobanteDomicilio"
                                            type="file"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                            placeholder="Selecciona un archivo"
                                        />
                                        <Button
                                            variant="default"
                                            onClick={() => handleSave("comprobanteDomicilio")}
                                            disabled={uploading} // Disable button during upload
                                            className="max-w-[100px]"
                                            size={"sm"}
                                        >
                                            {uploading ? "Uploading..." : "Subir"} {/* Conditional button text */}
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{comprobanteDomicilio}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Croquis de ubicacion</TableCell>
                                <TableCell>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="picture">Documento</Label>
                                        <Label htmlFor="croquisUbicacion">Documento</Label>
                                        <Input
                                            id="croquisUbicacion"
                                            type="file"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                            placeholder="Selecciona un archivo"
                                        />
                                        <Button
                                            variant="default"
                                            onClick={() => handleSave("croquisUbicacion")}
                                            disabled={uploading} // Disable button during upload
                                            className="max-w-[100px]"
                                            size={"sm"}
                                        >
                                            {uploading ? "Uploading..." : "Subir"} {/* Conditional button text */}
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{croquisUbicacion}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <BtnTerminarVenta idCliente={idCliente} idContrato={idContrato} />
                </CardFooter>
            </Card>
        </>
    );
}
