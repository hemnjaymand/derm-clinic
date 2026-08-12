import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(2, "عنوان باید حداقل ۲ کاراکتر باشد"),
  description: z.string().optional(),
  durationMin: z.coerce
    .number()
    .int()
    .min(5, "مدت زمان باید حداقل ۵ دقیقه باشد")
    .max(480, "مدت زمان نباید بیشتر از ۸ ساعت باشد"), // ← جدید
  price: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
  icon: z.string().url("آدرس آیکون معتبر نیست").optional().or(z.literal("")), // ← بهبود
  isActive: z.boolean(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;