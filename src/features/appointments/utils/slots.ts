import { DAY_OF_WEEK_ORDER } from "@/constants/day-of-week";
import type { AppointmentStatus } from "@prisma/client";

export type Slot = { time: string; available: boolean };

/** فرمت نوبت برای محاسبه اسلات‌ها */
export type AppointmentForSlots = {
  startAt: Date;
  endAt: Date;
  status: AppointmentStatus;
};

/**
 * محاسبه‌ی اسلات‌های یک روز مشخص (میلادی، تاریخ‌گذاری‌شده به Asia/Tehran)
 * بر اساس ساعات کاری آن روز هفته، منهای بازه‌های اشغال‌شده توسط نوبت‌های موجود.
 * تابع Pure — بدون دسترسی به دیتابیس؛ داده‌ها از بیرون پاس داده می‌شن تا تست‌پذیر بمونه.
 */
export function computeAvailableSlots(params: {
  targetDate: Date; // نیمه‌شب تهران برای روز موردنظر
  workingHour:
    | { startTime: string; endTime: string; isActive: boolean }
    | undefined;
  isHoliday: boolean;
  serviceDurationMin: number;
  existingAppointments: AppointmentForSlots[];
  now: Date;
}): Slot[] {
  const {
    targetDate,
    workingHour,
    isHoliday,
    serviceDurationMin,
    existingAppointments,
    now,
  } = params;

  if (isHoliday || !workingHour || !workingHour.isActive) {
    return [];
  }

  const activeAppointments = existingAppointments.filter(
    (a) => a.status !== "CANCELLED" && a.status !== "NOSHOW",
  );

  const [startHour, startMinute] = workingHour.startTime.split(":").map(Number);
  const [endHour, endMinute] = workingHour.endTime.split(":").map(Number);

  const dayStart = addMinutesToTehranMidnight(
    targetDate,
    startHour * 60 + startMinute,
  );
  const dayEnd = addMinutesToTehranMidnight(
    targetDate,
    endHour * 60 + endMinute,
  );

  const slots: Slot[] = [];
  const STEP_MIN = 15; // گرانولاریتی نمایش اسلات‌ها؛ خدمت می‌تونه چند اسلات رو اشغال کنه

  for (
    let slotStart = new Date(dayStart);
    new Date(slotStart.getTime() + serviceDurationMin * 60_000) <= dayEnd;
    slotStart = new Date(slotStart.getTime() + STEP_MIN * 60_000)
  ) {
    const slotEnd = new Date(slotStart.getTime() + serviceDurationMin * 60_000);

    const isPast = slotStart < now;
    const overlapsExisting = activeAppointments.some(
      (appt) => slotStart < appt.endAt && slotEnd > appt.startAt,
    );

    slots.push({
      time: toTehranTimeString(slotStart),
      available: !isPast && !overlapsExisting,
    });
  }

  return slots;
}

/** بدست‌آوردن DayOfWeek enum پریزما بر اساس تاریخ (به وقت تهران) */
export function getDayOfWeekFromDate(
  date: Date,
): (typeof DAY_OF_WEEK_ORDER)[number] {
  // JS: 0=Sunday ... 6=Saturday → تبدیل به ترتیب هفته ایرانی
  const jsDay =
    Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Tehran",
        weekday: "short",
      }).format(date),
    ) ||
    new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Tehran" }),
    ).getDay();

  const jsToIranianIndex = [1, 2, 3, 4, 5, 6, 0]; // Sun..Sat -> index in DAY_OF_WEEK_ORDER
  return DAY_OF_WEEK_ORDER[jsToIranianIndex[jsDay]];
}

function addMinutesToTehranMidnight(
  tehranMidnightUtc: Date,
  minutes: number,
): Date {
  return new Date(tehranMidnightUtc.getTime() + minutes * 60_000);
}

function toTehranTimeString(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
