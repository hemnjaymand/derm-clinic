"use server";

import { revalidatePath } from "next/cache";

import {
  workingHoursListSchema,
  type WorkingHourInput,
} from "../schemas/working-hour.schema";
import { prisma } from "@/lib/prisma";
import { DAY_OF_WEEK_ORDER } from "@/constants/day-of-week";

/** همیشه دقیقاً ۷ ردیف (یک برای هر روز هفته) برمی‌گردونه؛ روزهای گمشده رو با مقدار پیش‌فرض می‌سازه */
export async function getWorkingHours() {
  const existing = await prisma.workingHours.findMany();
  const existingDays = new Set(existing.map((w) => w.dayOfWeek));
  const missingDays = DAY_OF_WEEK_ORDER.filter((day) => !existingDays.has(day));

  if (missingDays.length > 0) {
    await prisma.workingHours.createMany({
      data: missingDays.map((dayOfWeek) => ({
        dayOfWeek,
        openTime: "09:00",
        closeTime: "17:00",
        isOpen: false,
      })),
      skipDuplicates: true,
    });
  }

  const all = await prisma.workingHours.findMany();

  return DAY_OF_WEEK_ORDER.map((day) => {
    const record = all.find((w) => w.dayOfWeek === day);

    return {
      dayOfWeek: day,
      isOpen: record?.isOpen ?? false,
      openTime: record?.openTime ?? "09:00",
      closeTime: record?.closeTime ?? "17:00",
    };
  });
}

type ActionResult = { success: true } | { success: false; error: string };

export async function updateWorkingHoursAction(
  input: WorkingHourInput[],
): Promise<ActionResult> {
  const parsed = workingHoursListSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات ساعات کاری معتبر نیست" };
  }

  try {
    await prisma.$transaction(
      parsed.data.map((day) =>
        prisma.workingHours.upsert({
          where: { dayOfWeek: day.dayOfWeek },
          create: day,
          update: {
            openTime: day.openTime,
            closeTime: day.closeTime,
            isOpen: day.isOpen,
          },
        }),
      ),
    );

    revalidatePath("/dashboard/working-hours");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در ذخیره‌سازی ساعات کاری" };
  }
}
