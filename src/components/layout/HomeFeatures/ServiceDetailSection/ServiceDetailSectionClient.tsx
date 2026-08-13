"use client";

import Link from "next/link";
import {
  Clock,
  RefreshCw,
  Brain,
  Infinity,
  ArrowLeft,
  Calendar,
  User,
} from "lucide-react";
import { PUBLIC_ROUTES } from "@/constants/routes";

type ServiceDetail = {
  id: string;
  title: string;
  description: string;
  recoveryTime: string;
  needsRenewal: string;
  needsAnesthesia: string;
  longevity: string;
  ctaText: string;
  ctaLink: string;
  doctorName: string;
  doctorTitle: string;
  backgroundImage?: string;
};

export function ServiceDetailSectionClient({
  service,
}: {
  service: ServiceDetail;
}) {
  const specs = [
    { icon: Clock, label: "دوره نقاهت", value: service.recoveryTime },
    { icon: RefreshCw, label: "نیاز به تمدید", value: service.needsRenewal },
    { icon: Brain, label: "نیاز به بی‌هوشی", value: service.needsAnesthesia },
    { icon: Infinity, label: "ماندگاری", value: service.longevity },
  ];

  return (
    <div className="space-y-6">
      {/* عنوان اصلی بخش */}
      <div>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          با کلینیک ما بیشتر آشنا شوید
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          برترین خدمات کلینیک
        </p>
      </div>

      {/* توضیحات خدمت */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-primary">{service.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <Link
          href={service.ctaLink}
          className="inline-flex items-center gap-2 rounded-full bg-primary/30 px-5 py-2 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/40 hover:scale-[1.02]"
        >
           دریافت اطلاعات بیشتر   ...
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* مشخصات (گرید ۴تایی) */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card/30 p-3 text-center transition hover:shadow-md"
          >
            <spec.icon className="mx-auto mb-1.5 h-5 w-5 text-primary" />
            <p className="text-[11px] text-muted-foreground">{spec.label}</p>
            <p className="mt-0.5 text-xs font-semibold text-foreground">
              {spec.value}
            </p>
          </div>
        ))}
      </div>

      {/* کارت اطلاعات پزشک */}
      <div className="rounded-xl border border-border bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2.5">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {service.doctorName}
            </p>
            <p className="text-xs text-muted-foreground">
              {service.doctorTitle}
            </p>
            <Link
              href={`/doctors/${service.doctorName}`}
              className="mt-1.5 inline-block text-xs font-medium text-primary hover:underline"
            >
               طراحی چهرە با تزریق فول فیس ←
            </Link>
          </div>
        </div>
      </div>

      {/* دکمه رزرو نوبت */}
      <Link href={PUBLIC_ROUTES.appointment}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-bold text-secondary-foreground transition-all hover:bg-accent hover:scale-[1.02]"
      >
        <Calendar className="h-4 w-4" />
        {service.ctaText}
      </Link>
    </div>
  );
}