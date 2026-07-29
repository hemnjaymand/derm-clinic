"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BannerData {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface PageBannerProps {
  banner: BannerData | null;
  fallbackTitle: string;
}

export default function PageBanner({ banner, fallbackTitle }: PageBannerProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const safeImageUrl = banner?.imageUrl ? banner.imageUrl.trim() : "";
  if (!banner?.imageUrl || imgError) {
    return (
      <div className="relative h-64 md:h-80 lg:h-96 bg-liner-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <h1 className="relative text-white text-3xl md:text-5xl font-bold z-10">
          {banner?.title || fallbackTitle || "درباره ما"}
        </h1>
      </div>
    );
  }

  return (
    <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
      <div className="absolute inset-0 bg-liner-to-r from-emerald-500 to-teal-600" />

      <Image
        src={safeImageUrl}
        alt={banner.title || fallbackTitle || "بنر صفحه"}
        fill
        sizes="100vw"
        priority
        unoptimized // 👈 این خط را اضافه کنید
        className={`object-cover transition-opacity duration-700 ${
          imgLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImgLoaded(true)}
        onError={() => {
          console.error("Failed to load banner image:", safeImageUrl);
          setImgError(true);
        }}
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-center animate-fade-in">
          {banner.title || fallbackTitle}
        </h1>

        {banner.subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl mb-6 text-center max-w-2xl animate-fade-in-delay">
            {banner.subtitle}
          </p>
        )}

        {banner.ctaLabel && banner.ctaHref && (
          <Link
            href={banner.ctaHref}
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors animate-fade-in-delay-2"
          >
            {banner.ctaLabel}
          </Link>
        )}
      </div>

      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
