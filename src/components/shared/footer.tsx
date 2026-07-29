import Link from "next/link";
import { PUBLIC_NAV_ITEMS } from "@/constants/routes";
import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  CalendarDays,
  // Instagram
  Camera
} from "lucide-react";
// import { Camera, Image, Share2 } from "lucide-react";
// ============================================================
//  کامپوننت فوتر
// ============================================================
export async function Footer() {
  const settings = await getSiteSettings();

  const clinicName = settings.clinicName || "کلینیک زیبایی";
  const licenseText =
    settings.licenseText || "با مجوز رسمی از وزارت بهداشت، درمان و آموزش پزشکی";

  // ==========================================================
  //  ساختار لینک‌های شبکه‌های اجتماعی (برای نمایش در فوتر)
  // ==========================================================
  const socialLinks = [
    {
      icon: <Camera className="h-4 w-4" />,
      label: "اینستاگرام",
      href: settings.instagram
        ? `https://instagram.com/${settings.instagram.replace("@", "")}`
        : null,
      username: settings.instagram || null,
    },
  ];

  return (
    <footer className="border-t border-primary-foreground/20 bg-primary text-primary-foreground">
      {/* ==========================================================
          هدر فوتر: معرفی کلینیک
          ========================================================== */}
      <div className="container mx-auto px-4 pt-14">
        <div className="mx-auto max-w-3xl border-b border-primary-foreground/20 pb-10 text-center">
          {/* لوگو/نام کلینیک */}
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {clinicName}
          </h2>

          {/* توضیحات */}
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 md:text-base">
            درمانگاه تخصصی پوست، مو و زیبایی
            {licenseText && `، ${licenseText}`}
          </p>

          {/* خط تزئینی */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-0.5 w-12 rounded-full bg-secondary/60" />
            <span className="h-1 w-3 rounded-full bg-secondary" />
            <span className="h-0.5 w-12 rounded-full bg-secondary/60" />
          </div>
        </div>
      </div>

      {/* ==========================================================
          بدنه فوتر: سه ستون
          ========================================================== */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* =====  ستون اول: دسترسی سریع ===== */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight text-white">
              دسترسی سریع
            </h3>
            <ul className="space-y-2.5 text-sm">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-primary-foreground/80 transition-all duration-200 hover:text-secondary hover:translate-x-0.5"
                  >
                    <span className="text-secondary/50">—</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =====  ستون دوم: آخرین مقالات ===== */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight text-white">
              آخرین مقالات
            </h3>
            {settings.latestArticles && settings.latestArticles.length > 0 ? (
              <ul className="space-y-2.5">
                {settings.latestArticles.map(
                  (article: { title: string; href: string }) => (
                    <li key={article.href}>
                      <Link
                        href={article.href}
                        className="group block text-sm text-primary-foreground/80 transition-all duration-200 hover:text-secondary"
                      >
                        <span className="inline-flex items-center gap-1">
                          {article.title}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="text-sm text-primary-foreground/60">
                مقاله‌ای برای نمایش وجود ندارد.
              </p>
            )}
          </div>

          {/* =====  ستون سوم: اطلاعات تماس ===== */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight text-white">
              اطلاعات تماس
            </h3>
            <div className="space-y-3.5 text-sm text-primary-foreground/80">
              {/* آدرس */}
              {settings.address && (
                <div className="flex items-start gap-3 leading-relaxed">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{settings.address}</span>
                </div>
              )}

              {/* شماره تلفن */}
              {settings.phone && (
                <div className="flex items-center gap-3" dir="rtl">
                  <Phone className="h-4 w-4 shrink-0 text-secondary" />
                  <span>{settings.phone}</span>
                </div>
              )}

              {/* ایمیل */}
              {settings.email && (
                <div className="flex items-center gap-3" dir="rtl">
                  <Mail className="h-4 w-4 shrink-0 text-secondary" />
                  <span>{settings.email}</span>
                </div>
              )}

              {/* اینستاگرام */}
              {settings.instagram && (
                 <div className="flex items-center gap-3" dir="rtl">

                   <Camera className="h-4 w-4 shrink-0 text-secondary  " />
                <Link
                  href={`https://instagram.com/${settings.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary-foreground/80 transition-all duration-200 hover:text-secondary"
                  dir="ltr"
                  aria-label={`اینستاگرام ${clinicName}`}
                >
                  <span>{settings.instagram}</span>
                </Link>
                </div>
              )}

              {/* ساعات کاری (اختیاری) */}
              {settings.workingHours && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{settings.workingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          پایین فوتر: کپی‌رایت + لینک‌های قانونی
          ========================================================== */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-primary-foreground/60 md:flex-row md:text-start">
          {/* کپی‌رایت */}
          <p>
            © {new Date().getFullYear()} {clinicName}. تمامی حقوق محفوظ است.
          </p>

          {/* لینک‌های قانونی */}
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition hover:text-secondary hover:underline underline-offset-2"
            >
              حریم خصوصی
            </Link>
            <span className="text-primary-foreground/20">|</span>
            <Link
              href="/terms"
              className="transition hover:text-secondary hover:underline underline-offset-2"
            >
              قوانین و مقررات
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
