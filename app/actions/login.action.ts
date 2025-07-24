"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas/login.schema";
import { AuthError } from "next-auth";
import { z } from "zod";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  try {
    await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};