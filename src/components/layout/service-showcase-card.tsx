import Link from "next/link";
import type { ReactNode } from "react";

export type ServiceShowcaseCardProps = {
  /** آیکون اختصاصی — یک SVG یا کامپوننت لوکس‌آیکون؛ اندازه‌اش با CSS داخلی کنترل می‌شود */
  icon: ReactNode;
  /** عنوان کوچک بالای کارت (مثلاً نام لاتین خدمت) — اختیاری */
  eyebrow?: string;
  title: string;
  description: string;
  moreHref: string;
  consultHref: string;
};

export function ServiceShowcaseCard({
  icon,
  eyebrow,
  title,
  description,
  moreHref,
  consultHref,
}: ServiceShowcaseCardProps) {
  return (
    <div className="group relative flex flex-col items-center overflow-hidden rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10">
      {/* خط تزئینی که از سمت راست باز می‌شود */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 bg-gradient-to-l from-primary to-secondary transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      {/* آیکون — این بخش را با SVG اختصاصی خودت جایگزین کن */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <div className="h-9 w-9 [&_svg]:h-full [&_svg]:w-full">{icon}</div>
      </div>

      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}

      {/* عنوان با خط جداکننده‌ای که روی هاور پهن‌تر می‌شود */}
      <div className="my-3 flex items-center gap-3">
        <span className="h-px w-6 bg-border transition-all duration-300 group-hover:w-10 group-hover:bg-primary" />
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <span className="h-px w-6 bg-border transition-all duration-300 group-hover:w-10 group-hover:bg-primary" />
      </div>

      <p className="mb-6 min-h-10 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href={moreHref}
          className="rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-xs font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
        >
          اطلاعات بیشتر
        </Link>
        <Link
          href={consultHref}
          className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.03]"
        >
          درخواست مشاوره
        </Link>
      </div>
    </div>
  );
}