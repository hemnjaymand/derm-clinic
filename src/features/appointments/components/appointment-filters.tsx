"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  APPOINTMENT_STATUS_ORDER,
  APPOINTMENT_STATUS_LABELS,
} from "@/constants/appointment-status";

export function AppointmentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/dashboard/appointments?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-4" dir="rtl">
      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">وضعیت</label>
        <Select
          value={searchParams.get("status") ?? "ALL"}
          onValueChange={(v) => updateParam("status", v === "ALL" ? "" : v)}
          dir="rtl"
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">همه‌ی وضعیت‌ها</SelectItem>
            {APPOINTMENT_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {APPOINTMENT_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">از تاریخ</label>
        <Input
          type="date"
          defaultValue={searchParams.get("dateFrom") ?? ""}
          onChange={(e) => updateParam("dateFrom", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">تا تاریخ</label>
        <Input
          type="date"
          defaultValue={searchParams.get("dateTo") ?? ""}
          onChange={(e) => updateParam("dateTo", e.target.value)}
        />
      </div>

      <Button variant="ghost" onClick={() => router.push("/dashboard/appointments")}>
        پاک کردن فیلترها
      </Button>
    </div>
  );
}