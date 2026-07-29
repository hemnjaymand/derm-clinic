"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getStorageProvider, extractKeyFromUrl } from "@/lib/storage";
import {
  galleryImageSchema,
  type GalleryImageInput,
} from "../schemas/gallery.schema";

export async function getGalleryImages() {
  return prisma.gallery.findMany({ orderBy: { order: "asc" } });
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createGalleryImageAction(
  input: GalleryImageInput,
): Promise<ActionResult> {
  const parsed = galleryImageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات تصویر معتبر نیست" };
  }

  try {
    const count = await prisma.gallery.count();
    await prisma.gallery.create({
      data: {
        title: parsed.data.caption || "بدون عنوان",
        image: parsed.data.url,
        description: parsed.data.caption || null,
        order: count,
      },
    });

    revalidatePath("/dashboard/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در ثبت تصویر" };
  }
}

export async function deleteGalleryImageAction(
  id: string,
): Promise<ActionResult> {
  try {
    const image = await prisma.gallery.findUnique({ where: { id } });
    if (!image) return { success: false, error: "تصویر یافت نشد" };

    await prisma.gallery.delete({ where: { id } });
    // حذف فایل از Storage — اگه خطا بده، رکورد دیتابیس همچنان حذف مونده (قابل قبول برای MVP)
    await getStorageProvider().delete(extractKeyFromUrl(image.image));

    revalidatePath("/dashboard/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در حذف تصویر" };
  }
}

export async function reorderGalleryImageAction(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    const images = await prisma.gallery.findMany({ orderBy: { order: "asc" } });
    const index = images.findIndex((img) => img.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (index === -1 || swapIndex < 0 || swapIndex >= images.length) {
      return { success: true }; // در لبه‌ی لیست، کاری انجام نمی‌شود
    }

    await prisma.$transaction([
      prisma.gallery.update({
        where: { id: images[index].id },
        data: { order: images[swapIndex].order },
      }),
      prisma.gallery.update({
        where: { id: images[swapIndex].id },
        data: { order: images[index].order },
      }),
    ]);

    revalidatePath("/dashboard/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در تغییر ترتیب" };
  }
}
