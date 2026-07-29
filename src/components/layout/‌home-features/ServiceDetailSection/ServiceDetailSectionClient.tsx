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
import Image from "next/image";

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
    <div className="container mx-auto px-4">
      {/* عنوان */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          با کلینیک ما بیشتر آشنا شوید
        </h2>
        <p className="mt-2 text-muted-foreground">
          برترین خدمات کلینیک
        </p>
      </div>

      {/* ✅ تصویر قابل کنترل از تنظیمات (در صورت وجود) */}
      {service.backgroundImage && (
        <div className="mb-8 flex justify-center">
          <Image
            src={service.backgroundImage}
            alt={service.title}
            width={400}
            height={200}
            className="h-auto w-full max-w-md rounded-xl object-contain shadow-lg"
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* سمت چپ */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-primary">{service.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
          <Link
            href={service.ctaLink}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02]"
          >
            جهت دریافت اطلاعات بیشتر ... بخوانید ...
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* سمت راست */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {specs.map((spec, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-4 text-center transition hover:shadow-md"
              >
                <spec.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-xs text-muted-foreground">{spec.label}</p>
                <p className="mt-1 font-semibold text-foreground">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-primary/5 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {service.doctorName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {service.doctorTitle}
                </p>
                <Link
                  href={`/doctors/${service.doctorName}`}
                  className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                >
                  آموزش طراحی عمل پلک ←
                </Link>
              </div>
            </div>
          </div>

          <Link
            href={service.ctaLink}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-bold text-secondary-foreground transition-all hover:bg-accent hover:scale-[1.02]"
          >
            <Calendar className="h-5 w-5" />
            {service.ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}