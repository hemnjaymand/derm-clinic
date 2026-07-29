"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ServiceSelect } from "./service-select";
import { DatePickerJalali } from "./date-picker-jalali";
import { SlotPicker } from "./slot-picker";
import { bookingSchema, type BookingInput } from "../schemas/appointment.schema";
import {
  createBookingAction,
  getAvailableSlots,
} from "../actions/appointments.actions";
import type { Slot } from "../utils/slots";
import type { Service } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Button, Input } from "@/components/ui";

export function BookingForm({
  services,
  defaultServiceId,
}: {
  services: Service[];
  defaultServiceId?: string;
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: defaultServiceId ?? "",
      date: "",
      time: "",
      patientName: "",
      patientPhone: "",
      note: "",
    },
  });

  const serviceId = form.watch("serviceId");
  const date = form.watch("date");

  useEffect(() => {
    if (!serviceId || !date) {
      setSlots([]);
      return;
    }
    setIsLoadingSlots(true);
    form.setValue("time", "");
    getAvailableSlots({ serviceId, date })
      .then(setSlots)
      .finally(() => setIsLoadingSlots(false));
  }, [serviceId, date]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(values: BookingInput) {
    startTransition(async () => {
      const result = await createBookingAction(values);
      if (result.success) {
        setSubmitted(true);
      } else {
        toast.error(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <div className="rounded-md border bg-muted/30 p-6 text-center" dir="rtl">
        <p className="font-medium">نوبت شما با موفقیت ثبت شد ✅</p>
        <p className="mt-2 text-sm text-muted-foreground">
          پس از تأیید توسط کلینیک، پیامک تأیید برای شما ارسال می‌شود.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
      <div className="space-y-2">
        <Label>انتخاب خدمت</Label>
        <Controller
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <ServiceSelect services={services} value={field.value} onChange={field.onChange} />
          )}
        />
        {form.formState.errors.serviceId && (
          <p className="text-sm text-destructive">{form.formState.errors.serviceId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>انتخاب تاریخ</Label>
        <Controller
          control={form.control}
          name="date"
          render={({ field }) => (
            <DatePickerJalali value={field.value} onChange={field.onChange} />
          )}
        />
        {form.formState.errors.date && (
          <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
        )}
      </div>

      {date && (
        <div className="space-y-2">
          <Label>انتخاب زمان</Label>
          <Controller
            control={form.control}
            name="time"
            render={({ field }) => (
              <SlotPicker
                slots={slots}
                value={field.value}
                onChange={field.onChange}
                isLoading={isLoadingSlots}
              />
            )}
          />
          {form.formState.errors.time && (
            <p className="text-sm text-destructive">{form.formState.errors.time.message}</p>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="patientName">نام و نام خانوادگی</Label>
          <Input id="patientName" {...form.register("patientName")} />
          {form.formState.errors.patientName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.patientName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patientPhone">شماره موبایل</Label>
          <Input id="patientPhone" placeholder="09xxxxxxxxx" {...form.register("patientPhone")} />
          {form.formState.errors.patientPhone && (
            <p className="text-sm text-destructive">
              {form.formState.errors.patientPhone.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">توضیحات (اختیاری)</Label>
        <Input id="note" {...form.register("note")} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ثبت..." : "ثبت نوبت"}
      </Button>
    </form>
  );
}