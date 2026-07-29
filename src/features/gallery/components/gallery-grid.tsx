"use client";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteGalleryImageAction,
  reorderGalleryImageAction,
} from "../actions/gallery.actions";
import type { Gallery } from "@prisma/client";

export function GalleryGrid({ images }: { images: Gallery[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteGalleryImageAction(id);
      if (result.success) toast.success("تصویر حذف شد");
      else toast.error(result.error);
    });
  }

  function handleReorder(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const result = await reorderGalleryImageAction(id, direction);
      if (!result.success) toast.error(result.error);
    });
  }

  if (images.length === 0) {
    return <p className="text-sm text-muted-foreground">هنوز تصویری اضافه نشده است.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden rounded-md border">
          <div className="relative aspect-square">
            <Image src={image.image} alt={image.description ?? ""} fill className="object-cover" />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:text-white"
                disabled={isPending}
                onClick={() => handleReorder(image.id, "up")}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:text-white"
                disabled={isPending}
                onClick={() => handleReorder(image.id, "down")}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:text-white"
              disabled={isPending}
              onClick={() => handleDelete(image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}