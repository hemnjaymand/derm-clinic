import { Badge } from "@/components/ui/badge";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_BADGE_VARIANT,
} from "@/constants/appointment-status";
import type { AppointmentStatus } from "@prisma/client";

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <Badge variant={APPOINTMENT_STATUS_BADGE_VARIANT[status]}>
      {APPOINTMENT_STATUS_LABELS[status]}
    </Badge>
  );
}