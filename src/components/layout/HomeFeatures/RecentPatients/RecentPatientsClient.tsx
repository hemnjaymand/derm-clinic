"use client";

import { useState, TouchEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

// ============================================================
//  نوع‌ها
// ============================================================
type Patient = {
  id: string;
  name: string;
  service: string;
  beforeImage: string;
  afterImage: string;
};

type ServiceTag = {
  id: string;
  label: string;
  href?: string;
};

// ============================================================
//  کامپوننت کلاینت
// ============================================================
export function RecentPatientsClient({
  patients,
  serviceTags = [],
}: {
  patients: Patient[];
  serviceTags?: ServiceTag[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"before" | "after">("after");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // استیت‌های مربوط به تشخیص لمس (Swipe)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // 🟢 فیلتر کردن مراجعین بر اساس تب انتخاب شده
  const filteredPatients =
    activeFilter === "all"
      ? patients
      : patients.filter((p) => p.service === activeFilter);

  // اگر لیستی برای نمایش وجود نداشت (مخصوصا وقتی فیلتر خالی است)
  const currentPatient = filteredPatients[currentIndex] || filteredPatients[0];

  // ==========================================================
  //  توابع تغییر و کلیک
  // ==========================================================
  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredPatients.length - 1 : prev - 1,
    );
    setViewMode("after");
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === filteredPatients.length - 1 ? 0 : prev + 1,
    );
    setViewMode("after");
  };

  const toggleView = (mode: "before" | "after") => {
    setViewMode(mode);
  };

  const handleFilterChange = (tagLabel: string) => {
    setActiveFilter(tagLabel);
    setCurrentIndex(0); // رفتن به اولین عکس دسته‌بندی جدید
    setViewMode("after");
  };

  // ==========================================================
  //  توابع مدیریت لمس (Swipe)
  // ==========================================================
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > minSwipeDistance;

    if (isSwipe) {
      // با هر سوایپ معناداری به چپ یا راست، عکس قبل و بعد تاگل می‌شود
      setViewMode((prev) => (prev === "after" ? "before" : "after"));
    }
  };

  // ==========================================================
  //  رندر
  // ==========================================================
  if (!patients || patients.length === 0) return null;

  return (
    <div className="container mx-auto px-4">
      {/* عنوان */}
      <div className="mb-8 text-center md:mb-10">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          آخرین مراجعین کلینیک چه خدماتی دریافت کردند؟!
        </h2>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
      </div>

      {/* 🟢 برچسب‌های خدمات (تب‌ها) */}
      {serviceTags.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2 md:gap-3">
          <button
            onClick={() => handleFilterChange("all")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            همه موارد
          </button>

          {serviceTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleFilterChange(tag.label)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeFilter === tag.label
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {/* نمایشگر اصلی */}
      {filteredPatients.length > 0 ? (
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl">
            {/* 🟢 کانتینر عکس با قابلیت تشخیص لمس */}
            <div
              className="relative aspect-4/3 w-full cursor-ew-resize touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={
                  viewMode === "after"
                    ? currentPatient.afterImage
                    : currentPatient.beforeImage
                }
                alt={`${currentPatient.service} - ${
                  viewMode === "after" ? "بعد" : "قبل"
                }`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw"
                className="object-cover transition-opacity duration-500 ease-in-out"
                priority
                draggable={false}
              />

              {/* برچسب نام و خدمت */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                      <Users className="h-4 w-4 text-white md:h-5 md:w-5" />
                    </div>
                    <span className="text-sm font-bold text-white drop-shadow-md md:text-base">
                      {currentPatient.name}
                    </span>
                  </div>
                  <span className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-lg md:text-sm">
                    {currentPatient.service}
                  </span>
                </div>
              </div>

              {/* راهنمای کشیدن برای موبایل */}
              <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur-sm md:hidden">
                برای تغییر عکس بکشید
              </div>
            </div>

            {/* کنترل‌ها */}
            <div className="flex items-center justify-between gap-4 bg-muted/40 p-4 md:p-5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleView("after")}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                    viewMode === "after"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  بعد 
                </button>
                <button
                  onClick={() => toggleView("before")}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                    viewMode === "before"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  قبل 
                </button>
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={goToPrev}
                  className="rounded-full bg-background p-2.5 text-muted-foreground shadow-sm transition hover:bg-primary hover:text-white"
                  aria-label="نمونه قبلی"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="min-w-[3rem] text-center text-sm font-medium text-muted-foreground">
                  {currentIndex + 1} / {filteredPatients.length}
                </span>
                <button
                  onClick={goToNext}
                  className="rounded-full bg-background p-2.5 text-muted-foreground shadow-sm transition hover:bg-primary hover:text-white"
                  aria-label="نمونه بعدی"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          نمونه‌ای برای این خدمت یافت نشد.
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-transparent px-8 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
        >
          مشاهده همه نمونه‌ها
        </Link>
      </div>
    </div>
  );
}
