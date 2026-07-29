"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import {
  deleteServiceAction,
  toggleServiceActiveAction,
} from "../actions/services.actions";
import type { Service } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { ServiceFormDialog } from "./service-form-dialog";

export function ServiceTable({ services }: { services: Service[] }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(service: Service) {
    startTransition(async () => {
      const result = await toggleServiceActiveAction(
        service.id,
        !service.isActive,
      );
      if (!result.success) toast.error(result.error);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteServiceAction(id);
      if (result.success) toast.success("خدمت حذف شد");
      else toast.error(result.error);
    });
  }

  if (services.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">هنوز خدمتی ثبت نشده است.</p>
    );
  }
return (
  // ۱. کانتینر اسکرول افقی برای موبایل
  <div className="w-full overflow-x-auto pb-4">
    {/* ۲. حداقل عرض (min-w) تا جدول در موبایل فشرده نشود */}
    <Table dir="rtl" className="w-full min-w-[700px]">
      <TableHeader>
        <TableRow>
          {/* ۳. جلوگیری از شکستن متن‌ها به خط بعد */}
          <TableHead className="whitespace-nowrap text-right">عنوان</TableHead>
          <TableHead className="whitespace-nowrap text-right">مدت زمان</TableHead>
          <TableHead className="whitespace-nowrap text-right">قیمت</TableHead>
          <TableHead className="whitespace-nowrap text-right">وضعیت</TableHead>
          <TableHead className="w-24" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium whitespace-nowrap">{service.title}</TableCell>
            <TableCell className="whitespace-nowrap">{service.durationMin} دقیقه</TableCell>
            <TableCell className="whitespace-nowrap">
              {service.price
                ? `${service.price.toLocaleString("fa-IR")} تومان`
                : "—"}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <button
                disabled={isPending}
                onClick={() => handleToggle(service)}
                // ۴. بزرگتر کردن ناحیه کلیک برای موبایل
                className="inline-block py-1 cursor-pointer"
              >
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </button>
            </TableCell>
            {/* ۵. تراز کردن دکمه‌های عملیات به انتهای سلول */}
            <TableCell className="flex items-center justify-end gap-2 whitespace-nowrap">
              <ServiceFormDialog service={service} />
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={() => handleDelete(service.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
}
