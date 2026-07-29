import { prisma } from "@/lib/prisma";

import {
  bookingSmsTemplate,
  confirmSmsTemplate,
  cancelSmsTemplate,
  reminderSmsTemplate,
} from "../templates/sms-templates";
import type { SmsType } from "@prisma/client";
import { getSmsProvider } from "@/lib/sms";

const TEMPLATES: Record<SmsType, typeof bookingSmsTemplate> = {
  BOOKING: bookingSmsTemplate,
  CONFIRM: confirmSmsTemplate,
  CANCEL: cancelSmsTemplate,
  REMINDER: reminderSmsTemplate,
};

/**
 * ارسال پیامک مرتبط با یک نوبت + ثبت در SmsLog.
 * عمداً هیچ‌وقت Exception پرتاب نمی‌کنه — شکست پیامک نباید هیچ عملیات دیگری
 * (مثل ثبت نوبت یا تغییر وضعیت) را متوقف کند.
 */
export async function sendAppointmentSms(appointmentId: string, type: SmsType): Promise<void> {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true, service: true },
    });
    if (!appointment) return;

    const text = TEMPLATES[type]({
      patientName: appointment.patient.id,
      serviceTitle: appointment.service.title,
      startAt: appointment.date,
    });

    const provider = getSmsProvider();
    const result = await provider.send(appointment.patient.phone, text);

    await prisma.smsLog.create({
      data: {
        phone: appointment.patient.phone,
        type,
        provider: provider.name,
        appointmentId: appointment.id,
        status: result.success ? "SENT" : "FAILED",
        errorMessage: result.success ? null : result.error,
      },
    });
  } catch (error) {
    // خطای غیرمنتظره (مثلاً Provider ناشناخته) هم فقط لاگ می‌شود، هرگز throw نمی‌شود
    console.error(`SMS send failed for appointment ${appointmentId}:`, error);
  }
}

/** بررسی اینکه آیا یادآوری این نوبت قبلاً با موفقیت ارسال شده یا نه (جلوگیری از ارسال تکراری) */
export async function hasReminderBeenSent(appointmentId: string): Promise<boolean> {
  const log = await prisma.smsLog.findFirst({
    where: { appointmentId, type: "REMINDER", status: "SENT" },
  });
  return !!log;
}