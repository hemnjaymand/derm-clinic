import { z } from "zod";

export const holidaySchema = z.object({
  // مقدار خام <input type="date"> — "YYYY-MM-DD" میلادی
  date: z.string().min(1, "تاریخ الزامی است"),
  reason: z.string().optional(),
});

export type HolidayInput = z.infer<typeof holidaySchema>;