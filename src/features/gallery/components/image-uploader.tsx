"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createGalleryImageAction } from "../actions/gallery.actions";

export function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "خطا در آپلود تصویر");
        return;
      }

      const result = await createGalleryImageAction({ url: data.url });
      if (result.success) {
        toast.success("تصویر با موفقیت اضافه شد");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
        <Upload className="ml-2 h-4 w-4" />
        {isUploading ? "در حال آپلود..." : "افزودن تصویر"}
      </Button>
    </div>
  );
}