import { getBlogPosts } from "@/features/blog/actions/blog.actions";
import { BlogTable } from "@/features/blog/components/blog-table";
import { BlogFormDialog } from "@/features/blog/components/blog-form-dialog";

export default async function DashboardBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">مقالات</h1>
        <BlogFormDialog />
      </div>
      <BlogTable posts={posts} />
    </div>
  );
}