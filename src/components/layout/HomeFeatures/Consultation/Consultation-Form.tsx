
// ✅ این فایل Server Component است و "use client" ندارد
import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { ConsultationFormClient } from "./ConsultationFormClient";

// ============================================================
//  نوع داده برای تنظیمات فرم
// ============================================================
type ConsultationSettings = {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
  clinicName: string;
};

// ============================================================
//  کامپوننت سمت سرور (دریافت تنظیمات)
// ============================================================
export async function ConsultationForm() {
  const settings = await getSiteSettings();

  const consultationSettings: ConsultationSettings = {
    title: settings.consultationTitle || "درخواست مشاوره رایگان",
    subtitle: settings.consultationSubtitle || "تنها سه قدم تا رزرو وقت",
    buttonText: settings.consultationButtonText || "ثبت درخواست",
    backgroundImage: settings.consultationBackgroundImage || "",
    clinicName: settings.clinicName || "کلینیک",
  };

  return <ConsultationFormClient settings={consultationSettings} />;
}
