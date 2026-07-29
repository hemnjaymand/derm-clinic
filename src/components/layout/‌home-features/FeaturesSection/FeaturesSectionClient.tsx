

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
//  نقشه آیکون‌ها
// ============================================================
const iconMap: Record<string, React.ReactNode> = {
  تکنولوژی: <Microscope className="h-12 w-12" />,
  تحلیل: <ScanFace className="h-12 w-12" />,
  شخصی: <UserCog className="h-12 w-12" />,
  پیشرفته: <Zap className="h-12 w-12" />,
  دقیق: <Target className="h-12 w-12" />,
  مناسب: <Layers className="h-12 w-12" />,
  امن: <Shield className="h-12 w-12" />,
  کیفیت: <Sparkles className="h-12 w-12" />,
};

function getFeatureIcon(iconKey?: string) {
  if (!iconKey) return <Sparkles className="h-12 w-12" />;
  return iconMap[iconKey] || <Sparkles className="h-12 w-12" />;
}

export function FeaturesSectionClient({ features }: { features: Feature[] }) {
  if (features.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      {/* عنوان بخش */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          What We Offer
        </h2>
        <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-primary" />
      </div>

      {/* گرید ویژگی‌ها */}
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => {
          const icon = getFeatureIcon(feature.icon);

          return (
            <div
              key={feature.id}
              className="group rounded-2xl bg-card p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* آیکون */}
              <div className="mb-4 flex justify-center text-primary">
                <div className="rounded-full bg-primary/10 p-4 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  {icon}
                </div>
              </div>

              {/* عنوان */}
              <h3 className="mb-3 text-xl font-bold text-foreground">
                {feature.title}
              </h3>

              {/* توضیحات */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}