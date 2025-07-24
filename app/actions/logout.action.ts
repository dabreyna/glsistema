"use server";

import { redirect } from "next/navigation";
import { signOut } from "@/auth";

export const logoutAction = async () => {
  await signOut();
};
