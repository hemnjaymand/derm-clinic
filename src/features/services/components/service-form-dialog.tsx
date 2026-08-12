"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE_BYTES } from "@/lib/storage";
import { serviceSchema, type ServiceInput } from "../schemas/service.schema";

import {
  createServiceAction,
  updateServiceAction,
} from "../actions/services.actions";

import type { Service } from "@prisma/client";

import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// const MAX_ICON_SIZE = 5 * 1024 * 1024;

// const ALLOWED_ICON_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ServiceFormDialog({ service }: { service?: Service }) {
  const isEdit = Boolean(service);

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);

  const [iconPreview, setIconPreview] = useState<string | null>(
    service?.icon ?? null,
  );

  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),

    defaultValues: {
      title: service?.title ?? "",
      description: service?.description ?? "",
      durationMin: service?.durationMin ?? 30,
      price: service?.price ?? undefined,
      imageUrl: service?.imageUrl ?? "",
      icon: service?.icon ?? "",
      isActive: service?.isActive ?? true,
    },
  });

  function revokePreview(url: string | null) {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      form.reset({
        title: service?.title ?? "",
        description: service?.description ?? "",
        durationMin: service?.durationMin ?? 30,
        price: service?.price ?? undefined,
        imageUrl: service?.imageUrl ?? "",
        icon: service?.icon ?? "",
        isActive: service?.isActive ?? true,
      });

      setSelectedIcon(null);

      revokePreview(iconPreview);

      setIconPreview(service?.icon ?? null);

      return;
    }

    revokePreview(iconPreview);

    setSelectedIcon(null);
    setIconPreview(service?.icon ?? null);
  }

  function handleIconChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("فرمت مجاز: JPG، PNG، WEBP و SVG");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast.error("حجم آیکون نباید بیشتر از 5 مگابایت باشد");
      event.target.value = "";
      return;
    }

    revokePreview(iconPreview);

    const previewUrl = URL.createObjectURL(file);

    setSelectedIcon(file);
    setIconPreview(previewUrl);
  }

  function removeIcon() {
    revokePreview(iconPreview);

    setSelectedIcon(null);
    setIconPreview(null);

    form.setValue("icon", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function uploadIcon(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "services/icons");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    }); // ← تغییر مسیر
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "آپلود آیکون ناموفق بود");
    }
    return data.url as string;
  }

  async function onSubmit(values: ServiceInput) {
    try {
      let iconUrl = values.icon ?? "";

      if (selectedIcon) {
        setIsUploading(true);

        iconUrl = await uploadIcon(selectedIcon);

        setIsUploading(false);
      }

      const finalValues: ServiceInput = {
        ...values,
        icon: iconUrl,
      };

      startTransition(async () => {
        const result = isEdit
          ? await updateServiceAction(service!.id, finalValues)
          : await createServiceAction(finalValues);

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success(isEdit ? "خدمت ویرایش شد" : "خدمت ثبت شد");

        setOpen(false);

        if (!isEdit) {
          form.reset();
          setSelectedIcon(null);

          revokePreview(iconPreview);

          setIconPreview(null);
        }
      });
    } catch (error) {
      setIsUploading(false);

      toast.error(
        error instanceof Error ? error.message : "خطا در آپلود آیکون",
      );
    }
  }

  const isLoading = isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            افزودن خدمت
          </Button>
        )}
      </DialogTrigger>

      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "ویرایش خدمت" : "افزودن خدمت جدید"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان</Label>

            <Input id="title" {...form.register("title")} />

            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>

            <Input id="description" {...form.register("description")} />
          </div>

          {/* Duration / Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationMin">مدت زمان (دقیقه)</Label>

              <Input
                id="durationMin"
                type="number"
                {...form.register("durationMin", {
                  valueAsNumber: true,
                })}
              />

              {form.formState.errors.durationMin && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.durationMin.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">قیمت (تومان، اختیاری)</Label>

              <Input
                id="price"
                type="number"
                {...form.register("price", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {form.formState.errors.price && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">آدرس تصویر اصلی</Label>

            <Input
              id="imageUrl"
              placeholder="https://..."
              {...form.register("imageUrl")}
            />

            {form.formState.errors.imageUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.imageUrl.message}
              </p>
            )}
          </div>

          {/* Icon Upload */}
          <div className="space-y-3">
            <Label htmlFor="icon-file">آیکون خدمت</Label>

            <label
              htmlFor="icon-file"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 transition-colors hover:bg-muted/50"
            >
              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />

              <span className="text-sm font-medium">انتخاب آیکون</span>

              <span className="mt-1 text-xs text-muted-foreground">
                JPG، PNG، WEBP — حداکثر 5MB
              </span>

              <input
                id="icon-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleIconChange}
                disabled={isLoading}
              />
            </label>

            {iconPreview && (
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                    <Image
                      src={iconPreview}
                      alt="پیش‌نمایش آیکون"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                      unoptimized
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {selectedIcon ? selectedIcon.name : "آیکون فعلی"}
                    </p>

                    {selectedIcon && (
                      <p className="text-xs text-muted-foreground">
                        {(selectedIcon.size / 1024).toFixed(0)} KB
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeIcon}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Active */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              {...form.register("isActive")}
            />
            نمایش در سایت (فعال)
          </label>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isUploading
              ? "در حال آپلود آیکون..."
              : isPending
                ? "در حال ذخیره..."
                : "ذخیره"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
