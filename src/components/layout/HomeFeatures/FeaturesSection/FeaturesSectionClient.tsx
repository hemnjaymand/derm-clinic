"use client";

import {
  Microscope,
  ScanFace,
  UserCog,
  Sparkles,
  Shield,
  Target,
  Layers,
  Zap,
} from "lucide-react";

type Feature = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

// ============================================================
//  نقشه جامع آیکون‌ها (پشتیبانی از نام‌های فارسی و انگلیسی)
// ============================================================
const iconMap: Record<string, React.ReactNode> = {
  // کلیدهای فارسی
  تکنولوژی: <Microscope className="h-8 w-8 md:h-10 md:w-10" />,
  تحلیل: <ScanFace className="h-8 w-8 md:h-10 md:w-10" />,
  شخصی: <UserCog className="h-8 w-8 md:h-10 md:w-10" />,
  پیشرفته: <Zap className="h-8 w-8 md:h-10 md:w-10" />,
  دقیق: <Target className="h-8 w-8 md:h-10 md:w-10" />,
  مناسب: <Layers className="h-8 w-8 md:h-10 md:w-10" />,
  امن: <Shield className="h-8 w-8 md:h-10 md:w-10" />,
  کیفیت: <Sparkles className="h-8 w-8 md:h-10 md:w-10" />,

  // کلیدهای انگلیسی (Lucide)
  microscope: <Microscope className="h-8 w-8 md:h-10 md:w-10" />,
  scanface: <ScanFace className="h-8 w-8 md:h-10 md:w-10" />,
  usercog: <UserCog className="h-8 w-8 md:h-10 md:w-10" />,
  zap: <Zap className="h-8 w-8 md:h-10 md:w-10" />,
  target: <Target className="h-8 w-8 md:h-10 md:w-10" />,
  layers: <Layers className="h-8 w-8 md:h-10 md:w-10" />,
  shield: <Shield className="h-8 w-8 md:h-10 md:w-10" />,
  sparkles: <Sparkles className="h-8 w-8 md:h-10 md:w-10" />,
};

function getFeatureIcon(iconKey?: string) {
  if (!iconKey) return <Sparkles className="h-8 w-8 md:h-10 md:w-10" />;
  const normalizedKey = iconKey.trim().toLowerCase();
  return (
    iconMap[iconKey] ||
    iconMap[normalizedKey] || <Sparkles className="h-8 w-8 md:h-10 md:w-10" />
  );
}

export function FeaturesSectionClient({ features }: { features: Feature[] }) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      {/* عنوان بخش - 🟢 فارسی‌سازی و اصلاح استایل */}
      <div className="mb-12 text-center md:mb-16">
        <h2 className="text-2xl font-bold text-foreground md:text-4xl">
          چرا کلینیک ما را انتخاب کنید؟
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          ارائه بهترین خدمات با پیشرفته‌ترین تجهیزات روز دنیا
        </p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
      </div>

      {/* گرید ویژگی‌ها - 🟢 Responsive & Modern Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {features.map((feature) => {
          const icon = getFeatureIcon(feature.icon);

          return (
            <div
              key={feature.id}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 md:p-8"
            >
              {/* آیکون */}
              <div className="mb-5 flex justify-center text-primary">
                <div className="rounded-2xl bg-primary/10 p-3.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground md:p-4">
                  {icon}
                </div>
              </div>

              {/* عنوان */}
              <h3 className="mb-2.5 text-lg font-bold text-foreground md:text-xl">
                {feature.title}
              </h3>

              {/* توضیحات */}
              <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
