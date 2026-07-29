"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  patientUpdateSchema,
  type PatientUpdateInput,
} from "../schemas/patient.schema";
import { updatePatientAction } from "../actions/patients.actions";
import type { Patient } from "@prisma/client";

export function PatientEditDialog({ patient }: { patient: Patient }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PatientUpdateInput>({
    resolver: zodResolver(patientUpdateSchema),
    defaultValues: { fullName: patient.id, notes: patient.nationalId ?? "" },
  });

  function onSubmit(values: PatientUpdateInput) {
    startTransition(async () => {
      const result = await updatePatientAction(patient.id, values);
      if (result.success) {
        toast.success("اطلاعات بیمار ذخیره شد");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="ml-2 h-4 w-4" />
          ویرایش اطلاعات
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>ویرایش اطلاعات بیمار</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">نام و نام خانوادگی</Label>
            <Input id="fullName" {...form.register("fullName")} />
            {form.formState.errors.fullName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">یادداشت (اختیاری)</Label>
            <Input id="notes" {...form.register("notes")} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}