import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
// import { DashboardHeader } from "@/components/layout/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // const adminName = session.user.name || session.user.email || "Admin";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* <DashboardHeader adminName={adminName} /> */}
      <main className="flex-1 p-4 lg:p-6">{children}</main>
    </div>
  );
}
