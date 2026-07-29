import { z } from "zod";

export const patientUpdateSchema = z.object({
  fullName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  notes: z.string().optional(),
});

export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;