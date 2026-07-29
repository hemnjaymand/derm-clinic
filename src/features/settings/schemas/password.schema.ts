import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
    newPassword: z.string().min(8, "رمز جدید باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "تکرار رمز جدید مطابقت ندارد",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;