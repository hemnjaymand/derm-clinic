import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

type ServicesBanner = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type ServicesBannerProps = {
  banner: ServicesBanner;
};

export function ServicesPageBanner({ banner }: ServicesBannerProps) {
  if (!banner || !banner.enabled) return null;

  const hasContent =
    banner.title || banner.subtitle || banner.imageUrl || banner.ctaLabel;

  if (!hasContent) return null;

  return (
    <section
      dir="rtl"
      className="relative mb-10 w-screen overflow-hidden border-y border-border bg-muted"
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      {/* تصویر پس‌زمینه تمام عرض */}
      {banner.imageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.imageUrl}
            alt={banner.title || "بنر خدمات"}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* لایه تیره برای خوانایی متن */}
          <div className="absolute inset-0 bg-gradient-to- from-black/70 via-black/40 to-black/20" />
        </>
      )}

      {/* محتوای متنی روی تصویر */}
      <div className="container relative mx-auto px-4">
        <div className="flex min-h-80 flex-col items-start justify-center gap-4 py-12 md:min-h-[420px] md:py-20">
          <div className="max-w-2xl space-y-4 text-right text-white">
            {banner.title && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>پیشنهاد ویژه</span>
              </div>
            )}

            {banner.title && (
              <h2 className="text-3xl font-bold leading-tight drop-shadow-lg md:text-5xl">
                {banner.title}
              </h2>
            )}

            {banner.subtitle && (
              <p className="max-w-2xl text-base leading-relaxed text-white/90 drop-shadow md:text-lg">
                {banner.subtitle}
              </p>
            )}

            {banner.ctaLabel && banner.ctaHref && (
              <div className="pt-3">
                <Link
                  href={banner.ctaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]"
                >
                  {banner.ctaLabel}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
