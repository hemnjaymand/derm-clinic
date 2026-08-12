import { z } from "zod";

export const usefulLinkSchema = z.object({
  label: z.string().min(1, "عنوان لینک الزامی است"),
  href: z.string().min(1, "آدرس لینک الزامی است"),
});
export type UsefulLink = z.infer<typeof usefulLinkSchema>;

export const featureSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});
export type Feature = z.infer<typeof featureSchema>;

export const serviceDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  recoveryTime: z.string(),
  needsRenewal: z.string(),
  needsAnesthesia: z.string(),
  longevity: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
  doctorName: z.string(),
  doctorTitle: z.string(),
  backgroundImage: z.string().optional().or(z.literal("")),
});
export type ServiceDetail = z.infer<typeof serviceDetailSchema>;

export const serviceTagSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});
export type ServiceTag = z.infer<typeof serviceTagSchema>;

export const showcaseCaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  service: z.string(),
  beforeImage: z.string(),
  afterImage: z.string(),
});
export type ShowcaseCase = z.infer<typeof showcaseCaseSchema>;

export const pageBannerSchema = z.object({
  enabled: z.boolean().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});
export type PageBanner = z.infer<typeof pageBannerSchema>;

export const PAGE_BANNER_KEYS = [
  "about",
  "services",
  "gallery",
  "blog",
  "contact",
] as const;
export type PageBannerKey = (typeof PAGE_BANNER_KEYS)[number];

export const PAGE_BANNER_LABELS: Record<PageBannerKey, string> = {
  about: " ",
  services: "خدمات",
  gallery: "گالری",
  blog: "مقالات",
  contact: "تماس با ما",
};

export const pageBannersSchema = z.object({
  about: pageBannerSchema.optional(),
  services: pageBannerSchema.optional(),
  gallery: pageBannerSchema.optional(),
  blog: pageBannerSchema.optional(),
  contact: pageBannerSchema.optional(),
});
export type PageBanners = z.infer<typeof pageBannersSchema>;

// نکته: بدون .default() — چون .default() باعث تناقض Type بین ورودی/خروجی
// می‌شود و zodResolver در React Hook Form را می‌شکند (دقیقاً مثل مشکل قبلی pageBanner.enabled)
export const videoTestimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "نام بیمار الزامی است"),
  description: z.string().min(2, "توضیحات الزامی است"),
  rating: z.number().min(1).max(5),
  duration: z.string().optional(),
  // بدون .url() — چون تصاویر می‌توانند مسیر نسبی از Local Storage باشند (مثل /images/...)
  thumbnailImage: z.string().optional().or(z.literal("")),
  videoUrl: z.string().optional().or(z.literal("")),
});
export type VideoTestimonial = z.infer<typeof videoTestimonialSchema>;

export const brandSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "نام برند الزامی است"),
  // بدون .url() — همان دلیل بالا
  imageUrl: z.string().optional().or(z.literal("")),
});
export type Brand = z.infer<typeof brandSchema>;

// اسکیمای فرم تنظیمات پایه — توجه: serviceDetail عمداً اینجا نیست،
// چون فقط باید توسط HomeContentForm/updateHomeContentAction مدیریت شود (نه اینجا هم)
export const basicSettingsSchema = z.object({
  clinicName: z.string().min(2, "نام کلینیک باید حداقل ۲ کاراکتر باشد"),
  phone: z.string().min(8, "شماره تماس معتبر نیست"),
  address: z.string().optional(),
  instagram: z.string().optional(),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  workingHours: z.string().optional(),
  aboutText: z.string().optional(),

  heroImageUrl: z.string().optional().or(z.literal("")),
  bannerImages: z.array(z.string()).optional(),

  licenseText: z.string().optional(),
  usefulLinks: z.array(usefulLinkSchema).optional(),

  latitude: z.string().optional(),
  longitude: z.string().optional(),
  mapZoom: z.number().min(1).max(22),

  consultationTitle: z.string().optional(),
  consultationSubtitle: z.string().optional(),
  consultationButtonText: z.string().optional(),
  consultationBackgroundImage: z.string().optional().or(z.literal("")),

  featuresBackgroundImage: z.string().optional().or(z.literal("")),
  videoTestimonialsBackgroundImage: z.string().optional().or(z.literal("")),
  recentPatientsBackgroundImage: z.string().optional().or(z.literal("")),

  brands: z.array(brandSchema).optional(),
  videoTestimonials: z.array(videoTestimonialSchema).optional(),
  brandsBackgroundImage: z.string().optional().or(z.literal("")),
});
export type BasicSettingsInput = z.infer<typeof basicSettingsSchema>;

export const siteSettingsSchema = basicSettingsSchema.extend({
  features: z.array(featureSchema).optional(),
  serviceDetail: serviceDetailSchema.optional(),
  serviceTags: z.array(serviceTagSchema).optional(),
  recentShowcaseCases: z.array(showcaseCaseSchema).optional(),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const homeContentSchema = z.object({
  features: z.array(featureSchema).optional(),
  serviceDetail: serviceDetailSchema.optional(),
  serviceTags: z.array(serviceTagSchema).optional(),
  recentShowcaseCases: z.array(showcaseCaseSchema).optional(),
});
export type HomeContentInput = z.infer<typeof homeContentSchema>;
