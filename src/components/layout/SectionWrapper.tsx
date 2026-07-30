
import type { ReactNode, CSSProperties } from "react";

export type SectionBackground = {
  type: "color" | "gradient" | "image" | "none";
  value?: string;
  gradientFrom?: string;
  gradientTo?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  parallax?: boolean;
  backgroundSize?: "cover" | "contain" | "auto" | string;
  backgroundPosition?: string;
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
};

type SectionWrapperProps = {
  children: ReactNode;
  background?: SectionBackground;
  className?: string;
  id?: string;
};

function getBackgroundStyle(background: SectionBackground): CSSProperties {
  switch (background.type) {
    case "color":
      return { backgroundColor: background.value || "transparent" };

    case "gradient":
      return {
        background: `linear-gradient(135deg, ${background.gradientFrom || "transparent"}, ${background.gradientTo || "transparent"})`,
      };

    case "image": {
      const style: CSSProperties = {
        backgroundImage: `url(${background.value})`,
        backgroundSize: background.backgroundSize || "cover",
        backgroundPosition: background.backgroundPosition || "center",
        backgroundRepeat: background.backgroundRepeat || "no-repeat",
      };
      if (background.parallax) {
        style.backgroundAttachment = "fixed";
      }
      return style;
    }

    default:
      return {};
  }
}

/**
 * Server Component — بدون State/Interactivity، فقط محاسبه‌ی Style.
 * تکنیک Full-Bleed (w-screen + translate) به‌جای اینکه هر Section
 * جدا خودش را بشکند، در سطح سراسری globals.css با overflow-x: hidden
 * روی body پشتیبانی می‌شود تا خطر اسکرول افقی ناخواسته از بین برود.
 */
export function SectionWrapper({
  children,
  background = { type: "none" },
  className = "",
  id,
}: SectionWrapperProps) {
  const hasImage = background.type === "image" && background.value;

  return (
    <section
      id={id}
      className={`relative inset-s-1/2 w-screen -translate-x-1/2  rtl:translate-x-1/2 overflow-hidden ${className}`}
      style={getBackgroundStyle(background)}
    >
      {hasImage && background.overlay !== false && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${(background.overlayOpacity ?? 30) / 100})`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
