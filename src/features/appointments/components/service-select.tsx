"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Service } from "@prisma/client";

export function ServiceSelect({
  services,
  value,
  onChange,
}: {
  services: Service[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange} dir="rtl">
      <SelectTrigger>
        <SelectValue placeholder="یک خدمت انتخاب کنید" />
      </SelectTrigger>
      <SelectContent>
        {services.map((service) => (
          <SelectItem key={service.id} value={service.id}>
            {service.title} ({service.durationMin} دقیقه)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
