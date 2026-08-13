"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  X,
  Plus,
  Trash2,
  MapPin,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  basicSettingsSchema,
  type BasicSettingsInput,
} from "../schemas/site-settings.schema";
import { updateSiteSettingsAction } from "../actions/settings.actions";
import { ImageUploadField } from "./image-upload-field";
import Image from "next/image";
import { VideoUploadField } from "./VideoUploadField";

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
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <h3 className="border-b border-emerald-200/60 pb-3 font-semibold text-emerald-950">
              مجوز و نماد اعتماد
            </h3>
            <div className="space-y-2">
              <Label
                htmlFor="licenseText"
                className="text-xs font-medium text-muted-foreground"
              >
                متن یا کد مجوز
              </Label>
              <Input
                id="licenseText"
                className="h-9 bg-white/80 border-emerald-200 transition-colors focus-visible:ring-emerald-500"
                {...form.register("licenseText")}
              />
            </div>
          </section>

          {/* بنر اصلی */}
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <h3 className="border-b border-emerald-200/60 pb-3 font-semibold text-emerald-950">
              تصویر اصلی بنر
            </h3>
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
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <h3 className="border-b border-emerald-200/60 pb-3 font-semibold text-emerald-950">
              تصاویر اسلایدر
            </h3>
            <label className="block">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                multiple
                className="hidden"
                onChange={uploadBannerFiles}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white/80 border-emerald-200 transition-all hover:bg-emerald-100/50"
                disabled={isUploadingBanners}
                asChild
              >
                <span className="cursor-pointer">
                  {isUploadingBanners ? "در حال آپلود..." : "افزودن تصویر"}
                </span>
              </Button>
            </label>

            {bannerImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5">
                {bannerImages.map((url, index) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-emerald-200 bg-white/80 shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`اسلاید ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => removeBannerImage(index)}
                      className="absolute -left-1.5 -top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100 hover:scale-110"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* برندها */}
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
              <h3 className="font-semibold text-emerald-950">
                برندها / همکاران
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs hover:bg-emerald-100/70 hover:text-emerald-900"
                onClick={() =>
                  appendBrand({
                    id: crypto.randomUUID(),
                    name: "",
                    imageUrl: "",
                  })
                }
              >
                <Plus className="ml-1.5 h-3.5 w-3.5" />
                افزودن
              </Button>
            </div>
            {brandFields.length === 0 && (
              <p className="text-xs text-muted-foreground py-1">
                هنوز برندی اضافه نشده است.
              </p>
            )}
            <div className="space-y-3">
              {brandFields.map((field, index) => {
                // دریافت مقادیر زنده با form.watch جهت رندر آنی
                const currentImageUrl = form.watch(`brands.${index}.imageUrl`);
                const currentBrandName = form.watch(`brands.${index}.name`);

                return (
                  <div
                    key={field.id}
                    className="space-y-3 rounded-lg border border-emerald-200/60 bg-white/80 p-3.5 transition-colors hover:bg-emerald-50/50"
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="نام برند"
                        className="h-8 flex-1 text-xs bg-white border-emerald-200"
                        {...form.register(`brands.${index}.name`)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 hover:bg-destructive/10"
                        onClick={() => removeBrand(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>

                    <ImageUploadField
                      label="لوگو"
                      aspect="square"
                      value={currentImageUrl}
                      onChange={(url) =>
                        form.setValue(`brands.${index}.imageUrl`, url, {
                          shouldDirty: true,
                        })
                      }
                      folder="settings/brands"
                    />

                    {/* پیش‌نمایش لوگوی آپلود و رندر شده */}
                    {currentImageUrl && (
                      <div className="flex items-center gap-3 rounded-md border border-emerald-200/80 bg-emerald-50/50 p-2">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-emerald-300 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={currentImageUrl}
                            alt={currentBrandName || "لوگوی برند"}
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                        <div className="flex flex-col text-xs overflow-hidden">
                          <span className="font-medium text-emerald-950 truncate">
                            {currentBrandName || "برند بدون نام"}
                          </span>
                          <span
                            className="text-[10px] text-muted-foreground truncate"
                            dir="ltr"
                          >
                            {currentImageUrl}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* لینک‌های Footer */}
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
              <h3 className="font-semibold text-emerald-950">
                لینک‌های Footer
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs hover:bg-emerald-100/70 hover:text-emerald-900"
                onClick={() => appendLink({ label: "", href: "" })}
              >
                <Plus className="ml-1.5 h-3.5 w-3.5" />
                افزودن
              </Button>
            </div>
            {linkFields.length === 0 && (
              <p className="text-xs text-muted-foreground py-1">
                هنوز لینکی اضافه نشده است.
              </p>
            )}
            <div className="space-y-3">
              {linkFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-2.5 rounded-lg border border-emerald-200/60 bg-white/80 p-3.5 transition-colors hover:bg-emerald-50/50"
                >
                  <Input
                    placeholder="عنوان لینک"
                    className="h-8 text-xs bg-white border-emerald-200"
                    {...form.register(`usefulLinks.${index}.label`)}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="آدرس (https://...)"
                      dir="ltr"
                      className="h-8 flex-1 text-left text-xs font-mono bg-white border-emerald-200"
                      {...form.register(`usefulLinks.${index}.href`)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 hover:bg-destructive/10"
                      onClick={() => removeLink(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
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
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-emerald-200/60 pb-4">
              <h2 className="text-lg font-bold text-emerald-950">
                تنظیمات پایه کلینیک
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                اطلاعات هویتی و راه‌های ارتباطی کلینیک را وارد کنید.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName" className="text-xs font-medium">
                  نام کلینیک
                </Label>
                <Input
                  id="clinicName"
                  className="h-9 bg-white border-emerald-200 focus-visible:ring-emerald-500"
                  {...form.register("clinicName")}
                />
                {form.formState.errors.clinicName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.clinicName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium">
                    شماره تماس
                  </Label>
                  <Input
                    id="phone"
                    dir="ltr"
                    className="h-9 text-left font-mono text-xs bg-white border-emerald-200 focus-visible:ring-emerald-500"
                    {...form.register("phone")}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium">
                    ایمیل
                  </Label>
                  <Input
                    id="email"
                    dir="ltr"
                    className="h-9 text-left font-mono text-xs bg-white border-emerald-200 focus-visible:ring-emerald-500"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs font-medium">
                  آدرس
                </Label>
                <Input
                  id="address"
                  className="h-9 bg-white border-emerald-200 focus-visible:ring-emerald-500"
                  {...form.register("address")}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-xs font-medium">
                    آیدی اینستاگرام
                  </Label>
                  <Input
                    id="instagram"
                    dir="ltr"
                    className="h-9 text-left font-mono text-xs bg-white border-emerald-200 focus-visible:ring-emerald-500"
                    placeholder="@username"
                    {...form.register("instagram")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours" className="text-xs font-medium">
                    ساعات کاری (نمایشی)
                  </Label>
                  <Input
                    id="workingHours"
                    className="h-9 bg-white border-emerald-200 focus-visible:ring-emerald-500"
                    placeholder="شنبه تا چهارشنبه ۹ تا ۱۷"
                    {...form.register("workingHours")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutText" className="text-xs font-medium">
                  متن درباره‌ی ما
                </Label>
                <textarea
                  id="aboutText"
                  rows={5}
                  className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                  {...form.register("aboutText")}
                />
              </div>
            </div>
          </section>

          {/* فرم مشاوره */}
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-emerald-200/60 pb-4">
              <h2 className="text-lg font-bold text-emerald-950">
                تنظیمات فرم مشاوره
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                متن‌ها و تصویر پس‌زمینه فرم درخواست مشاوره را تنظیم کنید.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="درخواست مشاوره رایگان"
                className="h-9 bg-white border-emerald-200 focus-visible:ring-emerald-500"
                {...form.register("consultationTitle")}
              />
              <Input
                placeholder="تنها سه قدم تا رزرو وقت"
                className="h-9 bg-white border-emerald-200 focus-visible:ring-emerald-500"
                {...form.register("consultationSubtitle")}
              />
              <Input
                placeholder="ثبت درخواست"
                className="h-9 bg-white border-emerald-200 focus-visible:ring-emerald-500"
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

          {/* پس‌زمینه‌ی بخش‌های صفحه اصلی */}
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-emerald-200/60 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-950">
                <ImageIcon className="h-5 w-5 text-emerald-700" />
                پس‌زمینه‌ی بخش‌های صفحه اصلی
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
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
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-4">
              <div>
                <h2 className="text-lg font-bold text-emerald-950">
                  ویدئوهای نظرات مراجعین
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  ویدئوهای رضایت مراجعین که در صفحه اصلی نمایش داده می‌شوند.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 bg-white text-xs border-emerald-200 hover:bg-emerald-100/70 hover:text-emerald-900"
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
                <Plus className="ml-1.5 h-3.5 w-3.5" />
                افزودن ویدئو
              </Button>
            </div>

            {videoFields.length === 0 && (
              <p className="py-1 text-xs text-muted-foreground">
                هنوز ویدئویی اضافه نشده است.
              </p>
            )}

            <div className="space-y-4">
              {videoFields.map((field: any, index: number) => {
                // خواندن مقادیر زنده فرم جهت نمایش پیش‌نمایش
                const currentThumbnail = form.watch(
                  `videoTestimonials.${index}.thumbnailImage`,
                );
                const currentVideoUrl = form.watch(
                  `videoTestimonials.${index}.videoUrl`,
                );

                return (
                  <div
                    key={field.id}
                    className="space-y-4 rounded-lg border border-emerald-200/60 bg-white/80 p-4 transition-colors hover:bg-emerald-50/50"
                  >
                    {/* بخش پیش‌نمایش تصویر و ویدئو (در صورت وجود) */}
                    {(currentThumbnail || currentVideoUrl) && (
                      <div className="grid gap-3 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3 sm:grid-cols-2">
                        {/* پیش‌نمایش Thumbnail */}
                        <div className="space-y-1">
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-900">
                            <ImageIcon className="h-3 w-3" /> پیش‌نمایش تصویر
                            کاور:
                          </span>
                          <div className="relative aspect-video overflow-hidden rounded-md border border-emerald-200 bg-muted">
                            {currentThumbnail ? (
                              <Image
                                src={currentThumbnail}
                                alt="Thumbnail preview"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                بدون کاور
                              </div>
                            )}
                          </div>
                        </div>

                        {/* پیش‌نمایش ویدئو */}
                        <div className="space-y-1">
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-900">
                            <Video className="h-3 w-3" /> پیش‌نمایش ویدئو:
                          </span>
                          <div className="relative aspect-video overflow-hidden rounded-md border border-emerald-200 bg-black">
                            {currentVideoUrl ? (
                              <video
                                src={currentVideoUrl}
                                controls
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-white/60">
                                بدون ویدئو
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* هدر آیتم و دکمه حذف */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="نام مراجع"
                          className="h-8 border-emerald-200 bg-white text-xs"
                          {...form.register(`videoTestimonials.${index}.name`)}
                        />
                        <Input
                          placeholder="توضیح کوتاه"
                          className="h-8 border-emerald-200 bg-white text-xs"
                          {...form.register(
                            `videoTestimonials.${index}.description`,
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 hover:bg-destructive/10"
                        onClick={() => removeVideo(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>

                    {/* ورودی‌های عدد و مدت زمان */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        dir="ltr"
                        placeholder="امتیاز (۱ تا ۵)"
                        className="h-8 border-emerald-200 bg-white font-mono text-xs"
                        {...form.register(`videoTestimonials.${index}.rating`, {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        dir="ltr"
                        placeholder="مدت زمان (0:45)"
                        className="h-8 border-emerald-200 bg-white font-mono text-xs"
                        {...form.register(
                          `videoTestimonials.${index}.duration`,
                        )}
                      />
                    </div>

                    {/* بخش آپلود فایل ویدئو و تصویر بندانگشتی */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {/* آپلود ویدئو */}
                      <VideoUploadField
                        label="فایل ویدئو"
                        value={form.watch(
                          `videoTestimonials.${index}.videoUrl`,
                        )}
                        onChange={(url: string) =>
                          form.setValue(
                            `videoTestimonials.${index}.videoUrl`,
                            url,
                            {
                              shouldDirty: true,
                            },
                          )
                        }
                        folder="settings/videos"
                      />

                      {/* آپلود تصویر کاور */}
                      <ImageUploadField
                        label="تصویر بندانگشتی (Thumbnail)"
                        value={form.watch(
                          `videoTestimonials.${index}.thumbnailImage`,
                        )}
                        onChange={(url: string) =>
                          form.setValue(
                            `videoTestimonials.${index}.thumbnailImage`,
                            url,
                            { shouldDirty: true },
                          )
                        }
                        folder="settings/testimonials"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* مختصات نقشه */}
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-emerald-200/60 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-950">
                <MapPin className="h-5 w-5 text-emerald-700" />
                مختصات نقشه
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                برای نمایش موقعیت کلینیک روی نقشه، مختصات را وارد کنید.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-xs font-medium">
                  عرض جغرافیایی (Latitude)
                </Label>
                <Input
                  id="latitude"
                  dir="ltr"
                  className="h-9 text-left font-mono text-xs bg-white border-emerald-200 focus-visible:ring-emerald-500"
                  placeholder="29.626831"
                  {...form.register("latitude")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-xs font-medium">
                  طول جغرافیایی (Longitude)
                </Label>
                <Input
                  id="longitude"
                  dir="ltr"
                  className="h-9 text-left font-mono text-xs bg-white border-emerald-200 focus-visible:ring-emerald-500"
                  placeholder="52.498788"
                  {...form.register("longitude")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapZoom" className="text-xs font-medium">
                  بزرگنمایی نقشه (Zoom)
                </Label>
                <Input
                  id="mapZoom"
                  type="number"
                  dir="ltr"
                  className="h-9 text-left font-mono text-xs bg-white border-emerald-200 focus-visible:ring-emerald-500"
                  placeholder="16"
                  min={1}
                  max={22}
                  {...form.register("mapZoom", { valueAsNumber: true })}
                />
              </div>
            </div>
          </section>

          {/* ذخیره */}
          <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm transition-all hover:shadow-md">
            <Button
              type="submit"
              disabled={isPending || isUploadingBanners}
              className="w-full px-8 sm:w-auto transition-all shadow-sm hover:shadow bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {isPending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </Button>
          </section>
        </div>
      </div>
    </form>
  );
}
