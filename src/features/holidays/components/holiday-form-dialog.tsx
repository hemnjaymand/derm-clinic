"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { holidaySchema, type HolidayInput } from "../schemas/holiday.schema";
import { createHolidayAction } from "../actions/holidays.actions";

export function HolidayFormDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<HolidayInput>({
    resolver: zodResolver(holidaySchema),
    defaultValues: { date: "", reason: "" },
  });

  function onSubmit(values: HolidayInput) {
    startTransition(async () => {
      const result = await createHolidayAction(values);
      if (result.success) {
        toast.success("تعطیلی ثبت شد");
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          افزودن تعطیلی
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>افزودن روز تعطیل</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">تاریخ</Label>
            <Input id="date" type="date" {...form.register("date")} />
            {form.formState.errors.date && (
              <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">دلیل (اختیاری)</Label>
            <Input id="reason" placeholder="مثلاً تعطیل رسمی" {...form.register("reason")} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "در حال ثبت..." : "ثبت تعطیلی"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}