// app/page.tsx
import { HeroSlider } from "@/components/layout";
import { BrandsMarquee } from "@/components/layout/HomeFeatures/BrandsMarquee/BrandsMarquee";
import { ConsultationForm } from "@/components/layout/HomeFeatures/Consultation/Consultation-Form";
import { FeaturesSection } from "@/components/layout/HomeFeatures/FeaturesSection/Features-Section";
import { RecentPatients } from "@/components/layout/HomeFeatures/RecentPatients/Recent-Patients";
import { ServiceDetailSection } from "@/components/layout/HomeFeatures/ServiceDetailSection/Service-Detail-Section";

import { VideoTestimonials } from "@/components/layout/HomeFeatures/VideoTestimonials/VideoTestimonials";
import { ServicesShowcase } from "@/components/layout/HomeFeatures/ServicesShowcase/ServicesShowcase";

const Homepage = () => {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      <BrandsMarquee />
      <ServicesShowcase />
      <VideoTestimonials />

      <div className="container mx-auto space-y-20 px-4 py-16 md:space-y-28 md:py-24">
        <ServiceDetailSection />
        <FeaturesSection />
        <RecentPatients />
        <ConsultationForm />
      </div>
    </main>
  );
};

export default Homepage;
