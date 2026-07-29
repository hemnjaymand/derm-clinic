import { getActiveServices } from "@/features/services/actions/services.actions";
import Link from "next/link";
import {
  Syringe,
  Scissors,
  Sparkles,
  Zap,
  Dumbbell,
  Eye,
  Activity,
  Feather,
  Gem,
  Droplet,
} from "lucide-react";
import { getPageBanner, getSiteSettings } from "@/features/settings/actions/settings.actions";
import PageBanner from "@/components/shared/page-banner";

export const revalidate = 300;

// نقشه آیکون‌های SVG برای هر دسته خدمات
const getServiceIcon = (title: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    تزریق: <Syringe className="h-10 w-10" />,
    ژل: <Droplet className="h-10 w-10" />,
    فیلر: <Syringe className="h-10 w-10" />,
    جراحی: <Scissors className="h-10 w-10" />,
    پلک: <Eye className="h-10 w-10" />,
    لیفت: <Sparkles className="h-10 w-10" />,
    صورت: <Feather className="h-10 w-10" />,
    لیزر: <Zap className="h-10 w-10" />,
    مو: <Scissors className="h-10 w-10" />,
    لاغری: <Dumbbell className="h-10 w-10" />,
    کاشت: <Activity className="h-10 w-10" />,
    ابرو: <Eye className="h-10 w-10" />,
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon;
  }
  return <Gem className="h-10 w-10" />;
};

// رنگ‌های متنوع برای آیکون‌ها و تگ‌ها
const getServiceColors = (title: string) => {
  const colorMap: Record<string, { icon: string; tag: string; bg: string }> = {
    تزریق: {
      icon: "text-purple-600",
      tag: "bg-purple-100 text-purple-700",
      bg: "hover:shadow-purple-500/10",
    },
    جراحی: {
      icon: "text-blue-600",
      tag: "bg-blue-100 text-blue-700",
      bg: "hover:shadow-blue-500/10",
    },
    لیفت: {
      icon: "text-pink-500",
      tag: "bg-pink-100 text-pink-700",
      bg: "hover:shadow-pink-500/10",
    },
    لیزر: {
      icon: "text-red-500",
      tag: "bg-red-100 text-red-700",
      bg: "hover:shadow-red-500/10",
    },
    لاغری: {
      icon: "text-orange-500",
      tag: "bg-orange-100 text-orange-700",
      bg: "hover:shadow-orange-500/10",
    },
    کاشت: {
      icon: "text-emerald-500",
      tag: "bg-emerald-100 text-emerald-700",
      bg: "hover:shadow-emerald-500/10",
    },
  };

  for (const [key, colors] of Object.entries(colorMap)) {
    if (title.includes(key)) return colors;
  }
  return {
    icon: "text-primary",
    tag: "bg-primary/10 text-primary",
    bg: "hover:shadow-primary/10",
  };
};

export default async function PublicServicesPage() {
  const [services, settings] = await Promise.all([
    getActiveServices(),
    getSiteSettings(),
  ]);

  const banner = await getPageBanner("services");
  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      {/* هدر صفحه */}
    

      {/* بنر قابل تنظیم از دشبورد */}
  <div className="mb-12 text-center">
      <PageBanner fallbackTitle="" banner={banner} />
        <h1 className="text-3xl font-bold text-primary md:text-4xl py-3">
          خدمات ما
        </h1>
      </div>
      {services.length === 0 ? (
        <p className="text-center text-muted-foreground">
          در حال حاضر خدمتی ثبت نشده است.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {services.map((service) => {
            const icon = getServiceIcon(service.title);
            const colors = getServiceColors(service.title);

            // ساخت تگ انگلیسی از عنوان - برای عناوین فارسی یک تگ پیش‌فرض
            const englishTag = service.title
              ? service.title.split(" ").slice(0, 2).join(" ").toUpperCase()
              : null;

            return (
              <div
                key={service.id}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${colors.bg}`}
              >
                {/* آیکون SVG */}
                <div className={`mb-4 ${colors.icon}`}>{icon}</div>

                {/* تگ انگلیسی */}
                {englishTag && (
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wider ${colors.tag}`}
                  >
                    {englishTag}
                  </span>
                )}

                {/* عنوان فارسی */}
                <h2 className="mt-3 text-xl font-bold text-foreground">
                  {service.title}
                </h2>

                {/* توضیحات */}
                {service.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                )}

                {/* خط جداکننده و اطلاعات تکمیلی */}
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                  <span className="text-muted-foreground">
                    ⏱ {service.durationMin || "—"} دقیقه
                  </span>
                  {service.price ? (
                    <span className="font-semibold text-primary">
                      {service.price.toLocaleString("fa-IR")} تومان
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      اطلاع‌رسانی نشده
                    </span>
                  )}
                </div>

                {/* دکمه CTA */}
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-sm font-medium text-secondary-foreground transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-[0.98]"
                >
                  اطلاعات بیشتر
                  <span className="text-lg">→</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
