"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";

export function PatientSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.push(`/dashboard/patients?${params.toString()}`);
  }, 400);

  return (
    <Input
      placeholder="جستجو بر اساس نام یا شماره موبایل..."
      defaultValue={searchParams.get("q") ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
      className="max-w-sm"
    />
  );
}