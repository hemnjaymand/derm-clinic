"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  basicSettingsSchema,
  pageBannersSchema,
  homeContentSchema,
  usefulLinkSchema,
  featureSchema,
  serviceDetailSchema,
  serviceTagSchema,
  showcaseCaseSchema,
  brandSchema,
  videoTestimonialSchema,
  type BasicSettingsInput,
  type PageBanners,
  type PageBannerKey,
  type HomeContentInput,
  type UsefulLink,
  type Feature,
  type ServiceDetail,
  type ServiceTag,
  type ShowcaseCase,
  type Brand,
  type VideoTestimonial,
} from "../schemas/site-settings.schema";
import z from "zod";

export type SiteSettings = {
  clinicName: string;
  address: string;
  phone: string;
  instagram: string;
  email: string;
  workingHours: string;
  aboutText: string;
  heroImageUrl: string;
  bannerImages: string[];
  licenseText: string;
  usefulLinks: UsefulLink[];
  features: Feature[];
  serviceDetail: ServiceDetail | null;
  serviceTags: ServiceTag[];
  recentShowcaseCases: ShowcaseCase[];
  pageBanners: PageBanners;
  latestArticles: { title: string; href: string }[];
  latitude: string;
  longitude: string;
  mapZoom: number;
  consultationTitle: string;
  consultationSubtitle: string;
  consultationButtonText: string;
  consultationBackgroundImage: string;
  brands: Brand[];
  videoTestimonials: VideoTestimonial[];
  featuresBackgroundImage: string;
  videoTestimonialsBackgroundImage: string;
  recentPatientsBackgroundImage: string;
  brandsBackgroundImage: string;
  
};
const defaultBrands: Brand[] = [
  { id: "1", name: "Prostrolane", imageUrl: "/images/brands/prostrolane.png" },
  { id: "2", name: "APERFECTHA®", imageUrl: "/images/brands/aperfectha.png" },
  { id: "3", name: "INNOAESTHETICS", imageUrl: "/images/brands/innoaesthetics.png" },
  { id: "4", name: "Alaixin®", imageUrl: "/images/brands/alaixin.png" },
];


function safeJsonParse<T>(
  value: string | undefined,
  schema: z.ZodType<T>,
  fallback: T,
  keyNameForLog: string
): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    const result = schema.safeParse(parsed);
    if (!result.success) {
      console.warn(
        `⚠️ داده‌ی ذخیره‌شده برای "${keyNameForLog}" با ساختار موردانتظار مطابقت ندارد؛ از مقدار پیش‌فرض استفاده می‌شود.`,
        result.error.flatten()
      );
      return fallback;
    }
    return result.data;
  } catch {
    return fallback;
  }
}
const defaultVideoTestimonials: VideoTestimonial[] = [
  {
    id: "1",
    name: "رضایت زیبایوی عزیز از لیفت با نخ",
    description: "توسط دکتر قیصری مدرس لیفت با نخ در دانشگاه شهید بهشتی",
    rating: 5,
    duration: "0:00",
    thumbnailImage: "/images/testimonials/thumb-1.jpg",
  },
  {
    id: "2",
    name: "رضایت زیبایوی عزیز، بعد از انجام چند جلسه",
    description: "کریوکسی تزایی و مزوئیدلینگ در کلینیک گونه",
    rating: 5,
    duration: "0:00",
    thumbnailImage: "/images/testimonials/thumb-2.jpg",
  },
];

export async function getSiteSettings(): Promise<SiteSettings> {
  const [settings, latestPosts] = await Promise.all([
    prisma.setting.findMany(),
    prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { title: true, slug: true },
    }),
  ]);

  const getValue = (key: string, defaultValue = "") =>
    settings.find((s) => s.key === key)?.value ?? defaultValue;

  return {
    clinicName: getValue("clinicName", "کلینیک"),
    address: getValue("address"),
    phone: getValue("phone"),
    instagram: getValue("instagram"),
    email: getValue("email"),
    workingHours: getValue("workingHours"),
    aboutText: getValue("aboutText"),
    heroImageUrl: getValue("heroImageUrl"),
    licenseText: getValue("licenseText"),

      bannerImages: safeJsonParse(getValue("bannerImages"), z.array(z.string()), [], "bannerImages"),
    usefulLinks: safeJsonParse(getValue("usefulLinks"), z.array(usefulLinkSchema), [], "usefulLinks"),
    features: safeJsonParse(getValue("features"), z.array(featureSchema), [], "features"),
    serviceTags: safeJsonParse(getValue("serviceTags"), z.array(serviceTagSchema), [], "serviceTags"),
    recentShowcaseCases: safeJsonParse(
      getValue("recentShowcaseCases"),
      z.array(showcaseCaseSchema),
      [],
      "recentShowcaseCases"
    ),
    pageBanners: safeJsonParse(getValue("pageBanners"), pageBannersSchema, {}, "pageBanners"),

    serviceDetail: safeJsonParse(
      getValue("serviceDetail"),
      serviceDetailSchema.nullable(),
      null,
      "serviceDetail"
    ),

    brands: safeJsonParse(getValue("brands"), z.array(brandSchema), defaultBrands, "brands"),
    videoTestimonials: safeJsonParse(
      getValue("videoTestimonials"),
      z.array(videoTestimonialSchema),
      defaultVideoTestimonials,
      "videoTestimonials"
    ),

    latitude: getValue("latitude", ""),
    longitude: getValue("longitude", ""),
    mapZoom: Number(getValue("mapZoom", "16")),

    consultationTitle: getValue("consultationTitle", "درخواست مشاوره رایگان"),
    consultationSubtitle: getValue("consultationSubtitle", "تنها سه قدم تا رزرو وقت"),
    consultationButtonText: getValue("consultationButtonText", "ثبت درخواست"),
    consultationBackgroundImage: getValue("consultationBackgroundImage", ""),

   featuresBackgroundImage: getValue("featuresBackgroundImage", "/images/features-bg.jpg"),
  videoTestimonialsBackgroundImage: getValue(
    "videoTestimonialsBackgroundImage",
    "/images/video-testimonials-bg.jpg"
  ),
  recentPatientsBackgroundImage: getValue(
    "recentPatientsBackgroundImage",
    "/images/recent-patients-bg.jpg"
  ),
  brandsBackgroundImage: getValue("brandsBackgroundImage", ""),   // ← این خط اضافه شود

  latestArticles: latestPosts.map((post) => ({
    title: post.title,
    href: `/blog/${post.slug}`,
  })),
};
}
export async function getPageBanner(page: PageBannerKey) {
  const settings = await getSiteSettings();
  const banner = settings.pageBanners[page];
  if (!banner || banner.enabled === false) return null;
  return banner;
}

