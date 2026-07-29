"use server";

import { revalidatePath } from "next/cache";
import { serviceSchema, type ServiceInput } from "../schemas/service.schema";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function getServices() {
  return prisma.service.findMany({ orderBy: { title: "asc" } });
}

export async function getActiveServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({ where: { slug } });
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createServiceAction(
  input: ServiceInput,
): Promise<ActionResult> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات خدمت معتبر نیست" };
  }

  try {
    await prisma.service.create({
      data: {
        title: parsed.data.title,
        slug: slugify(parsed.data.title),
        description: parsed.data.description || null,
        durationMin: parsed.data.durationMin,
        price: parsed.data.price ?? null,
        isActive: parsed.data.isActive,
      },
    });

    revalidatePath("/dashboard/services");
    revalidatePath("/services");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در ثبت خدمت" };
  }
}

export async function updateServiceAction(
  id: string,
  input: ServiceInput,
): Promise<ActionResult> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات خدمت معتبر نیست" };
  }

  try {
    await prisma.service.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        durationMin: parsed.data.durationMin,
        price: parsed.data.price ?? null,
        isActive: parsed.data.isActive,
      },
    });

    revalidatePath("/dashboard/services");
    revalidatePath("/services");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در ویرایش خدمت" };
  }
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/dashboard/services");
    revalidatePath("/services");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "حذف ممکن نیست — این خدمت به نوبت‌های ثبت‌شده متصل است",
    };
  }
}

export async function toggleServiceActiveAction(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    await prisma.service.update({ where: { id }, data: { isActive } });
    revalidatePath("/dashboard/services");
    revalidatePath("/services");
    return { success: true };
  } catch {
    return { success: false, error: "خطا در تغییر وضعیت" };
  }
}
