"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface AppointmentCardProps {
  id: string;
  patientName: string;
  doctorName: string;
  date: Date;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  onStatusChange?: (id: string, status: string) => void;
}

const statusMap: Record<
  AppointmentCardProps["status"],
  { label: string; variant: NonNullable<BadgeVariant> }
> = {
  PENDING: { label: "در انتظار", variant: "outline" },
  CONFIRMED: { label: "تأیید شده", variant: "default" },
  COMPLETED: { label: "انجام شده", variant: "secondary" },
  CANCELLED: { label: "لغو شده", variant: "destructive" },
};

export function AppointmentCard({
  id,
  patientName,
  doctorName,
  date,
  status,
  onStatusChange,
}: AppointmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{patientName}</span>
          <Badge variant={statusMap[status].variant}>
            {statusMap[status].label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>پزشک: {doctorName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(date, "yyyy/MM/dd")}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{format(date, "HH:mm")}</span>
        </div>
      </CardContent>
      {onStatusChange && (
        <CardFooter className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(id, "CONFIRMED")}
            disabled={status !== "PENDING"}
          >
            تأیید
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onStatusChange(id, "CANCELLED")}
            disabled={status === "CANCELLED" || status === "COMPLETED"}
          >
            لغو
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
