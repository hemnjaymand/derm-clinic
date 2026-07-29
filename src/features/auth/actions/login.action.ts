"use server";

import { AuthError } from "next-auth";
import { loginSchema } from "../schemas/login.schema";
import { signIn, signOut } from "@/lib/auth";

type LoginResult = { success: true } | { success: false; error: string };

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const raw = {
    phone: formData.get("phone"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست" };
  }

  try {
    await signIn("credentials", {
      phone: parsed.data.phone,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "شماره موبایل یا رمز عبور اشتباه است" };
    }
    throw error;
  }

}

 export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
} 