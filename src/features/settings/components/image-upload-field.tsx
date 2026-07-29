"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  aspect = "video",
}: {
  label: string;
  value: string | undefined;
  onChange: (url: string) => void;
  folder: string;
  aspect?: "video" | "square";
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "خطا در آپلود تصویر");
        return;
      }
      onChange(data.url);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleUpload}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="ml-2 h-4 w-4" />
          {isUploading
            ? "در حال آپلود..."
            : value
              ? "تغییر تصویر"
              : "انتخاب تصویر"}
        </Button>

        {value && (
          <div
            className={`group relative overflow-hidden rounded-lg border ${aspect === "video" ? "h-24 w-40" : "h-16 w-16"}`}
          >
            <Image
              src={value}
              alt={label}
              fill
              sizes={aspect === "video" ? "160px" : "64px"}
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -left-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
