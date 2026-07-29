"use client";

import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  pageBannersSchema,
  PAGE_BANNER_KEYS,
  PAGE_BANNER_LABELS,
  type PageBanners,
  type PageBannerKey,
} from "../schemas/site-settings.schema";
import { updatePageBannersAction } from "../actions/settings.actions";

function BannerFieldGroup({
  pageKey,
  form,
}: {
  pageKey: PageBannerKey;
  form: ReturnType<typeof useForm<PageBanners>>;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageUrl = form.watch(`${pageKey}.imageUrl`);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `settings/banners/${pageKey}`);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "خطا در آپلود تصویر");
        return;
      }
      form.setValue(`${pageKey}.imageUrl`, data.url, { shouldDirty: true });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function addByPath() {
    const path = window.prompt("مسیر تصویر را وارد کنید (مثلاً: /images/about-banner.jpg یا https://...)");
    if (!path?.trim()) return;
    form.setValue(`${pageKey}.imageUrl`, path.trim(), { shouldDirty: true });
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{PAGE_BANNER_LABELS[pageKey]}</h3>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4" {...form.register(`${pageKey}.enabled`)} />
          فعال
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleUpload}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={isUploading}>
          <Upload className="ml-2 h-4 w-4" />
          {isUploading ? "در حال آپلود..." : imageUrl ? "تغییر تصویر" : "انتخاب تصویر"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addByPath}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن با مسیر
        </Button>
        {imageUrl && (
          <div className="group relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={PAGE_BANNER_LABELS[pageKey]} className="h-14 w-24 rounded object-cover" />
            <button
              type="button"
              onClick={() => form.setValue(`${pageKey}.imageUrl`, "", { shouldDirty: true })}
              className="absolute -left-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">عنوان</Label>
          <Input {...form.register(`${pageKey}.title`)} placeholder={PAGE_BANNER_LABELS[pageKey]} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">زیرعنوان</Label>
          <Input {...form.register(`${pageKey}.subtitle`)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">متن دکمه (CTA)</Label>
          <Input {...form.register(`${pageKey}.ctaLabel`)} placeholder="مثلاً: رزرو نوبت" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">آدرس دکمه</Label>
          <Input dir="ltr" {...form.register(`${pageKey}.ctaHref`)} placeholder="/appointment" />
        </div>
      </div>
    </div>
  );
}

export function PageBannersForm({ initialData }: { initialData: PageBanners }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PageBanners>({
    resolver: zodResolver(pageBannersSchema),
    defaultValues: PAGE_BANNER_KEYS.reduce((acc, key) => {
      acc[key] = {
        enabled: initialData[key]?.enabled ?? true,
        title: initialData[key]?.title ?? "",
        subtitle: initialData[key]?.subtitle ?? "",
        imageUrl: initialData[key]?.imageUrl ?? "",
        ctaLabel: initialData[key]?.ctaLabel ?? "",
        ctaHref: initialData[key]?.ctaHref ?? "",
      };
      return acc;
    }, {} as PageBanners),
  });

  function onSubmit(values: PageBanners) {
    startTransition(async () => {
      const result = await updatePageBannersAction(values);
      if (result.success) toast.success("بنرهای صفحات ذخیره شد");
      else toast.error(result.error);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
      {PAGE_BANNER_KEYS.map((key) => (
        <BannerFieldGroup key={key} pageKey={key} form={form} />
      ))}
      <Button type="submit" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره بنرها"}
      </Button>
    </form>
  );
}