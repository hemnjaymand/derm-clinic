import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBlogPostBySlug } from "@/features/blog/actions/blog.actions";
import { formatJalaliDate } from "@/lib/date";

export const revalidate = 300;

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-2xl px-4 py-12" dir="rtl">
      {post.coverImage && (
        <div className="relative mb-6 aspect-video overflow-hidden rounded-lg">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {formatJalaliDate(post.publishedAt ?? post.createdAt)}
      </p>

      <div className="prose prose-neutral max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}