import { getActiveServices } from "@/features/services/actions/services.actions";
import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { ServiceShowcaseCard } from "../../service-showcase-card";

export async function ServicesShowcase() {
  const [services, settings] = await Promise.all([
    getActiveServices(),
    getSiteSettings(),
  ]);

  if (services.length === 0) return null;

  return (
    /* اضافه شدن py-10 برای رفع چسبندگی از بالا و پایین در موبایل */
    <section className="container mx-auto px-3 py-10 md:px-4 md:py-20">
      <div className="mb-6 text-center md:mb-12">
        {/* <h2 className="text-xl font-bold text-foreground md:text-3xl">
          {settings.clinicName}
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground md:text-base">
          درمانگاه تخصصی پوست، مو و زیبایی
        </p> */}
        <div className="mx-auto mt-2.5 h-1 w-12 rounded-full bg-primary md:w-16" />
      </div>

      {/* تنظیم ۲ ستون در موبایل (grid-cols-2) و ۳ ستون در دسکتاپ (lg:grid-cols-3) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {services.slice(0, 6).map((service) => (
          <ServiceShowcaseCard
            key={service.id}
            icon={service.icon}
            title={service.title}
            description={service.description ?? ""}
            moreHref={`/services/${service.id}`}
            consultHref={`/appointment?serviceId=${service.id}`}
          />
        ))}
      </div>
    </section>
  );
}