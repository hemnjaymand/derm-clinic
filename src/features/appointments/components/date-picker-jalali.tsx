"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { DateObject } from "react-multi-date-picker";

export function DatePickerJalali({
  value,
  onChange,
}: {
  value: string; // "YYYY-MM-DD" میلادی یا خالی
  onChange: (gregorianDate: string) => void;
}) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      value={value ? new Date(value) : undefined}
      minDate={new Date()}
      onChange={(date: DateObject | null) => {
        if (!date) return;
        const gDate = date.toDate();
        const iso = `${gDate.getFullYear()}-${String(gDate.getMonth() + 1).padStart(2, "0")}-${String(
          gDate.getDate()
        ).padStart(2, "0")}`;
        onChange(iso);
      }}
      inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      placeholder="انتخاب تاریخ"
    />
  );
}

