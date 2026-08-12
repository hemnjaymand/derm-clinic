import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { getSiteSettings, getPageBanner } from "@/features/settings/actions/settings.actions";
import PageBanner from "@/components/shared/page-banner";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "تماس با ما | کلینیک زیبایی",
  description: "اطلاعات تماس و آدرس کلینیک زیبایی",
};

export default async function ContactPage() {
  // دریافت همزمان اطلاعات سایت و بنر برای افزایش سرعت
  const [settings, banner] = await Promise.all([
    getSiteSettings(),
    getPageBanner("contact"),
  ]);

  // تبدیل آدرس فارسی به URL encoded برای نقشه
  const encodedAddress = settings.address
    ? encodeURIComponent(settings.address)
    : "";

  // لینک‌های نقشه
  const mapUrls = {
    // نقشه نشان (مسیریابی)
    neshan: encodedAddress
      ? `https://neshan.org/maps/search/${encodedAddress}`
      : null,
    // نقشه گوگل (اگر مختصات دارید می‌توانید lat,lng بدهید)
    google: encodedAddress
      ? `https://www.google.com/maps/search/${encodedAddress}`
      : null,
    // نقشه نشان - iframe embed
    neshanEmbed: encodedAddress
      ? `https://neshan.org/maps/embed?q=${encodedAddress}`
      : null,
  };

  // تعریف آیتم‌های تماس با رنگ‌بندی اختصاصی برای رابط کاربری بهتر
  const contactItems = [
    {
      id: "phone",
      icon: Phone,
      label: "تلفن تماس",
      value: settings.phone,
      href: settings.phone ? `tel:${settings.phone}` : null,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      ltr: true,
    },
    {
      id: "email",
      icon: Mail,
      label: "ایمیل",
      value: settings.email,
      href: settings.email ? `mailto:${settings.email}` : null,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      ltr: true,
    },
    {
      id: "address",
      icon: MapPin,
      label: "آدرس کلینیک",
      value: settings.address,
      href: null,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      ltr: false,
    },
  ];

  const hasAnyContactInfo = settings.phone || settings.address || settings.email;

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* نمایش بنر داینامیک */}
      {banner && <PageBanner fallbackTitle=" " banner={banner} />}

      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24" dir="rtl">
        {/* اگر بنر غیرفعال بود، عنوان ساده نمایش داده شود */}
        {!banner && (
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              راه‌های ارتباطی
            </h1>
            <p className="mt-3 text-muted-foreground">
              مشتاقانه پاسخگوی سوالات شما هستیم
            </p>
          </div>
        )}

        {/* بخش برجسته ساعات کاری */}
        {settings.workingHours && (
          <div className="mb-10 flex items-center justify-start gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm md:px-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground md:text-lg">
                ساعات کاری کلینیک
              </h3>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">
                {settings.workingHours}
              </p>
            </div>
          </div>
        )}

        {/* گرید راه‌های ارتباطی */}
        {hasAnyContactInfo ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {contactItems.map((item) => {
              if (!item.value) return null;

              const content = (
                <div className="group flex h-full items-center gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.bgColor} transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16`}
                  >
                    <item.icon
                      className={`h-7 w-7 md:h-8 md:w-8 ${item.color}`}
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="mb-1 text-sm font-medium text-muted-foreground">
                      {item.label}
                    </span>
                    <span
                      className="truncate font-semibold text-foreground md:text-lg"
                      dir={item.ltr ? "ltr" : "rtl"}
                      style={{ textAlign: item.ltr ? "right" : "initial" }}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block outline-none"
                  >
                    {content}
                  </Link>
                );
              }

              return <div key={item.id}>{content}</div>;
            })}
          </div>
        ) : (
          // حالت خالی (زمانی که ادمین هیچ دیتایی وارد نکرده)
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center">
            <Phone className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h2 className="text-lg font-medium text-foreground">
              اطلاعات تماس در حال به‌روزرسانی است
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              لطفاً بعداً مراجعه کنید.
            </p>
          </div>
        )}

        {/* ========== بخش نقشه ========== */}
        {settings.address && (
          <div className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                موقعیت روی نقشه
              </h2>
            </div>

            {/* کانتینر نقشه */}
            <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
              {/* iframe نقشه نشان */}
              {mapUrls.neshanEmbed && (
                <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
                  <iframe
                    src={mapUrls.neshanEmbed}
                    title="موقعیت کلینیک روی نقشه"
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    allowFullScreen
                  />
                </div>
              )}

              {/* fallback اگر نقشه لود نشد */}
              <div className="border-t border-border bg-muted/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {settings.address}
                </p>
              </div>
            </div>

            {/* دکمه‌های مسیریابی */}
            <div className="mt-5 flex flex-wrap gap-3">
              {mapUrls.neshan && (
                <a
                  href={mapUrls.neshan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:-translate-y-0.5 shadow-md"
                >
                  <MapPin className="h-4 w-4" />
                  مسیریابی با نشان
                </a>
              )}
              
              {mapUrls.google && (
                <a
                  href={mapUrls.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:-translate-y-0.5 shadow-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  مسیریابی با گوگل مپ
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}