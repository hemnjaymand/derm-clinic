import Link from "next/link";
import Image from "next/image";
import { formatJalaliDate } from "@/lib/date";
import type { Blog } from "@prisma/client";

export function BlogPostCard({ post }: { post: Blog}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
    >
      {post.coverImage && (
        <div className="relative aspect-video">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <h2 className="mb-2 font-semibold">{post.title}</h2>
        <p className="text-xs text-muted-foreground">
          {formatJalaliDate(post.publishedAt ?? post.createdAt)}
        </p>
      </div>
    </Link>
  );
}