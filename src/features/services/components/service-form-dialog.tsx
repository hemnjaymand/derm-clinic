"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";

import { serviceSchema, type ServiceInput } from "../schemas/service.schema";
import {
  createServiceAction,
  updateServiceAction,
} from "../actions/services.actions";
import type { Service } from "@prisma/client";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ServiceFormDialog({ service }: { service?: Service }) {
  const isEdit = !!service;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title ?? "",
      description: service?.description ?? "",
      durationMin: service?.durationMin ?? 30,
      price: service?.price ?? undefined,
      imageUrl: service?.description ?? "",
      isActive: service?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open && service) {
      form.reset({
        title: service.title,
        description: service.description ?? "",
        durationMin: service.durationMin,
        price: service.price ?? undefined,
        imageUrl: "",
        isActive: service.isActive,
      });
    }
  }, [open, service, form]);

  function onSubmit(values: ServiceInput) {
    startTransition(async () => {
      const result = isEdit
        ? await updateServiceAction(service.id, values)
        : await createServiceAction(values);

      if (result.success) {
        toast.success(isEdit ? "خدمت ویرایش شد" : "خدمت ثبت شد");
        setOpen(false);
        if (!isEdit) form.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            افزودن خدمت
          </Button>
        )}
      </DialogTrigger>

      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "ویرایش خدمت" : "افزودن خدمت جدید"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Input id="description" {...form.register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationMin">مدت زمان (دقیقه)</Label>
              <Input
                id="durationMin"
                type="number"
                {...form.register("durationMin")}
              />
              {form.formState.errors.durationMin && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.durationMin.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">قیمت (تومان، اختیاری)</Label>
              <Input id="price" type="number" {...form.register("price")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">آدرس تصویر (اختیاری)</Label>
            <Input
              id="imageUrl"
              placeholder="https://..."
              {...form.register("imageUrl")}
            />
            {form.formState.errors.imageUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.imageUrl.message}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              {...form.register("isActive")}
            />
            نمایش در سایت (فعال)
          </label>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
