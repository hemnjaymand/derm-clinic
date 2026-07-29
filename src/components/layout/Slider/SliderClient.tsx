// src/components/layout/SliderClient.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================================
//  نوع‌ها
// ============================================================
type Slide = {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

// ============================================================
//  کامپوننت اصلی
// ============================================================
export default function SliderClient({ slides }: { slides: Slide[] }) {
  console.log("About banner URL:", slides[0]?.imageUrl);
  // ==========================================================
  //  تنظیمات Embla
  // ==========================================================
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30,
    skipSnaps: false,
    direction: "rtl",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // ==========================================================
  //  توابع کنترل
  // ==========================================================
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  // ==========================================================
  //  افکت‌ها
  // ==========================================================
  useEffect(() => {
    if (!emblaApi) return;

    // --- مقداردهی اولیه ---
    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // --- به‌روزرسانی هنگام تغییر اسلاید ---
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // --- ثبت رویدادها ---
    emblaApi.on("init", onInit);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    // --- Autoplay (با توقف در هاور) ---
    let autoplay: NodeJS.Timeout | null = null;

    const startAutoplay = () => {
      if (autoplay) clearInterval(autoplay);
      autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);
    };

    const stopAutoplay = () => {
      if (autoplay) {
        clearInterval(autoplay);
        autoplay = null;
      }
    };

    startAutoplay();

    // توقف خودکار هنگام هاور روی اسلایدر
    const sliderElement = emblaApi.containerNode()?.parentElement;
    if (sliderElement) {
      sliderElement.addEventListener("mouseenter", stopAutoplay);
      sliderElement.addEventListener("mouseleave", startAutoplay);
    }

    // --- پاک‌سازی ---
    return () => {
      if (autoplay) clearInterval(autoplay);
      emblaApi.off("init", onInit);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
      if (sliderElement) {
        sliderElement.removeEventListener("mouseenter", stopAutoplay);
        sliderElement.removeEventListener("mouseleave", startAutoplay);
      }
    };
  }, [emblaApi]);

  // اگر اسلایدی وجود نداشته باشد
  if (slides.length === 0) {
    return (
      <div className="flex h-75 items-center justify-center bg-muted md:h-125">
        <p className="text-muted-foreground">هیچ اسلایدی وجود ندارد</p>
      </div>
    );
  }

  // ==========================================================
  //  رندر
  // ==========================================================
  return (
    <div className="relative">
      {/* ==========  محفظه اسلایدر  ========== */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide,index) => (
            <div
              key={slide.id}
              className="relative h-75 min-w-0 flex-[0_0_100%] md:h-125"
            >
              {/* تصویر پس‌زمینه */}
              <div className="absolute inset-0">
               <div className="absolute inset-0">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || "بنر کلینیک"}
                  fill
                  sizes="100vw"
                  priority={index === 0} 
                  unoptimized 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
                {/* اوورلی تیره */}
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* محتوای متنی */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
                {slide.title && (
                  <h1 className="mb-3 text-3xl font-bold drop-shadow-lg md:text-5xl">
                    {slide.title}
                  </h1>
                )}
                {slide.subtitle && (
                  <p className="mb-6 max-w-2xl text-base drop-shadow-lg md:text-xl">
                    {slide.subtitle}
                  </p>
                )}
                {slide.ctaText && slide.ctaLink && (
                  <Link
                    href={slide.ctaLink}
                    className="rounded-full bg-secondary px-8 py-3 text-sm font-semibold text-secondary-foreground shadow-lg transition-all hover:bg-accent hover:scale-105 active:scale-95"
                  >
                    {slide.ctaText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==========  دکمه‌های ناوبری  ========== */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition hover:bg-white/50 hover:scale-110 disabled:opacity-50 md:left-6 md:p-3"
            aria-label="اسلاید قبلی"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition hover:bg-white/50 hover:scale-110 disabled:opacity-50 md:right-6 md:p-3"
            aria-label="اسلاید بعدی"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* ==========  اندیکاتورها (نقاط پایین)  ========== */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 md:bottom-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 ${
                index === selectedIndex
                  ? "h-2.5 w-8 rounded-full bg-white shadow-lg"
                  : "h-2 w-2 rounded-full bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`رفتن به اسلاید ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
