"use server";

import { revalidatePath } from "next/cache";
import { holidaySchema, type HolidayInput } from "../schemas/holiday.schema";
import { prisma } from "@/lib/prisma";

export async function getHolidays() {
  return prisma.holiday.findMany({ orderBy: { date: "asc" } });
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createHolidayAction(input: HolidayInput): Promise<ActionResult> {
  const parsed = holidaySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات تعطیلی معتبر نیست" };
  }

  try {
    const date = new Date(`${parsed.data.date}T00:00:00.000Z`);

    await prisma.holiday.create({
      data: { date, reason: parsed.data.reason || null },
    });

    revalidatePath("/dashboard/holidays");
    return { success: true };
  } catch {
    return { success: false, error: "این تاریخ قبلاً ثبت شده یا خطایی رخ داد" };
  }
}

export async function deleteHolidayAction(id: string): Promise<ActionResult> {
  try {
    await prisma.holiday.delete({ where: { id } });
    revalidatePath("/dashboard/holidays");
    return { success: true };
  } catch {
    return { success: false, error: "حذف با خطا مواجه شد" };
  }
}