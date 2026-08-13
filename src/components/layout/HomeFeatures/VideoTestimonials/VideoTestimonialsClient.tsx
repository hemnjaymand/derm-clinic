"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { VideoTestimonial } from "@/features/settings/schemas/site-settings.schema";

export function VideoTestimonialsClient({
  videos,
}: {
  videos: VideoTestimonial[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      // در پروژه‌های راست‌چین (RTL) ممکن است رفتار scrollLeft در مرورگرها متفاوت باشد
      setCanScrollLeft(Math.abs(scrollLeft) > 10);
      setCanScrollRight(Math.abs(scrollLeft) < scrollWidth - clientWidth - 10);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  if (!videos || videos.length === 0) {
    return null;
  }

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -320, behavior: "smooth" });
      setTimeout(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(Math.abs(scrollLeft) > 10);
        setCanScrollRight(
          Math.abs(scrollLeft) < scrollWidth - clientWidth - 10,
        );
      }, 400);
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 320, behavior: "smooth" });
      setTimeout(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(Math.abs(scrollLeft) > 10);
        setCanScrollRight(
          Math.abs(scrollLeft) < scrollWidth - clientWidth - 10,
        );
      }, 400);
    }
  };

  return (
    <div className="w-full py-6">
      <div className="mb-8 text-center md:mb-12">
        <h2 className="text-2xl font-bold text-foreground md:text-4xl">
          چرا از خدمات کلینیک استفاده کنم؟!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          رضایت و نظرات مراجعین محترم
        </p>
      </div>

      <div className="relative">
        {/* دکمه اسکرول به راست */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute -right-3 top-[40%] z-20 -translate-y-1/2 rounded-full border border-border/50 bg-background/90 p-2.5 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-background md:-right-5 md:p-3"
            aria-label="اسکرول به راست"
          >
            <ChevronRight className="h-5 w-5 text-foreground md:h-6 md:w-6" />
          </button>
        )}

        {/* دکمه اسکرول به چپ */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute -left-3 top-[40%] z-20 -translate-y-1/2 rounded-full border border-border/50 bg-background/90 p-2.5 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-background md:-left-5 md:p-3"
            aria-label="اسکرول به چپ"
          >
            <ChevronLeft className="h-5 w-5 text-foreground md:h-6 md:w-6" />
          </button>
        )}

        {/* کانتینر اسکرول افقی */}
        <div
          ref={scrollContainerRef}
          onScroll={() => {
            const container = scrollContainerRef.current;
            if (!container) return;
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setCanScrollLeft(Math.abs(scrollLeft) > 10);
            setCanScrollRight(
              Math.abs(scrollLeft) < scrollWidth - clientWidth - 10,
            );
          }}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide px-1"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {videos.map((video) => {
            const duration = video.duration ?? "0:00";
            const thumbnail =
              video.thumbnailImage || "/images/placeholder-video.jpg";
            const rating = Math.min(5, Math.max(0, video.rating));

            // توجه: فرض بر این است که پراپرتی آدرس ویدیو در دیتابیس شما videoUrl نام دارد.
            // در صورت متفاوت بودن (مثلاً url یا src)، آن را در خط زیر تغییر دهید.
            const sourceUrl = (video as any).videoUrl;

            return (
              <div
                key={video.id}
                className="w-[280px] sm:w-[320px] shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {/* رندر شرطی: اگر ویدیو اکتیو بود پلیر را نشان بده، در غیر این صورت کاور را نشان بده */}
                    {activeVideo === video.id && sourceUrl ? (
                      <video
                        src={sourceUrl}
                        controls
                        autoPlay
                        className="h-full w-full object-cover"
                        onEnded={() => setActiveVideo(null)}
                      />
                    ) : (
                      <>
                        <Image
                          sizes="(max-width: 768px) 280px, 320px"
                          src={thumbnail}
                          alt={video.name}
                          fill
                          className="object-cover object-center transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

                        {/* فقط در صورتی دکمه پخش نمایش داده شود که آدرس ویدیو در دیتابیس موجود باشد */}
                        {sourceUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => setActiveVideo(video.id)}
                              className="rounded-full border border-white/20 bg-white/30 p-3 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white hover:text-primary md:p-4"
                              aria-label={`پخش ویدئو ${video.name}`}
                            >
                              <Play
                                className="h-6 w-6 translate-x-0.5 md:h-7 md:w-7"
                                fill="currentColor"
                              />
                            </button>
                          </div>
                        )}

                        <div className="absolute bottom-2.5 right-2.5 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                          {duration}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2 p-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star
                          key={`filled-${i}`}
                          className="h-3.5 w-3.5 fill-current"
                        />
                      ))}
                      {Array.from({ length: 5 - rating }).map((_, i) => (
                        <Star
                          key={`empty-${i}`}
                          className="h-3.5 w-3.5 text-muted/40"
                        />
                      ))}
                    </div>

                    <h3 className="line-clamp-1 text-sm font-bold text-foreground">
                      {video.name}
                    </h3>

                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {video.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
