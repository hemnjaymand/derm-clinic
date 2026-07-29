// src/features/appointments/components/appointment-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatJalaliDateTime } from "@/lib/date";
import { AppointmentStatusSelect } from "./appointment-status-select";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_BADGE_VARIANT,
} from "@/constants/appointment-status";
import type { Appointment, Patient, Service } from "@prisma/client";

type AppointmentWithRelations = Appointment & { patient: Patient; service: Service };

export function AppointmentTable({
  appointments,
}: {
  appointments: AppointmentWithRelations[];
}) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        نوبتی مطابق فیلتر انتخاب‌شده یافت نشد.
      </div>
    );
  }

  return (
  <>
    {/* ===== نمایش دسکتاپ: جدول ===== */}
    {/* اضافه کردن overflow-hidden برای حفظ گردی گوشه‌ها (border-radius) */}
    <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">تاریخ و ساعت</TableHead>
            <TableHead className="text-right">بیمار</TableHead>
            <TableHead className="text-right">شماره تماس</TableHead>
            <TableHead className="text-right">خدمت</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => (
            <TableRow key={appt.id}>
              {/* تاریخ معمولاً در LTR بهتر نمایش داده می‌شود، اما باید راست‌چین بماند */}
              <TableCell className="whitespace-nowrap text-right" dir="ltr">
                {formatJalaliDateTime(appt.date)}
              </TableCell>
              <TableCell className="font-medium whitespace-nowrap">
                {appt.patient.firstName} {appt.patient.lastName}
              </TableCell>
              {/* text-right اضافه شد تا با وجود ltr بودن، در ستون جدول به سمت راست بچسبد */}
              <TableCell dir="ltr" className="text-right whitespace-nowrap">
                {appt.patient.phone}
              </TableCell>
              <TableCell className="whitespace-nowrap">{appt.service.title}</TableCell>
              <TableCell>
                <AppointmentStatusSelect appointmentId={appt.id} status={appt.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* ===== نمایش موبایل: کارت‌ها ===== */}
    <div className="space-y-4 md:hidden">
      {appointments.map((appt) => (
        <Card key={appt.id}>
          <CardContent className="p-4 flex flex-col gap-4">
            
            {/* بخش بالایی: نام، شماره و وضعیت */}
            <div className="flex justify-between items-start gap-2">
              <div className="flex flex-col">
                <p className="font-medium">
                  {appt.patient.firstName} {appt.patient.lastName}
                </p>
                {/* وقتی dir="ltr" می‌دهی، متن به طور پیش‌فرض چپ‌چین می‌شود. text-right این مشکل را حل می‌کند */}
                <p className="text-sm text-muted-foreground text-right" dir="ltr">
                  {appt.patient.phone}
                </p>
              </div>
              <Badge variant={APPOINTMENT_STATUS_BADGE_VARIANT[appt.status]} className="shrink-0">
                {APPOINTMENT_STATUS_LABELS[appt.status]}
              </Badge>
            </div>

            {/* بخش میانی: جزئیات */}
            {/* در موبایل grid-cols-2 ریسک بالایی دارد چون نام سرویس یا تاریخ ممکن است طولانی باشد. flex-col امن‌تر است */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground whitespace-nowrap">خدمت:</span>
                <span className="font-medium leading-relaxed">{appt.service.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground whitespace-nowrap">تاریخ:</span>
                <span className="font-medium" dir="ltr">
                  {formatJalaliDateTime(appt.date)}
                </span>
              </div>
            </div>

            {/* بخش پایینی: اکشن‌ها */}
            <div className="pt-3 border-t mt-1">
              <AppointmentStatusSelect appointmentId={appt.id} status={appt.status} />
            </div>
            
          </CardContent>
        </Card>
      ))}
    </div>
  </>
); }