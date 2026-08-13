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
import { Button } from "@/components/ui/button";
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
      <div
        className="rounded-2xl border border-border/40 bg-card/35 p-8 text-center shadow-sm"
        dir="rtl"
      >
        <p className="text-sm text-muted-foreground">
          هنوز خدمتی ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-border/40 bg-card/35 shadow-sm overflow-hidden"
      dir="rtl"
    >
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[700px]">
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="whitespace-nowrap text-right font-bold text-foreground py-4 px-6">
                عنوان
              </TableHead>
              <TableHead className="whitespace-nowrap text-right font-bold text-foreground py-4 px-6">
                مدت زمان
              </TableHead>
              <TableHead className="whitespace-nowrap text-right font-bold text-foreground py-4 px-6">
                قیمت
              </TableHead>
              <TableHead className="whitespace-nowrap text-right font-bold text-foreground py-4 px-6">
                وضعیت
              </TableHead>
              <TableHead className="w-24 py-4 px-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service.id}
                className="border-b border-border/40 transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-medium whitespace-nowrap py-4 px-6 text-foreground">
                  {service.title}
                </TableCell>
                <TableCell className="whitespace-nowrap py-4 px-6 font-mono text-xs">
                  {service.durationMin} دقیقه
                </TableCell>
                <TableCell className="whitespace-nowrap py-4 px-6 font-mono text-xs">
                  {service.price
                    ? `${service.price.toLocaleString("fa-IR")} تومان`
                    : "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap py-4 px-6">
                  <button
                    disabled={isPending}
                    onClick={() => handleToggle(service)}
                    className="inline-block py-1 cursor-pointer"
                  >
                    <Badge
                      variant={service.isActive ? "default" : "secondary"}
                      className="rounded-xl px-2.5 py-1"
                    >
                      {service.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="flex items-center justify-end gap-2 whitespace-nowrap py-4 px-6">
                  <ServiceFormDialog service={service} />
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => handleDelete(service.id)}
                    className="rounded-xl hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
