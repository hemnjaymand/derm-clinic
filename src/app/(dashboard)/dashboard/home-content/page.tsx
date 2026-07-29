import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { HomeContentForm } from "@/features/settings/components/home-content-form";

export default async function HomeContentPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">محتوای صفحه اصلی</h1>
      <HomeContentForm
        initialData={{
          features: settings.features,
          serviceDetail: settings.serviceDetail ?? undefined,
          serviceTags: settings.serviceTags,
          recentShowcaseCases: settings.recentShowcaseCases,
        }}
      />
    </div>
  );
}