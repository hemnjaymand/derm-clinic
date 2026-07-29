"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  workingHoursListSchema,
  type WorkingHourInput,
} from "../schemas/working-hour.schema";
import { updateWorkingHoursAction } from "../actions/working-hours.actions";
import { DAY_OF_WEEK_LABELS } from "@/constants/day-of-week";

const formSchema = z.object({ days: workingHoursListSchema });
type FormValues = z.infer<typeof formSchema>;


export function WorkingHoursForm({
  initialData,
}: {
  initialData: WorkingHourInput[];
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { days: initialData },
  });

  const { fields } = useFieldArray({ control: form.control, name: "days" });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await updateWorkingHoursAction(values.days);
      if (result.success) {
        toast.success("ساعات کاری ذخیره شد");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-3"
      dir="rtl"
    >
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-wrap items-center gap-4 rounded-md border p-3"
        >
          <label className="flex w-28 items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              className="h-4 w-4"
              {...form.register(`days.${index}.isOpen`)}
            />
            {DAY_OF_WEEK_LABELS[field.dayOfWeek]}
          </label>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">از</span>
            <Input
              type="time"
              className="w-28"
              {...form.register(`days.${index}.openTime`)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">تا</span>
            <Input
              type="time"
              className="w-28"
              {...form.register(`days.${index}.closeTime`)}
            />
          </div>

          {form.formState.errors.days?.[index]?.closeTime && (
            <p className="text-sm text-destructive">
              {form.formState.errors.days[index]?.closeTime?.message}
            </p>
          )}
        </div>
      ))}

      <Button type="submit" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره ساعات کاری"}
      </Button>
    </form>
  );
}
