import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">۴۰۴</h1>
      <p className="text-xl text-muted-foreground">صفحه مورد نظر یافت نشد</p>
      <Button asChild>
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </Button>
    </div>
  );
}
