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
    <div className="max-w-xl rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-6 shadow-sm md:p-8" dir="rtl">
      <div className="mb-6 border-b border-emerald-200/60 pb-4">
        <h2 className="text-base font-bold text-emerald-950">تغییر رمز عبور</h2>
        <p className="text-xs text-muted-foreground mt-0.5">برای حفظ امنیت حساب کاربری، رمز عبور خود را به‌روزرسانی کنید</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-xs font-medium text-muted-foreground">رمز عبور فعلی</Label>
          <Input 
            id="currentPassword" 
            type="password" 
            dir="ltr"
            className="rounded-xl text-left bg-white border-emerald-200 focus-visible:ring-emerald-500" 
            {...form.register("currentPassword")} 
          />
          {form.formState.errors.currentPassword && (
            <p className="text-xs text-destructive mt-1">{form.formState.errors.currentPassword.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-xs font-medium text-muted-foreground">رمز عبور جدید</Label>
          <Input 
            id="newPassword" 
            type="password" 
            dir="ltr"
            className="rounded-xl text-left bg-white border-emerald-200 focus-visible:ring-emerald-500" 
            {...form.register("newPassword")} 
          />
          {form.formState.errors.newPassword && (
            <p className="text-xs text-destructive mt-1">{form.formState.errors.newPassword.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground">تکرار رمز جدید</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            dir="ltr"
            className="rounded-xl text-left bg-white border-emerald-200 focus-visible:ring-emerald-500" 
            {...form.register("confirmPassword")} 
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1">{form.formState.errors.confirmPassword.message as string}</p>
          )}
        </div>

        <div className="pt-3 border-t border-emerald-200/60 flex justify-end">
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full sm:w-auto px-6 rounded-xl shadow-sm transition-all"
          >
            {isPending ? "در حال ذخیره..." : "تغییر رمز عبور"}
          </Button>
        </div>
      </form>
    </div>
  );
}