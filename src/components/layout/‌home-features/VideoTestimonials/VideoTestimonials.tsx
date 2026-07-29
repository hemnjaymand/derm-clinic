import { getSiteSettings } from "@/features/settings/actions/settings.actions";
import { VideoTestimonialsClient } from "./VideoTestimonialsClient";
import { SectionWrapper } from "../../SectionWrapper";

export async function VideoTestimonials() {
  const settings = await getSiteSettings();
  const videos = settings.videoTestimonials;

  // if (!videos || videos.length === 0) {
  //   return null;
  // }

  const backgroundImage =
    settings.videoTestimonialsBackgroundImage || "/images/video-testimonials-bg.jpg";

  return (
    <SectionWrapper
      background={{
        type: "image",
        value: backgroundImage,
        overlay: true,
        overlayOpacity: 40,
      }}
      className="py-16 md:py-20"
    >
      <VideoTestimonialsClient videos={videos} />
    </SectionWrapper>
  );
}