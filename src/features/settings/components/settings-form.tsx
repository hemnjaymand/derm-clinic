"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, Plus, Trash2, MapPin, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  basicSettingsSchema,
  type BasicSettingsInput,
} from "../schemas/site-settings.schema";
import { updateSiteSettingsAction } from "../actions/settings.actions";
import { ImageUploadField } from "./image-upload-field";

export function SettingsForm({
  initialData,
}: {
  initialData: BasicSettingsInput;
}) {
  const [isPending, startTransition] = useTransition();
  const [isUploadingBanners, setIsUploadingBanners] = useState(false);

  const form = useForm<BasicSettingsInput>({
    resolver: zodResolver(basicSettingsSchema),
    defaultValues: {
      ...initialData,
      bannerImages: initialData.bannerImages ?? [],
      usefulLinks: initialData.usefulLinks ?? [],
      brands: initialData.brands ?? [],
      videoTestimonials: initialData.videoTestimonials ?? [],
      mapZoom: initialData.mapZoom ?? 16,
    },
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "usefulLinks",
  });

  const {
    fields: brandFields,
    append: appendBrand,
    remove: removeBrand,
  } = useFieldArray({
    control: form.control,
    name: "brands",
  });

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control: form.control,
    name: "videoTestimonials",
  });

  const bannerImages = form.watch("bannerImages") ?? [];

  async function uploadBannerFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setIsUploadingBanners(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "settings/banners");
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          return response.ok ? (data.url as string) : null;
        }),
      );
      const validUrls = uploadedUrls.filter((url): url is string => !!url);
      form.setValue("bannerImages", [...bannerImages, ...validUrls], {
        shouldDirty: true,
      });
    } finally {
      setIsUploadingBanners(false);
      e.target.value = "";
    }
  }

  function removeBannerImage(index: number) {
    form.setValue(
      "bannerImages",
      bannerImages.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  }

  function onSubmit(values: BasicSettingsInput) {
    startTransition(async () => {
      const result = await updateSiteSettingsAction(values);
      if (result.success) toast.success("تنظیمات ذخیره شد");
      else toast.error(result.error);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full" dir="rtl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ستون سایدبار */}
        <div className="flex w-full shrink-0 flex-col gap-6 lg:w-96 order-2 lg:order-1">
          {/* مجوز */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="border-b pb-2 font-semibold">مجوز و نماد اعتماد</h3>
            <div className="space-y-2">
              <Label htmlFor="licenseText">متن یا کد مجوز</Label>
              <Input id="licenseText" {...form.register("licenseText")} />
            </div>
          </section>

          {/* بنر اصلی */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="border-b pb-2 font-semibold">تصویر اصلی بنر</h3>
            <ImageUploadField
              label=""
              value={form.watch("heroImageUrl")}
              onChange={(url) =>
                form.setValue("heroImageUrl", url, { shouldDirty: true })
              }
              folder="settings/hero"
            />
          </section>

          {/* اسلایدر */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="border-b pb-2 font-semibold">تصاویر اسلایدر</h3>
            <label className="block">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={uploadBannerFiles}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isUploadingBanners}
                asChild
              >
                <span className="cursor-pointer">
                  {isUploadingBanners ? "در حال آپلود..." : "افزودن تصویر"}
                </span>
              </Button>
            </label>

            {bannerImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {bannerImages.map((url, index) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-md border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`اسلاید ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeBannerImage(index)}
                      className="absolute -left-1.5 -top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* برندها */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold">برندها / همکاران</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  appendBrand({
                    id: crypto.randomUUID(),
                    name: "",
                    imageUrl: "",
                  })
                }
              >
                <Plus className="ml-2 h-4 w-4" />
                افزودن
              </Button>
            </div>
            {brandFields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                هنوز برندی اضافه نشده است.
              </p>
            )}
            <div className="space-y-3">
              {brandFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-2 rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="نام برند"
                      className="h-8 flex-1 text-sm"
                      {...form.register(`brands.${index}.name`)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => removeBrand(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <ImageUploadField
                    label="لوگو"
                    aspect="square"
                    value={form.watch(`brands.${index}.imageUrl`)}
                    onChange={(url) =>
                      form.setValue(`brands.${index}.imageUrl`, url, {
                        shouldDirty: true,
                      })
                    }
                    folder="settings/brands"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* لینک‌های Footer */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold">لینک‌های Footer</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => appendLink({ label: "", href: "" })}
              >
                <Plus className="ml-2 h-4 w-4" />
                افزودن
              </Button>
            </div>
            {linkFields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                هنوز لینکی اضافه نشده است.
              </p>
            )}
            <div className="space-y-3">
              {linkFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-2 rounded-lg border bg-muted/30 p-3"
                >
                  <Input
                    placeholder="عنوان لینک"
                    className="h-8 text-sm"
                    {...form.register(`usefulLinks.${index}.label`)}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="آدرس (https://...)"
                      dir="ltr"
                      className="h-8 flex-1 text-left text-sm"
                      {...form.register(`usefulLinks.${index}.href`)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => removeLink(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ستون اصلی */}
        <div className="flex w-full flex-1 flex-col gap-6 order-1 lg:order-2">
          {/* اطلاعات پایه */}
          <section className="space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold">تنظیمات پایه کلینیک</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                اطلاعات هویتی و راه‌های ارتباطی کلینیک را وارد کنید.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName">نام کلینیک</Label>
                <Input id="clinicName" {...form.register("clinicName")} />
                {form.formState.errors.clinicName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.clinicName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره تماس</Label>
                  <Input
                    id="phone"
                    dir="ltr"
                    className="text-left"
                    {...form.register("phone")}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    dir="ltr"
                    className="text-left"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">آدرس</Label>
                <Input id="address" {...form.register("address")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instagram">آیدی اینستاگرام</Label>
                  <Input
                    id="instagram"
                    dir="ltr"
                    className="text-left"
                    placeholder="@username"
                    {...form.register("instagram")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours">ساعات کاری (نمایشی)</Label>
                  <Input
                    id="workingHours"
                    placeholder="شنبه تا چهارشنبه ۹ تا ۱۷"
                    {...form.register("workingHours")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutText">متن درباره‌ی ما</Label>
                <textarea
                  id="aboutText"
                  rows={6}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...form.register("aboutText")}
                />
              </div>
            </div>
          </section>

          {/* فرم مشاوره */}
          <section className="space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold">تنظیمات فرم مشاوره</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                متن‌ها و تصویر پس‌زمینه فرم درخواست مشاوره را تنظیم کنید.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="درخواست مشاوره رایگان"
                {...form.register("consultationTitle")}
              />
              <Input
                placeholder="تنها سه قدم تا رزرو وقت"
                {...form.register("consultationSubtitle")}
              />
              <Input
                placeholder="ثبت درخواست"
                {...form.register("consultationButtonText")}
              />
              <ImageUploadField
                label="تصویر پس‌زمینه فرم مشاوره"
                value={form.watch("consultationBackgroundImage")}
                onChange={(url) =>
                  form.setValue("consultationBackgroundImage", url, {
                    shouldDirty: true,
                  })
                }
                folder="settings/consultation"
              />
            </div>
          </section>

          {/* پس‌زمینه‌ی بخش‌های صفحه اصلی — جدید */}
          <section className="space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="border-b pb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <ImageIcon className="h-5 w-5 text-primary" />
                پس‌زمینه‌ی بخش‌های صفحه اصلی
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                تصویر پس‌زمینه‌ی هر بخش را که در صفحه اصلی نمایش داده می‌شود
                تنظیم کنید.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <ImageUploadField
                label="پس‌زمینه‌ی بخش ویژگی‌ها (Features)"
                value={form.watch("featuresBackgroundImage")}
                onChange={(url) =>
                  form.setValue("featuresBackgroundImage", url, {
                    shouldDirty: true,
                  })
                }
                folder="settings/backgrounds"
              />
              <ImageUploadField
                label="پس‌زمینه‌ی بخش ویدئوهای نظرات مراجعین"
                value={form.watch("videoTestimonialsBackgroundImage")}
                onChange={(url) =>
                  form.setValue("videoTestimonialsBackgroundImage", url, {
                    shouldDirty: true,
                  })
                }
                folder="settings/backgrounds"
              />
              <ImageUploadField
                label="پس‌زمینه‌ی بخش نمونه‌کارهای اخیر"
                value={form.watch("recentPatientsBackgroundImage")}
                onChange={(url) =>
                  form.setValue("recentPatientsBackgroundImage", url, {
                    shouldDirty: true,
                  })
                }
                folder="settings/backgrounds"
              />
          
            </div>
          </section>

          {/* ویدئو تستیمونیال‌ها — جدید (چون Schema داشت ولی UI نداشت) */}
          <section className="space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-bold">ویدئوهای نظرات مراجعین</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  ویدئوهای رضایت مراجعین که در صفحه اصلی نمایش داده می‌شوند.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendVideo({
                    id: crypto.randomUUID(),
                    name: "",
                    description: "",
                    rating: 5,
                    duration: "0:00",
                    thumbnailImage: "",
                    videoUrl: "",
                  })
                }
              >
                <Plus className="ml-2 h-4 w-4" />
                افزودن ویدئو
              </Button>
            </div>

            {videoFields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                هنوز ویدئویی اضافه نشده است.
              </p>
            )}

            <div className="space-y-4">
              {videoFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 rounded-lg border bg-muted/30 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="نام مراجع"
                        {...form.register(`videoTestimonials.${index}.name`)}
                      />
                      <Input
                        placeholder="توضیح کوتاه"
                        {...form.register(
                          `videoTestimonials.${index}.description`,
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVideo(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      dir="ltr"
                      placeholder="امتیاز (۱ تا ۵)"
                      {...form.register(`videoTestimonials.${index}.rating`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      dir="ltr"
                      placeholder="مدت زمان (0:45)"
                      {...form.register(`videoTestimonials.${index}.duration`)}
                    />
                  </div>
                  <Input
                    dir="ltr"
                    placeholder="آدرس ویدئو (اختیاری)"
                    {...form.register(`videoTestimonials.${index}.videoUrl`)}
                  />
                  <ImageUploadField
                    label="تصویر بندانگشتی (Thumbnail)"
                    value={form.watch(
                      `videoTestimonials.${index}.thumbnailImage`,
                    )}
                    onChange={(url) =>
                      form.setValue(
                        `videoTestimonials.${index}.thumbnailImage`,
                        url,
                        { shouldDirty: true },
                      )
                    }
                    folder="settings/testimonials"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* مختصات نقشه */}
          <section className="space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="border-b pb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <MapPin className="h-5 w-5 text-primary" />
                مختصات نقشه
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                برای نمایش موقعیت کلینیک روی نقشه، مختصات را وارد کنید.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="latitude">عرض جغرافیایی (Latitude)</Label>
                <Input
                  id="latitude"
                  dir="ltr"
                  className="text-left font-mono text-sm"
                  placeholder="29.626831"
                  {...form.register("latitude")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">طول جغرافیایی (Longitude)</Label>
                <Input
                  id="longitude"
                  dir="ltr"
                  className="text-left font-mono text-sm"
                  placeholder="52.498788"
                  {...form.register("longitude")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapZoom">بزرگنمایی نقشه (Zoom)</Label>
                <Input
                  id="mapZoom"
                  type="number"
                  dir="ltr"
                  className="text-left font-mono text-sm"
                  placeholder="16"
                  min={1}
                  max={22}
                  {...form.register("mapZoom", { valueAsNumber: true })}
                />
              </div>
            </div>
          </section>

          {/* ذخیره */}
          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <Button
              type="submit"
              disabled={isPending || isUploadingBanners}
              className="w-full px-8 sm:w-auto"
            >
              {isPending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </Button>
          </section>
        </div>
      </div>
    </form>
  );
}
