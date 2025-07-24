"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Separator } from "@/components/ui/separator"

type Beneficiario={
    id_beneficiario :any;
    abreviatura :string |null;
    nombre :string;
    ap_paterno :string |null;
    ap_materno? :string |null;
    fecha_nacimiento :string |null;
    lugar_nacimiento? :string |null;
    ocupacion? :string |null;
    calle? :string |null;
    numero? :any |null; 
    entre? :string |null;
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
    conyuge? :any |null;
    estado_civil? :any |null;
    nacionalidad? :any |null;
    parentesco? :string |null;
  }
  interface BeneficiarioProps{
    beneficiario:Beneficiario|any;
    onGuardar:(newData:Beneficiario[])=>void;
  }
  const FormSchema = z.object({
    id_beneficiario:z.union([ 
        z.string().min(4,),
        z.number().min(4), // Ajusta el mínimo según tus necesidades

    ]).optional(),
    abreviatura: z.enum(['SR.','SRA.','SRTA.']),
    nombre: z.string().toUpperCase().min(2, {message: "Nombre muy corto, por favor revisa la informacion.",}),
    ap_paterno: z.string().toUpperCase().min(2, {message: "Apellido muy corto, por favor revisa la informacion.",}),
    ap_materno: z.string().toUpperCase().min(2, {message: "Apellido muy corto, por favor revisa la informacion.",}).optional().nullable(),
    fecha_nacimiento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Fecha debe tener formato DD/MM/YYYY'),
    lugar_nacimiento: z.string().min(2, {message: "Nombre muy corto, por favor revisa la informacion.",}).optional(),
    ocupacion:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    calle:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    numero:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional(),
    entre:z.string().min(2, {message: "Texto muy corto, por favor revisa la informacion.",}).optional().nullable(),
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
    conyuge:z.string().min(5, {message: "Nombre muy corto, por favor revisa la informacion.",}).optional().nullable(),
    estado_civil:z.enum(['SOLTERO','CASADO','DIVORCIADO','VIUDO']).optional(),
    nacionalidad:z.enum(['MX','EXT']).optional(),
    parentesco:z.string().min(4, {message: "Texto muy corto, por favor revisa la informacion.",}).optional().nullable(),
  })

export function EditarBeneficiario({beneficiario,onGuardar}:BeneficiarioProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          id_beneficiario:beneficiario.id_beneficiario,
          abreviatura: beneficiario.abreviatura,
          nombre:beneficiario.nombre,
          ap_paterno:beneficiario.ap_paterno,
          ap_materno:beneficiario.ap_materno,
          fecha_nacimiento:beneficiario.fecha_nacimiento,
          lugar_nacimiento:beneficiario.lugar_nacimiento,
          ocupacion:beneficiario.ocupacion,
          calle:beneficiario.calle,
          numero:beneficiario.numero,
          entre:beneficiario.entre,
          ciudad:beneficiario.ciudad,
          cp:beneficiario.cp,
          colonia:beneficiario.colonia,
          estado:beneficiario.estado,
          pais:beneficiario.pais,
          tel_cod_casa:beneficiario.tel_cod_casa,
          tel_casa:beneficiario.tel_casa,
          tel_cod_cel:beneficiario.tel_cod_cel,
          tel_cel:beneficiario.tel_cel,
          tel_cod_trabajo:beneficiario.tel_cod_trabajo,
          tel_trabajo:beneficiario.tel_trabajo,          
          email:beneficiario.email,
          lugar_trabajo:beneficiario.lugar_trabajo,
          conyuge:beneficiario.conyuge,
          estado_civil:beneficiario.estado_civil,
          nacionalidad:beneficiario.nacionalidad,
          parentesco:beneficiario.parentesco,
        },
      })

      function onSubmit(data: z.infer<typeof FormSchema>) {
        const newData:Beneficiario[]=[
            {
              id_beneficiario: data.id_beneficiario,
              abreviatura: data.abreviatura,
              nombre: data.nombre,
              ap_paterno: data.ap_paterno,
              ap_materno: data.ap_materno,
              fecha_nacimiento: data.fecha_nacimiento,
              lugar_nacimiento: data.lugar_nacimiento,
              ocupacion: data.ocupacion,
              calle: data.calle,
              numero: data.numero,
              entre: data.entre,
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
              conyuge: data.conyuge,
              estado_civil: data.estado_civil,
              nacionalidad: data.nacionalidad,
              parentesco: data.parentesco,
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
          <SheetTitle>Editar Beneficiario</SheetTitle>
          <SheetDescription>
            Ten cuidado al modificar los datos, no olvides guardar o puedes perder los cambios.
            <Separator className="my-4" />
          </SheetDescription>
        </SheetHeader>

                <div className="grid gap-4 py-4">
                    {/* <input type="hidden" name="id_copropietario" value={copropietario?.id_copropietario}/> */}
                    <FormField
                        control={form.control}
                        name="id_beneficiario"
                        render={({ field }) => (
                            <FormItem className="hidden">
                            <FormLabel></FormLabel>
                            <FormControl>
                                <Input placeholder={beneficiario.id_copropietario} {...field} className="hidden"/>
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
                                        <SelectValue placeholder={beneficiario.abreviatura} />
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
                                <Input placeholder={beneficiario.nombre} {...field} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.ap_paterno} {...field} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.ap_materno ? beneficiario.ap_materno : ''} {...(beneficiario.ap_materno && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.fecha_nacimiento} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
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
                                <Input placeholder={beneficiario.lugar_nacimiento} {...field} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.ocupacion} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="calle"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Calle</FormLabel>
                            <FormControl>
                                <Input placeholder={beneficiario.calle} {...field} className="h-6 border border-gray-300"/>
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
                        name="numero"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Numero</FormLabel>
                            <FormControl>
                                <Input placeholder={beneficiario.numero} {...field} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="entre"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Entre</FormLabel>
                            <FormControl>
                                <Input placeholder={beneficiario.entre ? beneficiario.entre : ''} {...(beneficiario.entre && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.ciudad} {...field} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.cp} {...field} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.colonia} {...field} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.estado} {...field} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.pais} {...field} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.tel_cod_casa ? beneficiario.tel_cod_casa : ''} {...(beneficiario.tel_cod_casa && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.tel_casa ? beneficiario.tel_casa : ''} {...(beneficiario.tel_casa && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.tel_cod_cel ? beneficiario.tel_cod_cel : ''} {...(beneficiario.tel_cod_cel && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.tel_cel ? beneficiario.tel_cel : ''} {...(beneficiario.tel_cel && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.tel_cod_trabajo ? beneficiario.tel_cod_trabajo : ''} {...(beneficiario.tel_cod_trabajo && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.tel_trabajo ? beneficiario.tel_trabajo : ''} {...(beneficiario.tel_trabajo && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.email ? beneficiario.email : ''} {...(beneficiario.email && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.lugar_trabajo ? beneficiario.lugar_trabajo : ''} {...(beneficiario.lugar_trabajo && field)} className="h-6 border border-gray-300"/>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="parentesco"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                            <FormLabel>Parentesco</FormLabel>
                            <FormControl>
                                <Input placeholder={beneficiario.parentesco ? beneficiario.parentesco : ''} {...(beneficiario.parentesco && field)} className="h-6 border border-gray-300"/>
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
                                <Input placeholder={beneficiario.conyuge ? beneficiario.conyuge : ''} {...(beneficiario.conyuge && field)} className="h-6 border border-gray-300"/>
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
                                        <SelectValue placeholder={beneficiario.estado_civil}/>
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
                                        <SelectValue placeholder={beneficiario.nacionalidad} />
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