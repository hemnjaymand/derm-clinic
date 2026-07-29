// src/components/layout/SectionWrapper.tsx
"use client";

import { ReactNode } from "react";

export type SectionBackground = {
  type: "color" | "gradient" | "image" | "none";
  value?: string; // رنگ یا آدرس تصویر
  gradientFrom?: string;
  gradientTo?: string;
  overlay?: boolean; // برای تصاویر
  overlayOpacity?: number; // 0 تا 100
  parallax?: boolean; // پارالاکس (اختیاری)
  backgroundSize?: "cover" | "contain" | "auto" | string; // ✅ جدید
  backgroundPosition?: string; // ✅ جدید (مثال: "center", "top left")
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y"; // ✅ جدید
};

type SectionWrapperProps = {
  children: ReactNode;
  background?: SectionBackground;
  className?: string;
  id?: string;
};

export function SectionWrapper({
  children,
  background = { type: "none" },
  className = "",
  id,
}: SectionWrapperProps) {
  // ============================================================
  //  تعیین استایل پس‌زمینه
  // ============================================================
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background.type) {
      case "color":
        return { backgroundColor: background.value || "transparent" };

      case "gradient":
        return {
          background: `linear-gradient(135deg, ${background.gradientFrom || "transparent"}, ${background.gradientTo || "transparent"})`,
        };

      case "image": {
        const style: React.CSSProperties = {
          backgroundImage: `url(${background.value})`,
          backgroundSize: background.backgroundSize || "cover",
          backgroundPosition: background.backgroundPosition || "center",
          backgroundRepeat: background.backgroundRepeat || "no-repeat",
        };

        // فقط در صورت درخواست صریح، پارالاکس اضافه شود
        if (background.parallax) {
          style.backgroundAttachment = "fixed";
        }

        return style;
      }

      default:
        return {};
    }
  };

  const hasImage = background.type === "image" && background.value;

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${className}`}
      style={getBackgroundStyle()}
    >
      {/* در صورت وجود تصویر، یک لایه overlay اضافه کن */}
      {hasImage && background.overlay !== false && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${(background.overlayOpacity || 30) / 100})`,
          }}
        />
      )}

      {/* محتوای اصلی */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}