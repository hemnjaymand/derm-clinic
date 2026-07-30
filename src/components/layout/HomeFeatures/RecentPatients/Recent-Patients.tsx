// src/components/layout/RecentPatients.tsx
import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { RecentPatientsClient } from "./RecentPatientsClient";
import { SectionWrapper } from "../../SectionWrapper";

export async function RecentPatients() {
  const settings = await getSiteSettings();

  // دریافت داده‌ها از دیتابیس
  const patients = settings.recentShowcaseCases || [];
  const serviceTags = settings.serviceTags || [];

  // اگر هیچ نمونه‌ای وجود نداشت، چیزی نمایش نده
  // if (patients.length === 0) {
  //   return null;
  // }

  // دریافت پس‌زمینه (اختیاری)
  const backgroundImage =
    settings.recentPatientsBackgroundImage || "/images/recent-patients-bg.jpg";

  return (
    <SectionWrapper
      background={{
        type: "image",
        value: backgroundImage,
        overlay: true,
        overlayOpacity: 30,
          parallax: false
      }}
      className="py-16 md:py-20"
    >
      <RecentPatientsClient
        patients={patients}
        serviceTags={serviceTags}
      />
    </SectionWrapper>
  );
}