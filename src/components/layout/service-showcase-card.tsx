import Link from "next/link";
import Image from "next/image";
// import { Sparkles } from "lucide-react";
// import iconp from "../../../public/svg/imgi_4_face-lift.svg"
import { ServiceShowcaseCardProps } from "@/features/services/types/service.dto";

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
      {/* خط تزئینی بالای کارت */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 bg-gradient-to-l from-primary to-secondary transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      {/* آیکون SVG (از استورج) */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <div className="relative h-9 w-9 [&_svg]:h-full [&_svg]:w-full">
          {icon && (
            <Image
              src={icon}
              alt={title}
              width={36}
              height={36}
              className="h-full w-full object-contain"
              unoptimized
            />
          )}
        </div>
      </div>

      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}

      {/* عنوان با خطوط جداکننده */}
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
