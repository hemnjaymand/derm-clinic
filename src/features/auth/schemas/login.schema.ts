import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export type LoginInput = z.infer<typeof loginSchema>;