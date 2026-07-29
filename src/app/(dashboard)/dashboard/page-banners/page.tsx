import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { PageBannersForm } from "@/features/settings/components/page-banners-form";

export default async function PageBannersPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">بنرهای اختصاصی صفحات</h1>
      <PageBannersForm  initialData={settings.pageBanners} />
    </div>
  );
}