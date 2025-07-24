import {z} from "zod";

export const LoginSchema = z.object({
    username: z.string().min(3,{message:"minimo 3 caracteres"}).toLowerCase(),
    password: z.string().min(3,{message:"minimo 3 caracteres"}),
    // sucursal: z.string().min(1,{message:"debes elegir una sucursal"})
});