"use client";

import { useRef, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  homeContentSchema,
  type HomeContentInput,
} from "../schemas/site-settings.schema";
import { updateHomeContentAction } from "../actions/settings.actions";

function ImageUploadField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
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
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleUpload}
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="ml-2 h-4 w-4" />
          {isUploading ? "در حال آپلود..." : value ? "تغییر" : "انتخاب"}
        </Button>
        {value && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={value}
            alt={label}
            className="h-12 w-12 rounded object-cover"
          />
        )}
      </div>
    </div>
  );
}

export function HomeContentForm({
  initialData,
}: {
  initialData: HomeContentInput;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<HomeContentInput>({
    resolver: zodResolver(homeContentSchema),
    defaultValues: {
      features: initialData.features ?? [],
      // نکته‌ی کلیدی رفع باگ: serviceDetail همیشه یک id واقعی دارد (موجود یا تازه‌ساخته‌شده)
      // چون serviceDetail برخلاف features/serviceTags یک آرایه نیست، هیچ append() ای برایش id نمی‌سازد
      serviceDetail: {
        id: initialData.serviceDetail?.id ?? crypto.randomUUID(),
        title: initialData.serviceDetail?.title ?? "",
        description: initialData.serviceDetail?.description ?? "",
        recoveryTime: initialData.serviceDetail?.recoveryTime ?? "",
        needsRenewal: initialData.serviceDetail?.needsRenewal ?? "",
        needsAnesthesia: initialData.serviceDetail?.needsAnesthesia ?? "",
        longevity: initialData.serviceDetail?.longevity ?? "",
        ctaText: initialData.serviceDetail?.ctaText ?? "",
        ctaLink: initialData.serviceDetail?.ctaLink ?? "",
        doctorName: initialData.serviceDetail?.doctorName ?? "",
        doctorTitle: initialData.serviceDetail?.doctorTitle ?? "",
        backgroundImage: initialData.serviceDetail?.backgroundImage ?? "",
      },
      serviceTags: initialData.serviceTags ?? [],
      recentShowcaseCases: initialData.recentShowcaseCases ?? [],
    },
  });

  const featuresArray = useFieldArray({
    control: form.control,
    name: "features",
  });
  const tagsArray = useFieldArray({
    control: form.control,
    name: "serviceTags",
  });
  const casesArray = useFieldArray({
    control: form.control,
    name: "recentShowcaseCases",
  });

  function onSubmit(values: HomeContentInput) {
    startTransition(async () => {
      const result = await updateHomeContentAction(values);
      if (result.success) toast.success("محتوای صفحه اصلی ذخیره شد");
      else toast.error(result.error);
    });
  }

  // این تابع دقیقاً همون مشکلی که الان داشتی رو در آینده قابل‌مشاهده می‌کنه —
  // به‌جای اینکه فرم بی‌صدا هیچ‌کاری نکنه، خطای دقیق Validation رو نشون می‌ده
  function onInvalid(errors: typeof form.formState.errors) {
    console.error("❌ خطای اعتبارسنجی فرم:", errors);
    toast.error("اطلاعات فرم ناقص یا نامعتبر است — جزئیات در Console");
  }

  return (
  <form
    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
    className="space-y-10"
    dir="rtl"
  >
    {/* فیلد مخفی برای id */}
    <input type="hidden" {...form.register("serviceDetail.id")} />

    {/* ===== بخش ویژگی‌ها (Features) ===== */}
    <section className="space-y-4 rounded-2xl border border-border/40 bg-card/30 p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">ویژگی‌ها (Features)</h2>
          <p className="text-xs text-muted-foreground mt-0.5">افزودن ویژگی‌های کلیدی خدمات</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            featuresArray.append({
              id: crypto.randomUUID(),
              title: "",
              description: "",
              icon: "",
            })
          }
          className="gap-2 rounded-xl shadow-xs  "
        >
          <Plus className="h-4 w-4" />
          افزودن ویژگی
        </Button>
      </div>

      <div className="space-y-3">
        {featuresArray.fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/30 p-4 shadow-xs transition-all"
          >
            <div className="flex-1 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="عنوان ویژگی"
                  className="rounded-xl"
                  {...form.register(`features.${index}.title`)}
                />
                <Input
                  placeholder="نام آیکون (اختیاری)"
                  className="rounded-xl"
                  dir="ltr"
                  {...form.register(`features.${index}.icon`)}
                />
              </div>
              <Input
                placeholder="توضیح کوتاه"
                className="rounded-xl"
                {...form.register(`features.${index}.description`)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-1 h-9 w-9 rounded-xl hover:bg-destructive/10"
              onClick={() => featuresArray.remove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </section>

    {/* ===== بخش خدمت ویژه‌ی صفحه اصلی ===== */}
    <section className="space-y-4 rounded-2xl border border-border/40 bg-card/30 p-5 shadow-sm md:p-6">
      <div className="border-b border-border/40 pb-4">
        <h2 className="text-base font-bold text-foreground">خدمت ویژه‌ی نمایش در صفحه اصلی</h2>
        <p className="text-xs text-muted-foreground mt-0.5">مشخصات تکمیلی بخش ویژه کلینیک</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          placeholder="عنوان"
          className="rounded-xl"
          {...form.register("serviceDetail.title")}
        />
        <Input
          placeholder="زمان بهبودی"
          className="rounded-xl"
          {...form.register("serviceDetail.recoveryTime")}
        />
        <Input
          placeholder="نیاز به تکرار"
          className="rounded-xl"
          {...form.register("serviceDetail.needsRenewal")}
        />
        <Input
          placeholder="نیاز به بی‌حسی"
          className="rounded-xl"
          {...form.register("serviceDetail.needsAnesthesia")}
        />
        <Input
          placeholder="ماندگاری"
          className="rounded-xl"
          {...form.register("serviceDetail.longevity")}
        />
        <Input
          placeholder="متن دکمه"
          className="rounded-xl"
          {...form.register("serviceDetail.ctaText")}
        />
        <Input
          placeholder="لینک دکمه"
          className="rounded-xl"
          dir="ltr"
          {...form.register("serviceDetail.ctaLink")}
        />
        <Input
          placeholder="نام پزشک"
          className="rounded-xl"
          {...form.register("serviceDetail.doctorName")}
        />
        <Input
          placeholder="عنوان پزشک"
          className="rounded-xl sm:col-span-2"
          {...form.register("serviceDetail.doctorTitle")}
        />
      </div>

      <textarea
        placeholder="توضیحات کامل"
        rows={4}
        className="flex w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        {...form.register("serviceDetail.description")}
      />
    </section>

    {/* ===== تصویر پس‌زمینه ===== */}
    <section className="space-y-4 rounded-2xl border border-border/40 bg-card/30 p-5 shadow-sm md:p-6">
      <div className="border-b border-border/40 pb-4">
        <h2 className="text-base font-bold text-foreground">تصویر پس‌زمینه</h2>
      </div>
      <ImageUploadField
        label="تصویر پس‌زمینه‌ی این بخش"
        value={form.watch("serviceDetail.backgroundImage") || ""}
        onChange={(url) =>
          form.setValue("serviceDetail.backgroundImage", url, {
            shouldDirty: true,
          })
        }
        folder="settings/service-detail"
      />
    </section>

    {/* ===== برچسب‌های خدمات ===== */}
    <section className="space-y-4 rounded-2xl border border-border/40 bg-card/30 p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">برچسب‌های خدمات</h2>
          <p className="text-xs text-muted-foreground mt-0.5">تگ‌های فیلتر خدمات در صفحه</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            tagsArray.append({ id: crypto.randomUUID(), label: "", href: "" })
          }
          className="gap-2 rounded-xl shadow-xs"
        >
          <Plus className="h-4 w-4" />
          افزودن برچسب
        </Button>
      </div>

      <div className="space-y-3">
        {tagsArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/30 p-3 shadow-xs">
            <Input
              placeholder="عنوان"
              className="rounded-xl"
              {...form.register(`serviceTags.${index}.label`)}
            />
            <Input
              placeholder="لینک"
              className="rounded-xl"
              dir="ltr"
              {...form.register(`serviceTags.${index}.href`)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-destructive/10"
              onClick={() => tagsArray.remove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </section>

    {/* ===== نمونه‌کارهای قبل/بعد ===== */}
    <section className="space-y-4 rounded-2xl border border-border/40 bg-card/30 p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">نمونه‌کارهای قبل/بعد</h2>
          <p className="text-xs text-muted-foreground mt-0.5">مدیریت تصاویر گالری نتایج مراجعین</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            casesArray.append({
              id: crypto.randomUUID(),
              name: "",
              service: "",
              beforeImage: "",
              afterImage: "",
            })
          }
          className="gap-2 rounded-xl shadow-xs"
        >
          <Plus className="h-4 w-4" />
          افزودن نمونه‌کار
        </Button>
      </div>

      <div className="space-y-4">
        {casesArray.fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-2xl border border-border/60 bg-card/30 p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <Input
                  placeholder="نام مراجع (نمایشی)"
                  className="rounded-xl"
                  {...form.register(`recentShowcaseCases.${index}.name`)}
                />
                <Input
                  placeholder="نام خدمت"
                  className="rounded-xl"
                  {...form.register(`recentShowcaseCases.${index}.service`)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-destructive/10"
                onClick={() => casesArray.remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/40">
              <ImageUploadField
                label="تصویر قبل"
                value={
                  form.watch(`recentShowcaseCases.${index}.beforeImage`) || ""
                }
                onChange={(url) =>
                  form.setValue(
                    `recentShowcaseCases.${index}.beforeImage`,
                    url,
                    { shouldDirty: true },
                  )
                }
                folder="settings/showcase"
              />
              <ImageUploadField
                label="تصویر بعد"
                value={
                  form.watch(`recentShowcaseCases.${index}.afterImage`) || ""
                }
                onChange={(url) =>
                  form.setValue(
                    `recentShowcaseCases.${index}.afterImage`,
                    url,
                    { shouldDirty: true },
                  )
                }
                folder="settings/showcase"
              />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* دکمه نهایی ارسال */}
    <div className="sticky bottom-4 z-20 flex justify-end bg-background/80 backdrop-blur-md pt-4 pb-2 border-t border-border/40">
      <Button 
        type="submit" 
        disabled={isPending}
        size="lg"
        className="w-full sm:w-auto px-8 rounded-xl shadow-lg transition-all"
      >
        {isPending ? "در حال ذخیره تغییرات..." : "ذخیره محتوای صفحه اصلی"}
      </Button>
    </div>
  </form>
);
 }