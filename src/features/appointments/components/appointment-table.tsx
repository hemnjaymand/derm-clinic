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
import { Badge } from "@/components/ui/badge";
import { formatJalaliDateTime } from "@/lib/date";
import { AppointmentStatusSelect } from "./appointment-status-select";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_BADGE_VARIANT,
} from "@/constants/appointment-status";
import type { Appointment, Patient, Service } from "@prisma/client";

type AppointmentWithRelations = Appointment & {
  patient: Patient;
  service: Service;
};

export function AppointmentTable({
  appointments,
}: {
  appointments: AppointmentWithRelations[];
}) {
  if (appointments.length === 0) {
    return (
      <div
        className="rounded-2xl border border-border/40 bg-card/35 p-8 text-center shadow-sm"
        dir="rtl"
      >
        <p className="text-sm text-muted-foreground">
          نوبتی مطابق فیلتر انتخاب‌شده یافت نشد.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* ===== نمایش دسکتاپ: جدول ===== */}
      <div className="hidden md:block rounded-2xl border border-border/40 bg-card/35 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="text-right font-bold text-foreground py-4 px-6">
                تاریخ و ساعت
              </TableHead>
              <TableHead className="text-right font-bold text-foreground py-4 px-6">
                بیمار
              </TableHead>
              <TableHead className="text-right font-bold text-foreground py-4 px-6">
                شماره تماس
              </TableHead>
              <TableHead className="text-right font-bold text-foreground py-4 px-6">
                خدمت
              </TableHead>
              <TableHead className="text-right font-bold text-foreground py-4 px-6">
                وضعیت
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow
                key={appt.id}
                className="border-b border-border/40 transition-colors hover:bg-muted/50"
              >
                <TableCell
                  className="whitespace-nowrap py-4 px-6 font-mono text-xs"
                  dir="ltr"
                >
                  {formatJalaliDateTime(appt.date)}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap py-4 px-6 text-foreground">
                  {appt.patient.firstName} {appt.patient.lastName}
                </TableCell>
                <TableCell
                  dir="ltr"
                  className="text-right whitespace-nowrap py-4 px-6 font-mono text-xs"
                >
                  {appt.patient.phone}
                </TableCell>
                <TableCell className="whitespace-nowrap py-4 px-6 text-muted-foreground">
                  {appt.service.title}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <AppointmentStatusSelect
                    appointmentId={appt.id}
                    status={appt.status}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ===== نمایش موبایل: کارت‌ها ===== */}
      <div className="space-y-3 md:hidden">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="rounded-2xl border border-border/40 bg-card/35 p-4 shadow-sm space-y-4 transition-all"
          >
            {/* بخش بالایی: نام، شماره و وضعیت */}
            <div className="flex justify-between items-start gap-3 border-b border-border/40 pb-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-foreground text-sm">
                  {appt.patient.firstName} {appt.patient.lastName}
                </span>
                <span
                  className="text-xs text-muted-foreground font-mono"
                  dir="ltr"
                >
                  {appt.patient.phone}
                </span>
              </div>
              <Badge
                variant={APPOINTMENT_STATUS_BADGE_VARIANT[appt.status]}
                className="shrink-0 rounded-xl px-2.5 py-1"
              >
                {APPOINTMENT_STATUS_LABELS[appt.status]}
              </Badge>
            </div>

            {/* بخش میانی: جزئیات */}
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">خدمت:</span>
                <span className="font-medium text-foreground">
                  {appt.service.title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">
                  تاریخ و ساعت:
                </span>
                <span className="font-mono text-foreground" dir="ltr">
                  {formatJalaliDateTime(appt.date)}
                </span>
              </div>
            </div>

            {/* بخش پایینی: اکشن‌ها */}
            <div className="pt-3 border-t border-border/40">
              <AppointmentStatusSelect
                appointmentId={appt.id}
                status={appt.status}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
