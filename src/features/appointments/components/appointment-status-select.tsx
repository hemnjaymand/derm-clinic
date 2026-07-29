"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  APPOINTMENT_STATUS_ORDER,
  APPOINTMENT_STATUS_LABELS,
} from "@/constants/appointment-status";
import { updateAppointmentStatusAction } from "../actions/appointments.actions";
import type { AppointmentStatus } from "@prisma/client";

export function AppointmentStatusSelect({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: AppointmentStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateAppointmentStatusAction(
        appointmentId,
        newStatus as AppointmentStatus
      );
      if (result.success) {
        toast.success("وضعیت نوبت به‌روزرسانی شد");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={isPending} dir="rtl">
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {APPOINTMENT_STATUS_ORDER.map((s) => (
          <SelectItem key={s} value={s}>
            {APPOINTMENT_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}