"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Brand } from "@/features/settings/schemas/site-settings.schema";

export function BrandsMarqueeClient({ brands }: { brands: Brand[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const doubledBrands = [...brands, ...brands];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      container.style.animationPlayState = "paused";
    };
    const handleMouseLeave = () => {
      container.style.animationPlayState = "running";
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        برندهای معتبر
      </h2>
      <div className="overflow-hidden">
        <div ref={scrollRef} className="animate-scroll flex w-max items-center gap-10 md:gap-16">
          {doubledBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex h-16 w-32 shrink-0 items-center justify-center md:h-20 md:w-40"
            >
              {brand.imageUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={brand.imageUrl}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    className="object-contain grayscale transition-all duration-300 hover:grayscale-0"
                  />
                </div>
              ) : (
                <span className="px-2 text-center text-sm font-medium text-muted-foreground">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}