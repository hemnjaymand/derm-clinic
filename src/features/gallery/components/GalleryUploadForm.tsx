"use client";

import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { galleryImageSchema, type GalleryImageInput } from "../schemas/gallery.schema";
import { createGalleryImageAction } from "../actions/gallery.actions";

export function GalleryUploadForm() {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<GalleryImageInput>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      url: "",
      caption: "",
    },
  });

  const imageUrl = form.watch("url");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "خطا در آپلود تصویر");
        return;
      }

      form.setValue("url", data.url, { shouldValidate: true, shouldDirty: true });
      toast.success("تصویر با موفقیت آپلود شد");
    } catch {
      toast.error("خطا در ارتباط با سرور جهت آپلود");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function onSubmit(values: GalleryImageInput) {
    startTransition(async () => {
      const result = await createGalleryImageAction(values);
      if (result.success) {
        toast.success("تصویر با موفقیت در گالری ثبت شد");
        form.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-xl border p-6 bg-card" dir="rtl">
      <h3 className="font-semibold text-lg">افزودن تصویر جدید به گالری</h3>

      <div className="space-y-2">
        <Label>فایل تصویر از حافظه دستگاه</Label>
        <div className="flex flex-wrap items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="ml-2 h-4 w-4" />
            {isUploading ? "در حال آپلود..." : "انتخاب از حافظه"}
          </Button>

          {imageUrl && (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="پیش‌نمایش" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => form.setValue("url", "", { shouldValidate: true })}
                className="absolute -top-1 -left-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
        {form.formState.errors.url && (
          <p className="text-xs text-destructive">{form.formState.errors.url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>کپشن یا توضیح تصویر (اختیاری)</Label>
        <Input {...form.register("caption")} placeholder="مثلاً: محیط کلینیک" />
      </div>

      <Button type="submit" disabled={isPending || isUploading || !imageUrl}>
        {isPending ? "در حال ثبت..." : "ذخیره در گالری"}
      </Button>
    </form>
  );
}