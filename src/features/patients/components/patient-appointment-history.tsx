import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import { formatJalaliDateTime } from "@/lib/date";
import type { Appointment, Service } from "@prisma/client";

export function PatientAppointmentHistory({
  appointments,
}: {
  appointments: (Appointment & { service: Service })[];
}) {
  if (appointments.length === 0) {
    return <p className="text-sm text-muted-foreground">این بیمار هنوز نوبتی نداشته است.</p>;
  }

  return (
    <Table dir="rtl">
      <TableHeader>
        <TableRow>
          <TableHead>تاریخ و ساعت</TableHead>
          <TableHead>خدمت</TableHead>
          <TableHead>وضعیت</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appt) => (
          <TableRow key={appt.id}>
            <TableCell>{formatJalaliDateTime(appt.date)}</TableCell>
            <TableCell>{appt.service.title}</TableCell>
            <TableCell>
              <AppointmentStatusBadge status={appt.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}