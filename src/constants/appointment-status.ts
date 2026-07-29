import { AppointmentStatus } from "@prisma/client";
import { Record } from "@prisma/client/runtime/library";


export const APPOINTMENT_STATUS_ORDER: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NOSHOW",
];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "در انتظار تأیید",
  CONFIRMED: "تأیید شده",
  COMPLETED: "انجام شده",
  CANCELLED: "لغو شده",
  NOSHOW: "عدم مراجعه",
};

export const APPOINTMENT_STATUS_BADGE_VARIANT: Record<
  AppointmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  CONFIRMED: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
  NOSHOW: "destructive",
};