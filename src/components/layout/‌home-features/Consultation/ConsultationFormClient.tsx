"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, User, Phone, MessageCircle, Calendar, CheckCircle2 } from "lucide-react";
import Image from "next/image";

// ============================================================
//  اسکیما برای اعتبارسنجی فرم
// ============================================================
const consultationSchema = z.object({
  fullName: z.string().min(2, "نام و نام خانوادگی الزامی است"),
  topic: z.string().min(2, "موضوع مشاوره الزامی است"),
  phone: z.string().min(10, "شماره تماس معتبر نیست"),
});

type ConsultationInput = z.infer<typeof consultationSchema>;

type ConsultationSettings = {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
  clinicName: string;
};

// ============================================================
//  کامپوننت کلاینت (فرم)
// ============================================================
export function ConsultationFormClient({
  settings,
}: {
  settings: ConsultationSettings;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: ConsultationInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("درخواست شما با موفقیت ثبت شد");
        reset();
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        toast.error("خطا در ثبت درخواست");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasBackgroundImage = Boolean(settings.backgroundImage);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* =====  پس‌زمینه ===== */}
      <div className="absolute inset-0 z-0">
        {/* گرادینت بنفش */}
        <div className="absolute inset-0 bg-liner-to-br from-primary/90 via-primary/60 to-primary/30" />

        {/* تصویر پس‌زمینه (در صورت وجود) */}
        {hasBackgroundImage && (
          <>
            <Image
              src={settings.backgroundImage}
              alt="پس‌زمینه فرم مشاوره"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </>
        )}
      </div>

      {/* =====  محتوای اصلی ===== */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          {/* عنوان */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
              {settings.title}
              {settings.clinicName && (
                <span className="text-secondary"> {settings.clinicName}</span>
              )}
            </h2>
            <p className="mt-2 text-white/80 drop-shadow">{settings.subtitle}</p>
          </div>

          {/* کارت فرم */}
          <div className="rounded-3xl bg-white/10 backdrop-blur-xl p-6 shadow-2xl md:p-8">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  درخواست شما ثبت شد!
                </h3>
                <p className="mt-2 text-white/70">
                  به زودی با شما تماس خواهیم گرفت
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* فیلد نام */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/90">
                    <User className="ml-1 inline h-4 w-4" />
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="مثال: علی محمدی"
                      className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-10 text-sm text-white placeholder:text-white/50 outline-none transition-all focus:border-white focus:ring-2 focus:ring-primary/20"
                      {...register("fullName")}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* فیلد موضوع */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/90">
                    <MessageCircle className="ml-1 inline h-4 w-4" />
                    مشاوره در چه زمینه‌ای؟
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="مثال: تزریق ژل، لیزر، جراحی پلک..."
                      className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-10 text-sm text-white placeholder:text-white/50 outline-none transition-all focus:border-white focus:ring-2 focus:ring-primary/20"
                      {...register("topic")}
                    />
                  </div>
                  {errors.topic && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.topic.message}
                    </p>
                  )}
                </div>

                {/* فیلد شماره تماس */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/90">
                    <Phone className="ml-1 inline h-4 w-4" />
                    شماره تماس
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="مثال: 09123456789"
                      className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-10 text-sm text-white placeholder:text-white/50 outline-none transition-all focus:border-white focus:ring-2 focus:ring-primary/20"
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* دکمه ثبت */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden rounded-xl bg-liner-to-r from-secondary to-secondary/80 py-3.5 font-medium text-secondary-foreground transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-secondary/25 disabled:opacity-70 disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        در حال ثبت...
                      </>
                    ) : (
                      <>
                        {settings.buttonText}
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>

                {/* متن زیر فرم */}
                <p className="text-center text-xs text-white/60">
                  <Calendar className="ml-1 inline h-3 w-3" />
                  پس از ثبت، کارشناسان ما در اسرع وقت با شما تماس می‌گیرند
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}