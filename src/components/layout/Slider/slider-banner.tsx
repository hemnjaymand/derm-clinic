// ⚠️ این فایل دیگر 'use client' ندارد - Server Component است

import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import SliderClient from "./SliderClient";

// نوع داده برای اسلایدها
export type Slide = {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

// ---------- کامپوننت اصلی HeroSlider (Server Component) ----------
export async function HeroSlider() {
  const settings = await getSiteSettings();

  const clinicName = settings.clinicName || "کلینیک";
  const aboutText = settings.aboutText || "";
  const heroImage = settings.heroImageUrl || "";

  // دریافت bannerImages از تنظیمات دشبورد (فقط از دشبورد - بدون fallback)
  const bannerImages: string[] = Array.isArray(settings.bannerImages)
    ? settings.bannerImages.filter((url) => !!url && url.trim() !== "")
    : [];
 
  // ساخت اسلایدها
  let slides: Slide[] = [];

  if (bannerImages.length > 0) {
    slides = bannerImages.map((imageUrl, index) => ({
      id: `slide-${index}`,
      imageUrl: imageUrl.trim(),
      title: ` ${clinicName}  `,
      subtitle: aboutText,
      ctaText: "دریافت مشاوره",
      ctaLink: "/consultation",
    }));
  } else if (heroImage) {
    slides = [
      {
        id: "slide-0",
        imageUrl: heroImage.trim(),
        title: ` ${clinicName} `,
        subtitle: aboutText,
        ctaText: "دریافت مشاوره",
        ctaLink: "/consultation",
      },
    ];
  }

  // اگر هیچ تصویری نبود
  if (slides.length === 0) {
    return (
      <section className="flex h-75 w-full items-center justify-center bg-muted md:h-125">
        <p className="px-4 text-center text-muted-foreground">
          هیچ بنری تنظیم نشده است. از پنل مدیریت تصاویر را اضافه کنید.
        </p>
      </section>
    );
  }

  // داده‌ها را به کامپوننت کلاینت پاس می‌دهیم
  return (
    <section className="relative w-full overflow-hidden bg-muted">
      <SliderClient slides={slides}/>
    </section>
  );
}
