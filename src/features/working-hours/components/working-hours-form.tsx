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
      className="space-y-6"
      dir="rtl"
    >
      <div className="space-y-3">
        {fields.map((field, index) => {
          const isOpen = form.watch(`days.${index}.isOpen`);
          return (
            <div
              key={field.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/35 p-4 shadow-sm transition-all ${
                !isOpen ? "opacity-60" : ""
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary accent-primary cursor-pointer"
                  {...form.register(`days.${index}.isOpen`)}
                />
                <span className="font-bold text-foreground text-sm">
                  {DAY_OF_WEEK_LABELS[field.dayOfWeek]}
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <span className="text-xs text-muted-foreground font-medium">
                    از
                  </span>
                  <Input
                    type="time"
                    dir="ltr"
                    disabled={!isOpen}
                    className="w-full sm:w-32 rounded-xl text-center bg-background"
                    {...form.register(`days.${index}.openTime`)}
                  />
                </div>

                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <span className="text-xs text-muted-foreground font-medium">
                    تا
                  </span>
                  <Input
                    type="time"
                    dir="ltr"
                    disabled={!isOpen}
                    className="w-full sm:w-32 rounded-xl text-center bg-background"
                    {...form.register(`days.${index}.closeTime`)}
                  />
                </div>
              </div>

              {form.formState.errors.days?.[index]?.closeTime && (
                <p className="text-xs text-destructive w-full sm:w-auto mt-1 sm:mt-0">
                  {form.formState.errors.days[index]?.closeTime?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 z-20 flex justify-end bg-background/80 backdrop-blur-md pt-4 pb-2 border-t border-border/40">
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full sm:w-auto px-8 rounded-xl shadow-lg transition-all"
        >
          {isPending ? "در حال ذخیره..." : "ذخیره ساعات کاری"}
        </Button>
      </div>
    </form>
  );
}
