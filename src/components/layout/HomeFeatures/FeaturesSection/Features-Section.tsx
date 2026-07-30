// src/components/layout/FeaturesSection/FeaturesSection.tsx
import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { FeaturesSectionClient } from "./FeaturesSectionClient";
import { SectionWrapper } from "../../SectionWrapper";


export async function FeaturesSection() {
  const settings = await getSiteSettings();

  // دریافت ویژگی‌ها از دیتابیس
  const features = settings.features || [];

  // اگر ویژگی‌ای وجود نداشت، چیزی نمایش نده
  // if (features.length === 0) {
  //   return null;
  // }

  // دریافت پس‌زمینه از دیتابیس یا مقدار پیش‌فرض
  const backgroundImage =
    settings.featuresBackgroundImage || "/images/features-bg.jpg";

  return (
    <SectionWrapper
      background={{
        type: "image",
        value: backgroundImage,
        overlay: true,
        overlayOpacity: 30,
      }}
      className="py-16 md:py-20"
    >
      <FeaturesSectionClient features={features} />
    </SectionWrapper>
  );
}