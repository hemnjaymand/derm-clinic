import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { SettingsForm } from "@/features/settings/components/settings-form";
import { ChangePasswordForm } from "@/features/settings/components/change-password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, KeyRound, SlidersHorizontal, ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  // اضافه شدن مختصات نقشه به داده‌های اولیه برای پاس دادن به فرم
  const initialData = {
    clinicName: settings.clinicName,
    phone: settings.phone,
    address: settings.address,
    instagram: settings.instagram,
    email: settings.email,
    workingHours: settings.workingHours,
    aboutText: settings.aboutText,
    heroImageUrl: settings.heroImageUrl,
    bannerImages: settings.bannerImages,
    licenseText: settings.licenseText,
    usefulLinks: settings.usefulLinks,
    latitude: settings.latitude,
    longitude: settings.longitude,
     mapZoom: typeof settings.mapZoom === "number" ? settings.mapZoom : Number(settings.mapZoom) || 16,
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-1 border-b pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">تنظیمات کلینیک</h1>
        <p className="text-sm text-muted-foreground">
          مدیریت اطلاعات عمومی، راه‌های ارتباطی و امنیت حساب کاربری
        </p>
      </div>

      {/* سیستم تب‌بندی تبدیل‌شده به سایدبار کناری (در موبایل ستونی، در دسکتاپ کنار هم) */}
      <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8 lg:gap-12" orientation="vertical">
        
        {/* ========================================== */}
        {/* سایدبار سمت راست (تب‌ها زیر هم قرار گرفتند) */}
        {/* ========================================== */}
        <div className="w-full md:w-64 shrink-0">
          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-2 items-stretch">
            
            <TabsTrigger 
              value="general" 
              className="justify-start px-4 py-3 h-12 text-right data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg border border-transparent data-[state=active]:border-primary/20 transition-all"
            >
              <Building2 className="ml-3 h-5 w-5" />
              <span className="font-medium">تنظیمات پایه و عمومی</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="security" 
              className="justify-start px-4 py-3 h-12 text-right data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg border border-transparent data-[state=active]:border-primary/20 transition-all"
            >
              <KeyRound className="ml-3 h-5 w-5" />
              <span className="font-medium">امنیت و رمز عبور</span>
            </TabsTrigger>

          </TabsList>
        </div>

        {/* ========================================== */}
        {/* محتوای اصلی (سمت چپ) */}
        {/* ========================================== */}
        <div className="flex-1 w-full min-w-0">
          
          {/* محتوای تنظیمات پایه و عمومی */}
          <TabsContent value="general" className="m-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">تنظیمات عمومی سایت</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    اطلاعاتی که در سراسر وب‌سایت و نقشه به کاربران نمایش داده می‌شود
                  </p>
                </div>
              </div>

              <SettingsForm initialData={initialData} />
            </div>
          </TabsContent>

          {/* محتوای امنیت و رمز عبور */}
          <TabsContent value="security" className="m-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">تغییر رمز عبور پنل</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    برای امنیت بیشتر، از رمز عبور قوی استفاده کنید
                  </p>
                </div>
              </div>

              <div className="max-w-xl">
                <ChangePasswordForm />
              </div>
            </div>
          </TabsContent>

        </div>

      </Tabs>
    </div>
  );
}