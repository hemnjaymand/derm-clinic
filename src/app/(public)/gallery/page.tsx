import Image from "next/image";
import { getGalleryImages } from "@/features/gallery/actions/gallery.actions";
import { getPageBanner } from "@/features/settings/actions/settings.actions";
import PageBanner from "@/components/shared/page-banner";
import { Image as ImageIcon } from "lucide-react";

export const revalidate = 300;

export default async function PublicGalleryPage() {
  // دریافت همزمان تصاویر گالری و اطلاعات بنر صفحه
  const [images, banner] = await Promise.all([
    getGalleryImages(),
    getPageBanner("gallery"),
  ]);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* نمایش بنر داینامیک صفحه گالری */}
      {banner && <PageBanner fallbackTitle="" banner={banner} />}

      <div className="container mx-auto px-4 py-16 md:py-24" dir="rtl">
        {/* اگر بنر فعال نبود، یک هدر ساده نمایش داده شود */}
        {!banner && (
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">گالری تصاویر کلینیک</h1>
            <p className="mt-3 text-muted-foreground">تصاویری از محیط و نمونه کارهای مجموعه</p>
          </div>
        )}

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center">
            <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h2 className="text-lg font-medium text-foreground">تصویری برای نمایش وجود ندارد</h2>
            <p className="mt-1 text-sm text-muted-foreground">به زودی تصاویر جدید اضافه خواهد شد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <Image
                  src={image.image}
                  alt={image.description ?? "تصویر کلینیک"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* لایه توضیحات در صورت داشتن کپشن */}
                {image.description && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to from-black/70 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs font-medium text-white md:text-sm">
                      {image.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}