// src/components/layout/ServiceDetailSection.tsx
import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { SectionWrapper } from "../../SectionWrapper";
import { ServiceDetailSectionClient } from "./ServiceDetailSectionClient";

export async function ServiceDetailSection() {
  const settings = await getSiteSettings();

  // دریافت جزئیات خدمت از دیتابیس (بدون fallback)
  const service = settings.serviceDetail;

  // اگر هیچ داده‌ای وجود نداشت، چیزی نمایش نده
  if (!service) {
    return null;
  }

  // پس‌زمینه (اگر در settings.serviceDetail.backgroundImage ذخیره شده باشد)
  const backgroundImage = service.backgroundImage || "";

  return (
    <SectionWrapper
      background={
        backgroundImage
          ? {
              type: "image",
              value: backgroundImage,
              overlay: true,
              overlayOpacity: 40,
                parallax: false
            }
          : { type: "none" }
      }
      className="py-16 md:py-20"
    >
      <ServiceDetailSectionClient service={service} />
    </SectionWrapper>
  );
}
