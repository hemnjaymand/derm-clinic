"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatJalaliDate } from "@/lib/date";
import { BlogFormDialog } from "./blog-form-dialog";
import { deleteBlogPostAction } from "../actions/blog.actions";
import type { Blog } from "@prisma/client";

export function BlogTable({ posts }: { posts: Blog[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteBlogPostAction(id);
      if (result.success) toast.success("مقاله حذف شد");
      else toast.error(result.error);
    });
  }

  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">هنوز مقاله‌ای ثبت نشده است.</p>;
  }

  return (
    <Table dir="rtl">
      <TableHeader>
        <TableRow>
          <TableHead>عنوان</TableHead>
          <TableHead>تاریخ ایجاد</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead className="w-24" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>{formatJalaliDate(post.createdAt)}</TableCell>
            <TableCell>
              <Badge variant={post.isPublished ? "default" : "secondary"}>
                {post.isPublished ? "منتشرشده" : "پیش‌نویس"}
              </Badge>
            </TableCell>
            <TableCell className="flex gap-1">
              <BlogFormDialog post={post} />
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}