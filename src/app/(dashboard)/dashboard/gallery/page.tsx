import { getGalleryImages } from "@/features/gallery/actions/gallery.actions";
import { ImageUploader } from "@/features/gallery/components/image-uploader";
import { GalleryGrid } from "@/features/gallery/components/gallery-grid";

export default async function DashboardGalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">گالری تصاویر</h1>
        <ImageUploader />
      </div>
      <GalleryGrid images={images} />
    </div>
  );
}