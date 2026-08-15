"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { signIn } from "next-auth/react";
export function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "09120000000", password: "ChangeMe123!" },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await signIn("credentials", {
        phone: values.phone,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("شماره موبایل یا رمز عبور اشتباه است");
      } else {
        window.location.href = "/dashboard";
      }
    });
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      dir="rtl"
    >
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          شماره موبایل
        </label>
        <Input
          id="phone"
          placeholder="09xxxxxxxxx"
          {...form.register("phone")}
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-destructive">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          رمز عبور
        </label>
        <Input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ورود..." : "ورود"}
      </Button>
    </form>
  );
}
