"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {z} from "zod"
import { LoginSchema } from "@/schemas/login.schema"
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
// import { FormError } from "@/components/form-error"
// import { signIn } from "@/auth"
// import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginAction } from "@/app/actions/login.action"

export function LoginForm() {

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
      // sucursal: ""
    }
  });

  // async function onSubmit(values: z.infer<typeof LoginSchema>) {
  //   setError(null);
  //   startTransition(async () => {
  //     const response = await loginAction(values);
  //     // console.log(response)
  //     if (response.error) {
  //       setError(response.error);
  //       setTimeout(() => {
  //         setError(""); // Limpiar el error
  //       }, 3000); // 3 segundos = 3000 milisegundo
  //     } else {
  //       router.push("/private/dashboard");
  //     }
  //   });
  // }
  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError(null);
  
    startTransition(() => {
      // Immediately start the async operation:
      const promise = loginAction(values);
  
      // Update the UI with a loading state or other interim feedback:
      // (e.g., set a loading state, show a spinner)
  
      promise.then(response => {
        if (response.error) {
          setError(response.error);
          setTimeout(() => {
            setError("");
          }, 3000);
        } else {
          router.push("/private/dashboard");
        }
      });
    });
  }

  return (
    <div className="flex min-h-screen w-screen w-full items-center justify-center text-gray-600 bg-gray-50">
      <div className="relative">
    
      <div className="hidden sm:block h-56 w-56 text-rose-300 absolute a-z-10 -left-20 -top-20">
        <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.6) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='none'/><path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5'  strokeWidth='1' stroke='none' fill='currentColor'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)'/></svg>
        </div>
      <div className="hidden sm:block h-28 w-28 text-rose-300 absolute a-z-10 -right-20 -bottom-20">
        <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='b' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.5) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='none'/><path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5'  strokeWidth='1' stroke='none' fill='currentColor'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#b)'/></svg>
      </div>
          {/* <!-- Register --> */}
          <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white shadow-lg px-4">
            <div className="flex-auto p-6">
              {/* <!-- Logo --> */}
              <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                <a href="#" className="flex cursor-pointer items-center gap-2 text-rose-500 no-underline hover:text-rose-500">
                  <span className="flex-shrink-0 text-3xl font-black tracking-tight opacity-100">Grupo Lotificadora</span>
                </a>
              </div>
              {/* <!-- /Logo --> */}
              <h4 className="mb-2 font-medium text-gray-700 xl:text-xl">Por favor ingresa tus datos de acceso</h4>
              {/* <p className="mb-6 text-gray-500">Por favor ingresa tus datos de acceso</p> */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4" action="#" method="POST">
                  <div className="mb-4">
                    {/* <Label htmlFor="email" className="mb-2 inline-block text-xs font-medium uppercase text-gray-700">Usuario</Label> */}
                    {/* <Input type="text" className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-rose-500 focus:bg-white focus:text-gray-600 focus:shadow" id="username" name="email-username" placeholder="ej. dflores" autoFocus /> */}
                    <FormField
                            control={form.control}
                            name="username"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="mb-2 inline-block text-xs font-medium uppercase text-gray-700">Usuario</FormLabel>
                                    <FormControl>
                                    <Input 
                                        {...field}
                                        disabled={isPending}
                                         className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-rose-500 focus:bg-white focus:text-gray-600 focus:shadow" id="username" name="email-username" placeholder="ej. dflores" autoFocus />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                            }
                    />
                  </div>
                  <div className="mb-4">
                    {/* <div className="flex justify-between"> */}
                      {/* <Label className="mb-2 inline-block text-xs font-medium uppercase text-gray-700" htmlFor="password">Contraseña</Label> */}
                    {/* </div> */}
                    {/* <div className="relative flex w-full flex-wrap items-stretch">
                      <Input type="password" id="password" className="relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-rose-500 focus:bg-white focus:text-gray-600 focus:shadow" name="password" placeholder="············" />
                    </div> */}

                    <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                  <div className="flex justify-between">
                                    <FormLabel className="mb-2 inline-block text-xs font-medium uppercase text-gray-700">Contrase&ntilde;a</FormLabel>
                                  </div>
                                    <FormControl>
                                    <div className="relative flex w-full flex-wrap items-stretch">
                                    <Input 
                                        {...field}
                                        // disabled={isPending}
                                        type="password"
                                        className="relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-rose-500 focus:bg-white focus:text-gray-600 focus:shadow" name="password" placeholder="············"  />
                                    </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                            }
                            />


                    <div className="flex justify-between">
                      <Label className="mb-2 inline-block text-xs font-medium uppercase text-gray-700" htmlFor="password"></Label>
                      <a href="auth-forgot-password-basic.html" className="cursor-pointer text-rose-500 no-underline hover:text-rose-500">
                        <small className=" ">Olvidaste tu Contraseña?</small>
                      </a>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="block">
                      {/* <input className="mt-1 mr-2 h-5 w-5 appearance-none rounded border border-gray-300 bg-contain bg-no-repeat align-top text-black shadow checked:bg-rose-500 focus:border-rose-500 focus:shadow" type="checkbox" id="remember-me" style={{        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/20/svg\' viewBox=\'0 0 20 20\'%3e%3cpath fill=\'none\' stroke=\'%23fff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' strokeWidth=\'2\' d=\'M6 10l3 3l6-6\'/%3e%3c/svg%3e")'}} checked /> */}
                      {/* <label className="inline-block" htmlFor="remember-me">Remember Me</label> */}

                    </div>
                  </div>
                  <div className="mb-4">
                  {/* <FormError message={error}/> */}
                  <FormMessage className="animate-pulse shadow-text text-red-500 font-bold text-lg">{error}</FormMessage>
                    <br/>
                    <Button className="grid w-full cursor-pointer select-none rounded-md border border-rose-500 bg-rose-500 py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-rose-600 hover:bg-rose-600 hover:text-white focus:border-rose-600 focus:bg-rose-600 focus:text-white focus:shadow-none" type="submit">Ingresar</Button>
                  </div>
                </form>
              </Form>
              {/* <p className="mb-4 text-center">
                New on futurism?
                <a href="#" className="cursor-pointer text-rose-500 no-underline hover:text-rose-500"> Create an account </a>
              </p> */}
            </div>
          </div>
          {/* <!-- /Register --> */}
      </div>
    </div>
  )
}
