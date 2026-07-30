import { getActiveServices } from "@/features/services/actions/services.actions";
import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { Sparkles } from "lucide-react";
import { ServiceShowcaseCard } from "../../service-showcase-card";

export async function ServicesShowcase() {
  const [services, settings] = await Promise.all([
    getActiveServices(),
    getSiteSettings(),
  ]);

  if (services.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          {settings.clinicName}
        </h2>
        <p className="mt-2 text-muted-foreground">
          درمانگاه تخصصی پوست، مو و زیبایی
        </p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 6).map((service) => (
          <ServiceShowcaseCard
            key={service.id}
            // TODO: هر خدمت باید آیکون اختصاصی خودش را بگیرد — فعلاً یک آیکون پیش‌فرض
            icon={<Sparkles />}
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
