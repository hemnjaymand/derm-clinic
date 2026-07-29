"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Plus, Upload } from "lucide-react";
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
import { blogPostSchema, type BlogPostInput } from "../schemas/blog.schema";
import { createBlogPostAction, updateBlogPostAction } from "../actions/blog.actions";
import type { Blog } from "@prisma/client";

export function BlogFormDialog({ post }: { post?: Blog }) {
  const isEdit = !!post;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
      coverImage: post?.coverImage ?? "",
      isPublished: post?.isPublished ?? false,
    },
  });

  useEffect(() => {
    if (open && post) form.reset();
  }, [open, post, form]);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "خطا در آپلود تصویر");
        return;
      }
      form.setValue("coverImage", data.url);
    } finally {
      setIsUploadingCover(false);
    }
  }

  function onSubmit(values: BlogPostInput) {
    startTransition(async () => {
      const result = isEdit
        ? await updateBlogPostAction(post.id, values)
        : await createBlogPostAction(values);

      if (result.success) {
        toast.success(isEdit ? "مقاله ویرایش شد" : "مقاله ثبت شد");
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
            مقاله جدید
          </Button>
        )}
      </DialogTrigger>

      <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "ویرایش مقاله" : "مقاله جدید"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>تصویر کاور</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleCoverUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingCover}
            >
              <Upload className="ml-2 h-4 w-4" />
              {isUploadingCover ? "در حال آپلود..." : form.watch("coverImage") ? "تغییر تصویر" : "انتخاب تصویر"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              محتوا <span className="text-xs text-muted-foreground">(از Markdown پشتیبانی می‌شود)</span>
            </Label>
            <textarea
              id="content"
              rows={10}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" {...form.register("isPublished")} />
            انتشار در سایت
          </label>

          <Button type="submit" className="w-full" disabled={isPending || isUploadingCover}>
            {isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}