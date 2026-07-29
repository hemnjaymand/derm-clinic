"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema, type ChangePasswordInput } from "../schemas/password.schema";
import { changePasswordAction } from "../actions/password.actions";

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  function onSubmit(values: ChangePasswordInput) {
    startTransition(async () => {
      const result = await changePasswordAction(values);
      if (result.success) {
        toast.success("رمز عبور با موفقیت تغییر کرد");
        form.reset();
      } else {
        toast.error(result.error || "خطا در تغییر رمز");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-4" dir="rtl">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
        <Input id="currentPassword" type="password" {...form.register("currentPassword")} />
        {form.formState.errors.currentPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">رمز عبور جدید</Label>
        <Input id="newPassword" type="password" {...form.register("newPassword")} />
        {form.formState.errors.newPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">تکرار رمز جدید</Label>
        <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}