"use client";


import { cn } from "@/lib/utils";
import type { Slot } from "../utils/slots";

export function SlotPicker({
  slots,
  value,
  onChange,
  isLoading,
}: {
  slots: Slot[];
  value: string;
  onChange: (time: string) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">در حال بارگذاری زمان‌های آزاد...</p>;
  }

  if (slots.length === 0) {
    return <p className="text-sm text-muted-foreground">برای این روز زمان آزادی وجود ندارد.</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {slots.map((slot) => (
        <button
          key={slot.time}
          type="button"
          disabled={!slot.available}
          onClick={() => onChange(slot.time)}
          dir="ltr"
          className={cn(
            "rounded-md border py-2 text-sm transition-colors",
            !slot.available && "cursor-not-allowed opacity-40",
            slot.available && value === slot.time && "border-primary bg-primary text-primary-foreground",
            slot.available && value !== slot.time && "hover:bg-muted"
          )}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
}