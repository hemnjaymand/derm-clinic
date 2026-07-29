import { z } from "zod";

export const galleryImageSchema = z.object({
  // url: z.string().url("آدرس تصویر معتبر نیست"),
  url: z.string().min(1, "آدرس تصویر معتبر نیست"),
  caption: z.string().optional(),
});

export type GalleryImageInput = z.infer<typeof galleryImageSchema>;