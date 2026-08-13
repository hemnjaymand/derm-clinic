import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { FeaturesSectionClient } from "./FeaturesSectionClient";
import { SectionWrapper } from "../../SectionWrapper";

export async function FeaturesSection() {
  const settings = await getSiteSettings();

  // دریافت ویژگی‌ها از دیتابیس
  const features = settings.features || [];

  // 🟢 ۱. اگر ویژگی‌ای وجود نداشت، کلاً رندر را متوقف کن (جلوی رندر بک‌گراند خالی را می‌گیرد)
  if (!features || features.length === 0) {
    return null;
  }

  // ۲. بررسی وجود عکس بک‌گراند
  const bgImage = settings.featuresBackgroundImage?.trim();

  return (
    <SectionWrapper
      background={
        bgImage
          ? {
              type: "image",
              value: bgImage,
              overlay: true,
              overlayOpacity: 40,
            }
          : {
              type: "color",
              value: "bg-muted/40",
            }
      }
      className="py-16 md:py-24"
    >
      <FeaturesSectionClient features={features} />
    </SectionWrapper>
  );
}
