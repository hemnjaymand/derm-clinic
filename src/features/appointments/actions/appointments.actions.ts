"use server";
import type { AppointmentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  bookingSchema,
  availableSlotsQuerySchema,
  type BookingInput,
} from "../schemas/appointment.schema";
import {
  computeAvailableSlots,
  getDayOfWeekFromDate,
  type Slot,
} from "../utils/slots";
import { prisma } from "@/lib/prisma";
import { sendAppointmentSms } from "@/features/notifications/actions/send-appointment-sms";
import bcrypt from "bcryptjs";

/** ورودی date به فرمت "YYYY-MM-DD" میلادی (از input نوع date در UI) */
export async function getAvailableSlots(input: {
  serviceId: string;
  date: string;
}): Promise<Slot[]> {
  const parsed = availableSlotsQuerySchema.safeParse(input);
  if (!parsed.success) return [];

  const service = await prisma.service.findUnique({
    where: { id: parsed.data.serviceId },
  });
  if (!service || !service.isActive) return [];

  const targetDate = new Date(`${parsed.data.date}T00:00:00.000Z`);

  const dayOfWeekIndex = getDayOfWeekFromDate(targetDate);

  const [workingHours, holiday, existingAppointments] = await Promise.all([
    prisma.workingHours.findUnique({
      where: { dayOfWeek: dayOfWeekIndex },
    }),
    prisma.holiday.findUnique({ where: { date: targetDate } }),
    prisma.appointment.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 86_400_000),
        },
      },
      select: { date: true, startTime: true, endTime: true, status: true },
    }),
  ]);

  const normalizedAppointments = existingAppointments.map((a) => {
    const [sh, sm] = a.startTime.split(":").map(Number);
    const [eh, em] = a.endTime.split(":").map(Number);
    const startAt = new Date(a.date);
    startAt.setUTCHours(sh, sm, 0, 0);
    const endAt = new Date(a.date);
    endAt.setUTCHours(eh, em, 0, 0);
    return { startAt, endAt, status: a.status };
  });

  const normalizedWorkingHour = workingHours
    ? {
        startTime: workingHours.openTime ?? "00:00",
        endTime: workingHours.closeTime ?? "00:00",
        isActive: workingHours.isOpen,
      }
    : undefined;

  return computeAvailableSlots({
    targetDate,
    workingHour: normalizedWorkingHour,
    isHoliday: !!holiday,
    serviceDurationMin: service.durationMin,
    existingAppointments: normalizedAppointments,
    now: new Date(),
  });
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createBookingAction(
  input: BookingInput,
): Promise<ActionResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات فرم معتبر نیست" };
  }

  const { serviceId, date, time, patientName, patientPhone, note } =
    parsed.data;

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service || !service.isActive) {
      return { success: false, error: "این خدمت در دسترس نیست" };
    }

    const [gy, gm, gd] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const targetDate = new Date(Date.UTC(gy, gm - 1, gd, 0, 0, 0, 0));

    // بررسی تداخل
    const conflict = await prisma.appointment.findFirst({
      where: {
        status: { notIn: ["CANCELLED", "NOSHOW"] },
        date: targetDate,
        startTime: time,
      },
    });
    if (conflict) {
      return {
        success: false,
        error: "این زمان به‌تازگی رزرو شده؛ لطفاً زمان دیگری انتخاب کنید",
      };
    }

    // ایجاد یا به‌روزرسانی بیمار
    const nameParts = patientName.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "-";
    const lastName = nameParts.slice(1).join(" ") || "-";

    const patient = await prisma.patient.upsert({
      where: { phone: patientPhone },
      update: { firstName, lastName },
      create: { firstName, lastName, phone: patientPhone },
    });

    // محاسبه endTime
    const totalEndMinutes = hour * 60 + minute + service.durationMin;
    const endTimeStr = `${String(Math.floor(totalEndMinutes / 60)).padStart(2, "0")}:${String(totalEndMinutes % 60).padStart(2, "0")}`;

    // ------ دریافت یا ایجاد کاربر سیستمی (با email مشخص) ------
    const SYSTEM_EMAIL = "system@clinic.com";
    let systemUser = await prisma.user.findUnique({
      where: { email: SYSTEM_EMAIL },
    });

    if (!systemUser) {
      // اگر کاربر سیستمی وجود نداشت، آن را ایجاد کن
      const hashedPassword = await bcrypt.hash("System@123", 12);
      systemUser = await prisma.user.create({
        data: {
          name: "سیستم",
          email: SYSTEM_EMAIL,
          role: "ADMIN",
          password: hashedPassword,
        },
      });
      console.log("✅ کاربر سیستمی جدید ایجاد شد:", SYSTEM_EMAIL);
    }

    // ایجاد نوبت
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        serviceId: service.id,
        userId: systemUser.id,
        date: targetDate,
        startTime: time,
        endTime: endTimeStr,
        description: note || null,
        status: "PENDING",
      },
    });

    // ارسال پیامک با مدیریت خطا (تا باعث شکست کل عملیات نشود)
    try {
      await sendAppointmentSms(appointment.id, "BOOKING");
    } catch (smsError) {
      console.error("❌ خطا در ارسال پیامک:", smsError);
      // خطا را نادیده بگیرید یا لاگ کنید
    }

    revalidatePath("/dashboard/appointments");
    return { success: true };
  } catch (error) {
    console.error("❌ خطا در createBookingAction:", error);
    return { success: false, error: "خطا در ثبت نوبت. لطفاً دوباره تلاش کنید" };
  }
}

export type AppointmentFilters = {
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
};

export async function getAppointments(filters: AppointmentFilters) {
  const where: Prisma.AppointmentWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.dateFrom || filters.dateTo) {
    where.date = {};
    if (filters.dateFrom) {
      where.date.gte = new Date(`${filters.dateFrom}T00:00:00.000Z`);
    }
    if (filters.dateTo) {
      where.date.lt = new Date(
        new Date(`${filters.dateTo}T00:00:00.000Z`).getTime() + 86_400_000,
      );
    }
  }

  return prisma.appointment.findMany({
    where,
    include: { patient: true, service: true },
    orderBy: { date: "desc" },
  });
}

export async function updateAppointmentStatusAction(
  id: string,
  status: AppointmentStatus,
): Promise<ActionResult> {
  try {
    await prisma.appointment.update({ where: { id }, data: { status } });
    revalidatePath("/dashboard/appointments");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در تغییر وضعیت نوبت" };
  }
}
