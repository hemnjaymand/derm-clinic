/** تولید Slug ساده و یکتا از عنوان فارسی/انگلیسی خدمت */
export function slugify(title: string): string {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "") // حذف کاراکترهای غیرمجاز (فارسی/لاتین/عدد مجازن)
      .replace(/\s+/g, "-")
      .slice(0, 60) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}