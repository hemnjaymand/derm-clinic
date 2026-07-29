"use client";

import { useState } from "react";
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
//  کامپوننت کلاینت (فقط با props)
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

  // اگر بیمار وجود نداشته باشد، چیزی نمایش نده
  if (!patients || patients.length === 0) {
    return null;
  }

  const currentPatient = patients[currentIndex] || patients[0];

  // ==========================================================
  //  توابع تغییر
  // ==========================================================
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? patients.length - 1 : prev - 1));
    setViewMode("after");
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === patients.length - 1 ? 0 : prev + 1));
    setViewMode("after");
  };

  const toggleView = (mode: "before" | "after") => {
    setViewMode(mode);
  };

  // ==========================================================
  //  رندر
  // ==========================================================
  return (
    <div>
      {/* عنوان */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          آخرین مراجعین در کلینیک چه خدماتی دریافت کردند؟!
        </h2>
        <p className="mt-2 text-muted-foreground">قبل و بعد</p>
      </div>

      {/* برچسب‌های خدمات (اگر وجود داشته باشند) */}
      {serviceTags.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {serviceTags.map((tag) => (
            <button
              key={tag.id}
              className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {/* نمایشگر اصلی */}
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="relative aspect-4/3 w-full">
            <Image
              src={
                viewMode === "after"
                  ? currentPatient.afterImage
                  : currentPatient.beforeImage
              }
              alt={`${currentPatient.service} - ${viewMode === "after" ? "بعد" : "قبل"}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw" // ✅ اضافه کنید
              className="object-cover transition-all duration-500"
              priority
            />

            {/* برچسب نام و خدمت */}
            <div className="absolute bottom-0 left-0 right-0 bg-liner-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white">
                    {currentPatient.name}
                  </span>
                </div>
                <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white">
                  {currentPatient.service}
                </span>
              </div>
            </div>
          </div>

          {/* کنترل‌ها */}
          <div className="flex items-center justify-between gap-4 bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleView("after")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  viewMode === "after"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                After
              </button>
              <button
                onClick={() => toggleView("before")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  viewMode === "before"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Before
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPrev}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="نمونه قبلی"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {patients.length}
              </span>
              <button
                onClick={goToNext}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="نمونه بعدی"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            مشاهده همه نمونه‌ها
          </Link>
        </div>
      </div>
    </div>
  );
}
