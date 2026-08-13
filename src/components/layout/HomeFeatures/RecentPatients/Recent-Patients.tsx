import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { RecentPatientsClient } from "./RecentPatientsClient";
import { SectionWrapper } from "../../SectionWrapper";

export async function RecentPatients() {
  const settings = await getSiteSettings();

  // دریافت داده‌ها از دیتابیس
  const patients = settings.recentShowcaseCases || [];
  const serviceTags = settings.serviceTags || [];

  // 🟢 اگر هیچ نمونه‌ای وجود نداشت، کلاً چیزی رندر نشود
  if (!patients || patients.length === 0) {
    return null;
  }

  // دریافت پس‌زمینه (اختیاری)
  const bgImage = settings.recentPatientsBackgroundImage?.trim();

  return (
    <SectionWrapper
      background={
        bgImage
          ? {
              type: "image",
              value: bgImage,
              overlay: true,
              overlayOpacity: 30,
              parallax: false,
            }
          : {
              type: "color",
              value: "bg-muted/30",
            }
      }
      className="py-16 md:py-24"
    >
      <RecentPatientsClient patients={patients} serviceTags={serviceTags} />
    </SectionWrapper>
  );
}
