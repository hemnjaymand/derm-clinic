"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, type ChangePasswordInput } from "../schemas/password.schema";

type ActionResult = { success: true } | { success: false; error: string };

export async function changePasswordAction(input: ChangePasswordInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "لطفاً وارد شوید" };
  }

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) {
    return { success: false, error: "ادمین یافت نشد" };
  }

  const isValid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!isValid) {
    return { success: false, error: "رمز عبور فعلی اشتباه است" };
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: newHash } });

  return { success: true };
}