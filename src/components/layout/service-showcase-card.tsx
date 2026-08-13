import Link from "next/link";
import Image from "next/image";
import { ServiceShowcaseCardProps } from "@/features/services/types/service.dto";
  


const scrollToConsult = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault(); // جلوگیری از پرش ناگهانی صفحه
  
  const targetElement = document.getElementById("consult-section"); 
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: "smooth", 
      block: "start",     
    });
  }
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
    <div className="group relative flex flex-col justify-between items-center overflow-hidden rounded-2xl bg-card p-4 text-center shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 sm:p-6 md:p-8">
      {/* خط تزئینی بالای کارت */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 bg-gradient-to-l from-primary to-secondary transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      <div className="flex w-full flex-col items-center">
        {/* آیکون SVG */}
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:mb-6 sm:h-16 sm:w-16 md:h-20 md:w-20">
          <div className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 [&_svg]:h-full [&_svg]:w-full">
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
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
            {eyebrow}
          </p>
        )}

        {/* عنوان با خطوط جداکننده */}
        <div className="my-2 flex items-center gap-1.5 sm:my-3 sm:gap-3">
          <span className="h-px w-3 bg-border transition-all duration-300 group-hover:w-5 group-hover:bg-primary sm:w-6 sm:group-hover:w-10" />
          <h3 className="line-clamp-1 text-xs font-bold text-foreground sm:text-base">
            {title}
          </h3>
          <span className="h-px w-3 bg-border transition-all duration-300 group-hover:w-5 group-hover:bg-primary sm:w-6 sm:group-hover:w-10" />
        </div>

        {/* متن توضیحات با محدودیت خطوط برای جلوگیری از ارتفاع زیاد */}
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:mb-6 sm:line-clamp-3 sm:text-sm">
          {description}
        </p>
      </div>

      {/* دکمه‌های عملیاتی */}
      <div className="flex w-full flex-col justify-center gap-1.5 sm:flex-row sm:gap-2">
        <Link
          href="/services"
          className="w-full rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1.5 text-center text-[11px] font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground sm:w-auto sm:px-4 sm:py-2 sm:text-xs"
        >
          اطلاعات بیشتر
        </Link>
        <Link
          href="#consult-section"
          className="w-full rounded-full bg-primary px-2.5 py-1.5 text-center text-[11px] font-medium text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.03] sm:w-auto sm:px-4 sm:py-2 sm:text-xs"
        >
          درخواست مشاوره
        </Link>
      </div>
    </div>
  );
}
