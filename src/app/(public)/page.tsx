// app/page.tsx
import { HeroSlider } from "@/components/layout";
import { BrandsMarquee } from "@/components/layout/‌home-features/BrandsMarquee/BrandsMarquee";
import { ConsultationForm } from "@/components/layout/‌home-features/Consultation/Consultation-Form";
import { FeaturesSection } from "@/components/layout/‌home-features/FeaturesSection/Features-Section";

import { VideoTestimonials } from "@/components/layout/‌home-features/VideoTestimonials/VideoTestimonials";
import { RecentPatients } from "@/components/layout/‌home-features/RecentPatients/Recent-Patients";
import { ServiceDetailSection } from "@/components/layout/‌home-features/ServiceDetailSection/Service-Detail-Section";

const Homepage = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* =====  بنر اصلی (Hero) - بدون Container چون خودش full-width است ===== */}
      <HeroSlider />

      {/* =====  سایر بخش‌ها با فاصله‌گذاری یکنواخت ===== */}
      <div className="container mx-auto px-4 space-y-20 md:space-y-28">
        {/* جزئیات خدمات */}
        <ServiceDetailSection/>

        {/* ویژگی‌ها (What We Offer*/}
         <FeaturesSection />

        {/* نمونه‌های قبل و بعد */}
        <RecentPatients />

        {/* ویدئوهای تستیمونیال */}
        <VideoTestimonials />

        {/* برندهای معتبر */}
        <BrandsMarquee />
        {/* فرم مشاوره */}
        <ConsultationForm /> 

      </div>
    </main>
  );
};

export default Homepage;
