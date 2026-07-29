import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "انتخاب خدمت الزامی است"),
  // تاریخ به فرمت میلادی "YYYY-MM-DD" (تولیدشده از تاریخ شمسی انتخابی در UI)
  date: z.string().min(1, "انتخاب تاریخ الزامی است"),
  // ساعت شروع اسلات، فرمت "HH:mm"
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "ساعت معتبر نیست"),
  patientName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  patientPhone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  note: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const availableSlotsQuerySchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().min(1),
});