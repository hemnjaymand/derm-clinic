import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import {
  sendAppointmentSms,
  hasReminderBeenSent,
} from "@/features/notifications/actions/send-appointment-sms";

/**
 * این Route Handler توسط یک Cron خارجی (مثلاً Vercel Cron یا crontab سرور) روزانه صدا زده می‌شود؛
 * چون فراخوانی از سمت یک سرویس بیرونی است (نه کاربر مرورگر)، Server Action مناسب نیست
 * و طبق قانون پروژه («Route Handlers فقط در صورت نیاز») همینجا استثنا موجه است.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60_000);

  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      status: "CONFIRMED",
      date: { gte: now, lte: in24Hours },
    },
    select: { id: true },
  });

  let sentCount = 0;
  for (const appt of upcomingAppointments) {
    const alreadySent = await hasReminderBeenSent(appt.id);
    if (alreadySent) continue;

    await sendAppointmentSms(appt.id, "REMINDER");
    sentCount++;
  }

  return NextResponse.json({
    checked: upcomingAppointments.length,
    sent: sentCount,
  });
}
