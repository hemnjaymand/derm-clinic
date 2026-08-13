"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { loginAction } from "../actions/login.action";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("phone", values.phone);
        formData.append("password", values.password);

        const result = await loginAction(formData);

        if (result.success) {
          // ✅ به‌جای router.push از window.location.href استفاده کن
          window.location.href = "/dashboard";
        } else {
          toast.error(result.error);
        }
      } catch {
        toast.error("خطایی در ورود رخ داد. دوباره تلاش کنید.");
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
