"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteHolidayAction } from "../actions/holidays.actions";
import { formatJalaliDate } from "@/lib/date";
import { Holiday } from "@prisma/client";

export function HolidayList({ holidays }: { holidays: Holiday[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteHolidayAction(id);
      if (result.success) {
        toast.success("تعطیلی حذف شد");
      } else {
        toast.error(result.error);
      }
    });
  }

  if (holidays.length === 0) {
    return <p className="text-sm text-muted-foreground">هنوز تعطیلی ثبت نشده است.</p>;
  }

  return (
    <Table dir="rtl">
      <TableHeader>
        <TableRow>
          <TableHead>تاریخ</TableHead>
          <TableHead>دلیل</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {holidays.map((holiday) => (
          <TableRow key={holiday.id}>
            <TableCell>{formatJalaliDate(holiday.date)}</TableCell>
            <TableCell>{holiday.reason || "—"}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={() => handleDelete(holiday.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}