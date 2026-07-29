"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { blogPostSchema, type BlogPostInput } from "../schemas/blog.schema";

export async function getBlogPosts() {
  return prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPublishedBlogPosts() {
  return prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blog.findUnique({ where: { slug } });
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createBlogPostAction(input: BlogPostInput): Promise<ActionResult> {
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات مقاله معتبر نیست" };
  }

  try {
    await prisma.blog.create({
      data: {
        title: parsed.data.title,
        slug: slugify(parsed.data.title),
        content: parsed.data.content,
        coverImage: parsed.data.coverImage || null,
        isPublished: parsed.data.isPublished,
        publishedAt: parsed.data.isPublished ? new Date() : null,
      },
    });

    revalidatePath("/dashboard/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در ثبت مقاله" };
  }
}

export async function updateBlogPostAction(
  id: string,
  input: BlogPostInput
): Promise<ActionResult> {
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات مقاله معتبر نیست" };
  }

  try {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "مقاله یافت نشد" };

    // publishedAt فقط در اولین لحظه‌ی انتشار مقدار می‌گیرد؛ با انتشار مجدد تغییر نمی‌کند
    const publishedAt =
      parsed.data.isPublished && !existing.isPublished ? new Date() : existing.publishedAt;

    await prisma.blog.update({
      where: { id },
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage || null,
        isPublished: parsed.data.isPublished,
        publishedAt,
      },
    });

    revalidatePath("/dashboard/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "خطا در ویرایش مقاله" };
  }
}

export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  try {
    await prisma.blog.delete({ where: { id } });
    revalidatePath("/dashboard/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در حذف مقاله" };
  }
}