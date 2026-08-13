// src/components/layout/ConsultationForm/ConsultationFormClient.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Send,
  User,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

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
        setTimeout(() => setIsSuccess(false), 4000);
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
    <section className="relative overflow-hidden py-16 md:py-24  " id="consult-section"  >
      {/* ===== پس‌زمینه با گرادینت اصلاح شده ===== */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />

        {hasBackgroundImage && (
          <>
            <Image
              src={settings.backgroundImage}
              alt="پس‌زمینه فرم مشاوره"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          </>
        )}
      </div>

      {/* ===== محتوای اصلی ===== */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-xl">
          {/* عنوان */}
          <div className="mb-10 text-center xl:text-nowrap" >
            <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md md:text-4xl">
              {settings.title}
              {settings.clinicName && (
                <span className="text-secondary"> {settings.clinicName}</span>
              )}
            </h2>
            <p className="mt-3 text-sm text-white/80 drop-shadow md:text-base">
              {settings.subtitle}
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-secondary/80" />
          </div>

          {/* کارت فرم شیشه‌ای */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl md:p-10">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
                <div className="rounded-full bg-emerald-500/20 p-4 text-emerald-300 ring-8 ring-emerald-500/10">
                  <CheckCircle2 className="h-14 w-14" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-white">
                  درخواست شما با موفقیت ثبت شد!
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  به زودی کارشناسان ما با شما تماس خواهند گرفت.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* فیلد نام */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-white/90 md:text-sm">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                      <User className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      placeholder="مثال: علی محمدی"
                      className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pr-12 pl-4 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white focus:bg-white/15 focus:ring-4 focus:ring-white/10"
                      {...register("fullName")}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs font-medium text-rose-300">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* فیلد موضوع */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-white/90 md:text-sm">
                    مشاوره در چه زمینه‌ای؟
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      placeholder="مثال: تزریق ژل، لیزر، جراحی..."
                      className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pr-12 pl-4 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white focus:bg-white/15 focus:ring-4 focus:ring-white/10"
                      {...register("topic")}
                    />
                  </div>
                  {errors.topic && (
                    <p className="mt-1.5 text-xs font-medium text-rose-300">
                      {errors.topic.message}
                    </p>
                  )}
                </div>

                {/* فیلد شماره تماس */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-white/90 md:text-sm">
                    شماره تماس
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                      <Phone className="h-5 w-5" />
                    </span>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="09123456789"
                      className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pr-12 pl-4 text-right text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white focus:bg-white/15 focus:ring-4 focus:ring-white/10"
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-xs font-medium text-rose-300">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* دکمه ثبت */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-secondary to-secondary/80 py-4 font-bold text-secondary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-secondary/25 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
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
                        در حال ثبت اطلاعات...
                      </>
                    ) : (
                      <>
                        {settings.buttonText}
                        <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                      </>
                    )}
                  </span>
                </button>

                {/* متن راهنمای پایین فرم */}
                <p className="pt-2 text-center text-xs text-white/70">
                  <Calendar className="ml-1 inline h-3.5 w-3.5" />
                  اطلاعات شما محفوظ بوده و به زودی تماس خواهیم گرفت.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
