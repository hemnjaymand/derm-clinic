import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { ServiceDetailSectionClient } from "./ServiceDetailSectionClient";
import Image from "next/image";

export async function ServiceDetailSection() {
  const settings = await getSiteSettings();
  const service = settings.serviceDetail;

  if (!service) {
    return null;
  }

  const backgroundImage = service.backgroundImage || "";

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-20 bg-background">
      {/* 🟢 تصویر پس‌زمینه: پوشش ۵۰٪ سمت راست در حالت دسکتاپ */}
      {backgroundImage && (
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-0">
          <Image
            src={backgroundImage}
            alt={service.title || "پس‌زمینه خدمت"}
            fill
            className="object-cover rounded-2xl"
            priority
          />
          {/* لایه اورلی جهت شفافیت و خوانایی بهتر */}
          <div className="absolute inset-0" />
        </div>
      )}

      {/* 🟢 تقسیم‌بندی ۵۰/۵۰ صفحه در RTL */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* ستون راست (خالی برای نمایش تصویر پس‌زمینه) */}
          <div className="hidden lg:block min-h-87.5" />

          {/* ستون چپ (محتوای کامل) */}
          <div className="w-full">
            <ServiceDetailSectionClient service={service} />
          </div>
        </div>
      </div>
    </section>
  );
}