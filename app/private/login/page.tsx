import { LoginForm } from "@/components/client/loginform";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  // session?.user.name
  if (session) {
    redirect("/private/dashboard");
  }
  return (
    <>
      <LoginForm />
    </>
  );
}
