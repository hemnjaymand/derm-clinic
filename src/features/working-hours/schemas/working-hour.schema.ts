import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const workingHourSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    openTime: z.string().regex(timeRegex, "فرمت ساعت معتبر نیست"),
    closeTime: z.string().regex(timeRegex, "فرمت ساعت معتبر نیست"),
    isOpen: z.boolean(),
  })
  .refine((data) => data.openTime < data.closeTime, {
    message: "ساعت شروع باید قبل از پایان باشد",
    path: ["closeTime"],
  });

export const workingHoursListSchema = z.array(workingHourSchema);

export type WorkingHourInput = z.infer<typeof workingHourSchema>;
