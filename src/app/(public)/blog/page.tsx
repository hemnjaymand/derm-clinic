import Link from "next/link";
import Image from "next/image";
import { formatJalaliDate } from "@/lib/date";
import { getPublishedBlogPosts } from "@/features/blog/actions/blog.actions";
import { getPageBanner } from "@/features/settings/actions/settings.actions";
import { ArrowLeft, FileText } from "lucide-react";
import PageBanner from "@/components/shared/page-banner";

export const revalidate = 300;

export default async function PublicBlogPage() {
  // دریافت همزمان مقالات و اطلاعات بنر صفحه "مقالات" (blog)
  const [posts, banner] = await Promise.all([
    getPublishedBlogPosts(),
    getPageBanner("blog"),
  ]);

  return (
    <>
      {/* نمایش بنر داینامیک در صورت فعال بودن در دشبورد */}
      {banner && <PageBanner fallbackTitle="" banner={banner} />}

      <div className="container mx-auto px-4 py-12 md:py-16" dir="rtl">
        {/* اگر بنر فعال نبود، یک تایتل ساده نشان می‌دهیم تا صفحه خالی نماند */}
        {!banner && (
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">مقالات و آموزش‌ها</h1>
            <p className="mt-3 text-muted-foreground">تازه‌ترین مطالب تخصصی کلینیک</p>
          </div>
        )}

        {posts.length === 0 ? (
          // طراحی بهتر برای حالت خالی بودن مقالات
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h2 className="text-lg font-medium text-foreground">هنوز مقاله‌ای منتشر نشده است</h2>
            <p className="mt-1 text-sm text-muted-foreground">به زودی با مطالب جدید برمی‌گردیم.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                // کلاس group برای افکت‌های هاور سراسری اعمال شده است
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {post.coverImage ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    <Image 
                      src={post.coverImage} 
                      alt={post.title} 
                      fill 
                      // عکس با هاور روی کارت، کمی زوم می‌شود
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  // یک جایگزین (Fallback) زیبا برای مقالاتی که عکس ندارند
                  <div className="flex aspect-[16/9] w-full items-center justify-center bg-muted/50">
                    <FileText className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                
                {/* بخش محتوای کارت */}
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  {/* line-clamp-2 باعث می‌شود عناوین طولانی ظاهر کارت را خراب نکنند */}
                  <h2 className="line-clamp-2 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  
                  {/* این بخش به کمک mt-auto همیشه به پایین‌ترین قسمت کارت می‌چسبد */}
                  <div className=" flex items-center justify-between border-t border-border/60 pt-4 mt-6">
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatJalaliDate(post.publishedAt ?? post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary transition-transform duration-300 group-hover:-translate-x-1">
                      ادامه مطلب
                      <ArrowLeft className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}