type ActionResult = { success: true } | { success: false; error: string };

/**
 * ذخیره‌ی تنظیمات پایه (SettingsForm). عمداً serviceDetail را دست نمی‌زند —
 * آن فقط مسئولیت updateHomeContentAction است تا دو فرم روی یک داده رقابت نکنند.
 */
// src/features/settings/actions/settings.actions.ts

export async function updateSiteSettingsAction(
  input: BasicSettingsInput,
): Promise<ActionResult> {
  const parsed = basicSettingsSchema.safeParse(input);
  if (!parsed.success) {
    console.error("❌ Validation error:", parsed.error.errors);
    return { success: false, error: "اطلاعات تنظیمات معتبر نیست" };
  }

  try {
    const {
      bannerImages,
      usefulLinks,
      brands,
      videoTestimonials,
      // serviceDetail,
      ...scalarFields
    } = parsed.data;

    const scalarFieldsForDb = {
      ...scalarFields,
      mapZoom: String(scalarFields.mapZoom ?? 16),
    };

    const entries: [string, string][] = [
      ...Object.entries(scalarFieldsForDb).map(
        ([key, value]) => [key, value ?? ""] as [string, string],
      ),
      ["bannerImages", JSON.stringify(bannerImages ?? [])],
      ["usefulLinks", JSON.stringify(usefulLinks ?? [])],
      ["brands", JSON.stringify(brands ?? [])],
      ["videoTestimonials", JSON.stringify(videoTestimonials ?? [])],
      // ["serviceDetail", JSON.stringify(serviceDetail ?? null)],
    ];

    // ❌ قبلی: ۱۹ اتصال هم‌زمان
    // await Promise.all(
    //   entries.map(([key, value]) =>
    //     prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } })
    //   )
    // );

    // ✅ جدید: یک تراکنش با یک اتصال
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        }),
      ),
    );

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/settings");

    console.log("✅ Settings updated successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error saving settings:", error);
    return { success: false, error: "خطا در ذخیره‌سازی تنظیمات" };
  }
}

export async function updatePageBannersAction(
  input: PageBanners,
): Promise<ActionResult> {
  const parsed = pageBannersSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات بنرها معتبر نیست" };
  }

  try {
    await prisma.setting.upsert({
      where: { key: "pageBanners" },
      create: { key: "pageBanners", value: JSON.stringify(parsed.data) },
      update: { value: JSON.stringify(parsed.data) },
    });

    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/gallery");
    revalidatePath("/blog");
    revalidatePath("/contact");
    revalidatePath("/dashboard/page-banners");
    return { success: true };
  } catch (error) {
    console.error("❌ Error saving page banners:", error);
    return { success: false, error: "خطا در ذخیره‌سازی بنرها" };
  }
}

/** تنها Action مجاز برای نوشتن serviceDetail */
export async function updateHomeContentAction(
  input: HomeContentInput,
): Promise<ActionResult> {
  const parsed = homeContentSchema.safeParse(input);
  if (!parsed.success) {
    console.error("❌ Validation error in home content:", parsed.error.errors);
    return { success: false, error: "اطلاعات محتوای صفحه اصلی معتبر نیست" };
  }

  try {
    const { features, serviceDetail, serviceTags, recentShowcaseCases } =
      parsed.data;

    const operations = [
      { key: "features", value: JSON.stringify(features ?? []) },
      { key: "serviceDetail", value: JSON.stringify(serviceDetail ?? null) },
      { key: "serviceTags", value: JSON.stringify(serviceTags ?? []) },
      {
        key: "recentShowcaseCases",
        value: JSON.stringify(recentShowcaseCases ?? []),
      },
    ];

    await Promise.all(
      operations.map(({ key, value }) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        }),
      ),
    );

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/home-content");
    return { success: true };
  } catch (error) {
    console.error("❌ Error saving home content:", error);
    return { success: false, error: "خطا در ذخیره‌سازی محتوای صفحه اصلی" };
  }
}
