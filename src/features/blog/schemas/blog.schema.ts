import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد"),
  content: z.string().min(20, "محتوا باید حداقل ۲۰ کاراکتر باشد"),
  coverImage: z.string().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
  isPublished: z.boolean(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;