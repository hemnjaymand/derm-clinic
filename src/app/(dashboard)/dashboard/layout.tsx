import { DashboardHeader } from "@/components/layout/dashboard/dashboard-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // لایه دوم محافظت — middleware.ts خط اول دفاعه؛ این‌جا هم برای اطمینان و گرفتن اطلاعات ادمین
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      {/* <DashboardHeader adminName={session.user.name ?? "admin"} /> */}
      <DashboardHeader adminName={session.user.name ?? "admin"} />
      <main className="flex-1 bg-muted/10 p-6">{children}</main>
    </div>
  );
}
