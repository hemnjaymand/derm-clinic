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
      {/* فیلد مخفی برای id — بدون این، سرور هیچ‌وقت Validation رو رد می‌کرد */}
      <input type="hidden" {...form.register("serviceDetail.id")} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">ویژگی‌ها (Features)</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              featuresArray.append({
                id: crypto.randomUUID(),
                title: "",
                description: "",
              })
            }
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن
          </Button>
        </div>
        {featuresArray.fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-start gap-2 rounded-md border p-3"
          >
            <div className="flex-1 space-y-2">
              <Input
                placeholder="عنوان"
                {...form.register(`features.${index}.title`)}
              />
              <Input
                placeholder="توضیح"
                {...form.register(`features.${index}.description`)}
              />
              <Input
                placeholder="نام آیکون (اختیاری)"
                {...form.register(`features.${index}.icon`)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => featuresArray.remove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </section>

      <section className="space-y-3 border-t pt-6">
        <h2 className="font-medium">خدمت ویژه‌ی نمایش در صفحه اصلی</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="عنوان"
            {...form.register("serviceDetail.title")}
          />
          <Input
            placeholder="زمان بهبودی"
            {...form.register("serviceDetail.recoveryTime")}
          />
          <Input
            placeholder="نیاز به تکرار"
            {...form.register("serviceDetail.needsRenewal")}
          />
          <Input
            placeholder="نیاز به بی‌حسی"
            {...form.register("serviceDetail.needsAnesthesia")}
          />
          <Input
            placeholder="ماندگاری"
            {...form.register("serviceDetail.longevity")}
          />
          <Input
            placeholder="متن دکمه"
            {...form.register("serviceDetail.ctaText")}
          />
          <Input
            placeholder="لینک دکمه"
            dir="ltr"
            {...form.register("serviceDetail.ctaLink")}
          />
          <Input
            placeholder="نام پزشک"
            {...form.register("serviceDetail.doctorName")}
          />
          <Input
            placeholder="عنوان پزشک"
            {...form.register("serviceDetail.doctorTitle")}
          />
        </div>
        <textarea
          placeholder="توضیحات کامل"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register("serviceDetail.description")}
        />
      </section>
      <section className="space-y-3 border-t pt-6">
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

      <section className="space-y-3 border-t pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">برچسب‌های خدمات</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              tagsArray.append({ id: crypto.randomUUID(), label: "", href: "" })
            }
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن
          </Button>
        </div>
        {tagsArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder="عنوان"
              {...form.register(`serviceTags.${index}.label`)}
            />
            <Input
              placeholder="لینک"
              dir="ltr"
              {...form.register(`serviceTags.${index}.href`)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => tagsArray.remove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </section>

      <section className="space-y-3 border-t pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">نمونه‌کارهای قبل/بعد</h2>
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
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن
          </Button>
        </div>
        {casesArray.fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-md border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="نام (نمایشی)"
                  {...form.register(`recentShowcaseCases.${index}.name`)}
                />
                <Input
                  placeholder="نام خدمت"
                  {...form.register(`recentShowcaseCases.${index}.service`)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => casesArray.remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
      </section>

      <Button type="submit" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره محتوای صفحه اصلی"}
      </Button>
    </form>
  );
}
