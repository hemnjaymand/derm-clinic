import Link from "next/link";
import type { Service } from "@prisma/client";

export function ServiceDetail({ service }: { service: Service }) {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12" dir="rtl">
      <h1 className="mb-4 text-2xl font-bold">{service.title}</h1>

      <div className="mb-6 flex gap-4 text-sm text-muted-foreground">
        <span>مدت زمان: {service.durationMin} دقیقه</span>
        {service.price && (
          <span>قیمت: {service.price.toLocaleString("fa-IR")} تومان</span>
        )}
      </div>

      {service.description && (
        <p className="leading-7">{service.description}</p>
      )}

      <Link
        href={`/appointment?serviceId=${service.id}`}
        className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground"
      >
        رزرو نوبت برای این خدمت
      </Link>
    </div>
  );
}
