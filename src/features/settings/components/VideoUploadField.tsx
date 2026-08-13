"use client";

import { useState } from "react";
import { Upload, Loader2, X, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function VideoUploadField({
  label,
  value,
  onChange,
  folder = "videos",
}: VideoUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // 🟢 آدرس ایندپوئینت آپلود فایل پروژه‌تان را در صورت نیاز تغییر دهید
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error("خطا در آپلود ویدئو:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-emerald-950">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        {value ? (
          <div className="flex items-center justify-between gap-2 w-full rounded-md border border-emerald-200 bg-white p-2 text-xs">
            <span className="truncate font-mono dir-ltr text-muted-foreground flex-1">
              {value}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:bg-destructive/10"
              onClick={() => onChange("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <label className="flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-emerald-300 bg-white px-3 text-xs text-emerald-900 transition-colors hover:bg-emerald-50">
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
            ) : (
              <Upload className="h-3.5 w-3.5 text-emerald-600" />
            )}
            <span>{isUploading ? "در حال آپلود..." : "انتخاب و آپلود ویدئو"}</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}