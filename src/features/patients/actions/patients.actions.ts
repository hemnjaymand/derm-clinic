"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  patientUpdateSchema,
  type PatientUpdateInput,
} from "../schemas/patient.schema";

export type PatientListRow = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { appointments: number };
};

export async function getPatients(search?: string): Promise<PatientListRow[]> {
  return prisma.patient.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        }
      : undefined,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      nationalId: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { appointments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPatientWithHistory(id: string) {
  return prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { service: true },
        orderBy: { date: "desc" },
      },
    },
  });
}

type ActionResult = { success: true } | { success: false; error: string };

export async function updatePatientAction(
  id: string,
  input: PatientUpdateInput,
): Promise<ActionResult> {
  const parsed = patientUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات معتبر نیست" };
  }

  try {
    const [firstName, ...lastNameParts] = parsed.data.fullName
      .trim()
      .split(/\s+/);
    const lastName = lastNameParts.join(" ");

    await prisma.patient.update({
      where: { id },
      data: {
        firstName,
        lastName: lastName || "",
      },
    });

    revalidatePath("/dashboard/patients");
    revalidatePath(`/dashboard/patients/${id}`);
    return { success: true };
  } catch {
    return { success: false, error: "خطا در ویرایش اطلاعات بیمار" };
  }
}
