// src/components/layout/BrandsMarquee/BrandsMarquee.tsx
import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { SectionWrapper } from "../../SectionWrapper";
import { BrandsMarqueeClient } from "./BrandsMarqueeClient";


export async function BrandsMarquee() {
  const settings = await getSiteSettings();

  // دریافت برندها از دیتابیس
  const brands = settings.brands || [];

  console.log("📊 تعداد برندها:", brands.length);
  console.log("📊 برندها:", brands);

  // اگر برندی وجود نداشت، چیزی نمایش نده
  // if (!brands || brands.length === 0) {
  //   return null;
  // }

  // پس‌زمینه (اختیاری - در صورت نیاز)
  const backgroundImage = settings.brandsBackgroundImage || "";

  return (
    <SectionWrapper
      background={
        backgroundImage
          ? {
              type: "image",
              value: backgroundImage,
              overlay: true,
              overlayOpacity: 20,
            }
          : { type: "none" }
      }
      className="py-6 md:py-10"
    >
      <BrandsMarqueeClient brands={brands} />
    </SectionWrapper>
  );
}