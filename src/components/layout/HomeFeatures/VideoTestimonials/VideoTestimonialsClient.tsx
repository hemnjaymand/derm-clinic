"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, ChevronLeft, ChevronRight, Star } from "lucide-react";
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
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
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
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }, 400);
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 320, behavior: "smooth" });
      setTimeout(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }, 400);
    }
  };

  return (
    <div>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          چرا از خدمات کلینیک گونه استفاده کنم؟!
        </h2>
        <p className="mt-2 text-muted-foreground">از زبان مراجعین بخوانید</p>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110 md:-left-6 md:p-3"
            aria-label="اسکرول به چپ"
          >
            <ChevronRight className="h-5 w-5 text-foreground md:h-6 md:w-6" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110 md:-right-6 md:p-3"
            aria-label="اسکرول به راست"
          >
            <ChevronLeft className="h-5 w-5 text-foreground md:h-6 md:w-6" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={() => {
            const container = scrollContainerRef.current;
            if (!container) return;
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
          }}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
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

            return (
              <div
                key={video.id}
                className="min-w-70 max-w-[320px] flex-1 md:min-w-[320px]"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition hover:shadow-xl">
                  <div className="relative aspect-video w-full cursor-pointer overflow-hidden bg-black/5">
                    <Image
                      sizes="(max-width: 768px) 280px, 320px"
                      src={thumbnail}
                      alt={video.name}
                      fill
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40">
                      <button
                        onClick={() =>
                          setActiveVideo(
                            activeVideo === video.id ? null : video.id,
                          )
                        }
                        className="rounded-full bg-white/90 p-3 text-primary shadow-lg transition hover:scale-110 hover:bg-white md:p-4"
                        aria-label={`پخش ویدئو ${video.name}`}
                      >
                        {activeVideo === video.id ? (
                          <Pause className="h-6 w-6 md:h-8 md:w-8" />
                        ) : (
                          <Play
                            className="h-6 w-6 md:h-8 md:w-8"
                            fill="currentColor"
                          />
                        )}
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                      {duration}
                    </div>
                  </div>

                  <div className="space-y-2 p-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star
                          key={`filled-${i}`}
                          className="h-4 w-4 fill-current"
                        />
                      ))}
                      {Array.from({ length: 5 - rating }).map((_, i) => (
                        <Star
                          key={`empty-${i}`}
                          className="h-4 w-4 text-muted"
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
