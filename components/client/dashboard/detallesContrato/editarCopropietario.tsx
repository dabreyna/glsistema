"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
// import {Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { Sheet,SheetClose,SheetContent,SheetDescription,SheetFooter,SheetHeader,SheetTitle,SheetTrigger,} from "@/components/ui/sheet"
import { Pencil, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

type Copropietario={
    id_copropietario :any;
    abreviatura :string |null;
    nombre :string;
    ap_paterno :string |null;
    ap_materno? :string |null;
    fecha_nacimiento :string |null;
    sexo :string |null;
    lugar_nacimiento? :string |null;
    ocupacion? :string |null;
    calle? :string |null;
    numero? :any |null; 
    ciudad? :string |null;
    cp? :any |null;
    colonia? :string |null;
    estado? :string |null;
    pais? :string |null;
    tel_cod_casa? :any |null;
    tel_casa? :any |null;
    tel_cod_cel? :any |null;
    tel_cel? :any |null;
    tel_cod_trabajo? :any |null;
    tel_trabajo? :any |null;
    email? :any |null;
    lugar_trabajo? :any |null;
    domicilio_trabajo? :any |null;
    conyuge? :any |null;
    estado_civil? :any |null;
    nacionalidad? :any |null;
    bnd_permiso? :boolean |null;
    bnd_principal? :boolean |null;
  }
  interface CopropietarioProps{
    copropietario:Copropietario|any;
    onGuardar:(newData:Copropietario[])=>void;
  }
  const FormSchema = z.object({
    id_copropietario:z.union([ 
        z.string().min(4, { message: "Código Postal muy corto, por favor revisa la información." }),
        z.number().min(4), // Ajusta el mínimo según tus necesidades

    ]).optional(),
    abreviatura: z.enum(['SR.','SRA.','SRTA.']),
    nombre: z.string().toUpperCase().min(2, {message: "Nombre muy corto, por favor revisa la informacion.",}),
    ap_paterno: z.string().toUpperCase().min(2, {message: "Apellido muy corto, por favor revisa la informacion.",}),
    ap_materno: z.string().toUpperCase().min(2, {message: "Apellido muy corto, por favor revisa la informacion.",}).optional(),
    fecha_nacimiento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Fecha debe tener formato DD/MM/YYYY'),
    sexo:z.enum(['M','F']),
    lugar_nacimiento: z.string().min(2, {message: "Nombre muy corto, por favor revisa la informacion.",}).optional(),
    ocupacion:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    calle:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    numero:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    ciudad:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    cp: z.union([
        z.string().min(4, { message: "Código Postal muy corto, por favor revisa la información." }),
        z.number().min(4), // Ajusta el mínimo según tus necesidades
      ]).optional(),
    colonia:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    estado:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    pais:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    tel_cod_casa:z.union([
        z.string(),
        z.number(), // Ajusta el mínimo según tus necesidades
      ]).optional().nullable(),
    tel_casa:z.union([
        z.string(),
        z.number(),
      ]).optional().nullable(),
    tel_cod_cel:z.union([
        z.string(),
        z.number(),
      ]).optional().nullable(),
    tel_cel:z.union([
        z.string(),
        z.number(),
      ]).optional().nullable(),
    tel_cod_trabajo:z.union([
        z.string().min(4, { message: "Numero muy corto, por favor revisa la información." }),
        z.number().min(4), // Ajusta el mínimo según tus necesidades
      ]).optional().nullable(),
    tel_trabajo:z.union([
        z.string().min(4, { message: "Numero muy corto, por favor revisa la información." }),
        z.number().min(4), // Ajusta el mínimo según tus necesidades
      ]).optional().nullable(),
    email:z.string().email({message: "Email no valido"}).optional().nullable(),
    lugar_trabajo:z.string().min(4, {message: "Texto muy corto, por favor revisa la informacion.",}).optional().nullable(),
    domicilio_trabajo:z.string().min(5, {message: "Texto muy corto, por favor revisa la informacion.",}).optional().nullable(),
    conyuge:z.string().min(5, {message: "Nombre muy corto, por favor revisa la informacion.",}).optional().nullable(),
    estado_civil:z.enum(['SOLTERO','CASADO','DIVORCIADO','VIUDO']).optional(),
    nacionalidad:z.enum(['MX','EXT']).optional(),
    bnd_permiso: z.boolean().default(false).optional(),
    bnd_principal:z.boolean().default(false).optional(),
  })

export function EditarCopropietario({copropietario,onGuardar}:CopropietarioProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          id_copropietario:copropietario.id_copropietario,
          abreviatura: copropietario.abreviatura,
          nombre:copropietario.nombre,
          ap_paterno:copropietario.ap_paterno,
          ap_materno:copropietario.ap_materno,
          fecha_nacimiento:copropietario.fecha_nacimiento,
          sexo:copropietario.sexo,
          lugar_nacimiento:copropietario.lugar_nacimiento,
          ocupacion:copropietario.ocupacion,
          calle:copropietario.calle,
          numero:copropietario.numero,
          ciudad:copropietario.ciudad,
          cp:copropietario.cp,
          colonia:copropietario.colonia,
          estado:copropietario.estado,
          pais:copropietario.pais,
          tel_cod_casa:copropietario.tel_cod_casa,
          tel_casa:copropietario.tel_casa,
          tel_cod_cel:copropietario.tel_cod_cel,
          tel_cel:copropietario.tel_cel,
          tel_cod_trabajo:copropietario.tel_cod_trabajo,
          tel_trabajo:copropietario.tel_trabajo,          
          email:copropietario.email,
          lugar_trabajo:copropietario.lugar_trabajo,
          domicilio_trabajo:copropietario.domicilio_trabajo,
          conyuge:copropietario.conyuge,
          estado_civil:copropietario.estado_civil,
          nacionalidad:copropietario.nacionalidad,
          bnd_permiso:copropietario.bnd_permiso,
          bnd_principal:copropietario.bnd_principal

        },
      })

      function onSubmit(data: z.infer<typeof FormSchema>) {
        const newData:Copropietario[]=[
            {
              id_copropietario: data.id_copropietario,
              abreviatura: data.abreviatura,
              nombre: data.nombre,
              ap_paterno: data.ap_paterno,
              ap_materno: data.ap_materno,
              fecha_nacimiento: data.fecha_nacimiento,
              sexo: data.sexo,
              lugar_nacimiento: data.lugar_nacimiento,
              ocupacion: data.ocupacion,
              calle: data.calle,
              numero: data.numero,
              ciudad: data.ciudad,
              cp: data.cp,
              colonia: data.colonia,
              estado: data.estado,
              pais: data.pais,
              tel_cod_casa: data.tel_cod_casa,
              tel_casa: data.tel_casa,
              tel_cod_cel: data.tel_cod_cel,              
              tel_cel: data.tel_cel,
              tel_cod_trabajo: data.tel_cod_trabajo,
              tel_trabajo: data.tel_trabajo,          
              email: data.email,
              lugar_trabajo: data.lugar_trabajo,
              domicilio_trabajo: data.domicilio_trabajo,
              conyuge: data.conyuge,
              estado_civil: data.estado_civil,
              nacionalidad: data.nacionalidad,
              bnd_permiso: data.bnd_permiso,
              bnd_principal: data.bnd_principal
            }
        ];
        onGuardar(newData);
      }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button >Editar<Pencil  strokeWidth={2} color="yellow"/> </Button>
      </SheetTrigger>
      <SheetContent className=" md:max-w-[800px] sm:min-w-[430px]">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SheetHeader>
          <SheetTitle>Editar Copropietario</SheetTitle>
          <SheetDescription>
            Ten cuidado al modificar los datos, no olvides guardar o puedes perder los cambios.
            <Separator className="my-4" />
          </SheetDescription>
        </SheetHeader>

                <div className="grid gap-4 py-4">
                    {/* <input type="hidden" name="id_copropietario" value={copropietario?.id_copropietario}/> */}
                    <FormField
                        control={form.control}
                        name="id_copropietario"
                        render={({ field }) => (
                            <FormItem className="hidden">
                            <FormLabel></FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.id_copropietario} {...field} className="hidden"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />    
                    <div className="grid grid-cols-8 items-center gap-4">
                        <FormField 
                            control={form.control}
                            name="abreviatura"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                <FormLabel>Abreviatura</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="h-6 border border-gray-300">
                                        <SelectValue placeholder={copropietario.abreviatura} />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {['SR.', 'SRA.', 'SRTA.'].map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Nombre(s)</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.nombre} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />                    
                        <FormField
                        control={form.control}
                        name="ap_paterno"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Apellido Paterno</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.ap_paterno} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />                    
                        <FormField
                        control={form.control}
                        name="ap_materno"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Apellido Materno</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.ap_materno} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />                    
                    </div>
                    <div className="grid grid-cols-8 items-center gap-4">
                        <FormField
                        control={form.control}
                        name="fecha_nacimiento"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Fecha Nacimiento</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.fecha_nacimiento} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                            control={form.control}
                            name="sexo"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                <FormLabel>Sexo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl>
                                    <SelectTrigger className="h-6 border border-gray-300">
                                        <SelectValue placeholder={copropietario.sexo} />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {['M', 'F'].map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control}
                        name="lugar_nacimiento"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Lugar de Nacimiento</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.lugar_nacimiento} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="ocupacion"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Ocupacion</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.ocupacion} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="grid grid-cols-8 items-center gap-4">
                    <FormField
                        control={form.control}
                        name="calle"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Calle</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.calle} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Numero</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.numero} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="ciudad"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.ciudad} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="cp"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Codigo Postal</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.cp} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />                        
                    </div>
                    <div className="grid grid-cols-8 items-center gap-4">
                    <FormField
                        control={form.control}
                        name="colonia"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Colonia</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.colonia} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.estado} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="pais"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Pais</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.pais} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* <FormField
                        control={form.control}
                        name="cp"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Codigo Postal</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.cp} {...field}/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />                         */}
                    </div>
                    <div className="grid grid-cols-8 items-center gap-4">
                    <FormField
                        control={form.control}
                        name="tel_cod_casa"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                            <FormLabel>Cod.Casa</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.tel_cod_casa ? copropietario.tel_cod_casa : ''} {...(copropietario.tel_cod_casa && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="tel_casa"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                            <FormLabel> Tel.Casa</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.tel_casa ? copropietario.tel_casa : ''} {...(copropietario.tel_casa && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="tel_cod_cel"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                            <FormLabel>Cod.Cel</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.tel_cod_cel ? copropietario.tel_cod_cel : ''} {...(copropietario.tel_cod_cel && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="tel_cel"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                            <FormLabel> Tel.Cel</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.tel_cel ? copropietario.tel_cel : ''} {...(copropietario.tel_cel && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="tel_cod_trabajo"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                            <FormLabel>Cod.Trabajo</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.tel_cod_trabajo ? copropietario.tel_cod_trabajo : ''} {...(copropietario.tel_cod_trabajo && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="tel_trabajo"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                            <FormLabel>Tel.Trabajo</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.tel_trabajo ? copropietario.tel_trabajo : ''} {...(copropietario.tel_trabajo && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.email ? copropietario.email : ''} {...(copropietario.email && field)} className="h-6 border border-gray-300"/>
                                {/* <Input placeholder={copropietario.nombre} {...field} className="h-6 border border-gray-300"/> */}
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />                        
                    </div>
                    <div className="grid grid-cols-8 items-center gap-4">
                    <FormField
                        control={form.control}
                        name="lugar_trabajo"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Lugar de Trabajo</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.lugar_trabajo ? copropietario.lugar_trabajo : ''} {...(copropietario.lugar_trabajo && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="domicilio_trabajo"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Domicilio Trabajo</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.domicilio_trabajo ? copropietario.domicilio_trabajo : ''} {...(copropietario.domicilio_trabajo && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="conyuge"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Conyuge</FormLabel>
                            <FormControl>
                                <Input placeholder={copropietario.conyuge ? copropietario.conyuge : ''} {...(copropietario.conyuge && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                            control={form.control}
                            name="estado_civil"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                <FormLabel>Estado Civil</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl className="h-6 border border-gray-300">
                                    <SelectTrigger>
                                        <SelectValue placeholder={copropietario.estado_civil}/>
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent >
                                        {['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO'].map((option) => (
                                        <SelectItem key={option} value={option} >
                                            {option}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            
                        />
                    </div>
                    <div className="grid grid-cols-8 items-center gap-4">
                    <FormField 
                            control={form.control}
                            name="nacionalidad"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                <FormLabel>Nacionalidad</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="h-6 border border-gray-300">
                                        <SelectValue placeholder={copropietario.nacionalidad} />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {['MX', 'EXT'].map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    <FormField
                        control={form.control}
                        name="bnd_permiso"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                            
                            <FormControl>
                                {/* <Input placeholder={copropietario.domicilio_trabajo} {...field}/> */}
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 border border-gray-300 mt-8"/>
                            </FormControl>
                            <FormLabel>Permiso</FormLabel>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="bnd_principal"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                            
                            <FormControl>
                                {/* <Input placeholder={copropietario.domicilio_trabajo} {...field}/> */}
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 border border-gray-300 mt-8"/>
                            </FormControl>
                            <FormLabel>Principal</FormLabel>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>

                </div>
            
 
        <SheetFooter>
          <SheetClose asChild>
          <Button type="submit" size="lg"> <Save strokeWidth="2"/>Guardar Cambios </Button>
            {/* <Button>Cerrar</Button> */}
          </SheetClose>
        </SheetFooter>
        </form>
        </Form>
      </SheetContent>
    </Sheet>

  )
}