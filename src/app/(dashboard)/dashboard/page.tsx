import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // تعیین بازه زمانی امروز
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  // تعیین بازه زمانی ماه جاری
  const startOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
  const endOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 1);

  // شماره روز هفته جاری (0 تا 6)
  const dayOfWeekIndex = todayStart.getDay();

  // اجرای همزمان کوئری‌ها برای بهینه‌سازی سرعت
  const [
    todaysAppointmentsCount,
    totalPatientsCount,
    workingHoursToday,
    monthlyAppointments,
    recentAppointments,
  ] = await Promise.all([
    // ۱. تعداد نوبت‌های امروز
    prisma.appointment.count({
      where: {
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    }),
    // ۲. تعداد کل بیماران
    prisma.patient.count(),
    // ۳. ساعات کاری امروز
    prisma.workingHours.findUnique({
      where: { dayOfWeek: dayOfWeekIndex },
    }),
    // ۴. نوبت‌های ماه جاری (برای محاسبه درآمد)
    prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
        status: { notIn: ["CANCELLED", "NOSHOW"] },
      },
      include: { service: true },
    }),
    // ۵. نوبت‌های اخیر
    prisma.appointment.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { patient: true, service: true },
    }),
  ]);

  // محاسبه کل درآمد ماهانه بر اساس قیمت خدمات نوبت‌های ثبت‌شده
  const monthlyRevenue = monthlyAppointments.reduce((sum, app) => {
    return sum + (app.service?.price ?? 0);
  }, 0);

  // تنظیم متن ساعات کاری
  const workingHoursText = workingHoursToday?.isOpen
    ? `${workingHoursToday.openTime} تا ${workingHoursToday.closeTime}`
    : "امروز تعطیل است";

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">داشبورد مدیریت</h1>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-border/40 bg-card/35 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">نوبت‌های امروز</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{todaysAppointmentsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">ثبت شده برای امروز</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/40 bg-card/35 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">تعداد بیماران</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalPatientsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">کل بیماران ثبت‌شده</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/40 bg-card/35 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ساعات کاری امروز</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workingHoursToday?.isOpen ? "فعال" : "تعطیل"}</div>
            <p className="text-xs text-muted-foreground mt-1">{workingHoursText}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/40 bg-card/35 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">درآمد ماهانه</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {monthlyRevenue.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>
      </div>

      {/* بخش پایینی: نوبت‌های اخیر و دسترسی سریع */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl border border-border/40 bg-card/35 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">نوبت‌های اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  هنوز نوبتی ثبت نشده است.
                </p>
              ) : (
                recentAppointments.map((app) => (
                  <div key={app.id} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-foreground">
                        {app.patient ? `${app.patient.firstName} ${app.patient.lastName}` : "بیمار ناشناس"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                        {app.startTime} - {app.service?.title ?? "خدمت"}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-xl ${
                        app.status === "CONFIRMED" || app.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : app.status === "PENDING"
                          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {app.status === "PENDING"
                        ? "در انتظار"
                        : app.status === "CONFIRMED"
                        ? "تأیید شده"
                        : app.status === "COMPLETED"
                        ? "انجام شده"
                        : "لغو شده"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/40 bg-card/35 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" className="w-full justify-start rounded-xl border-border/40 bg-card/50 hover:bg-muted/50 transition-all" asChild>
              <Link href="/dashboard/appointments">مدیریت نوبت‌ها</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl border-border/40 bg-card/50 hover:bg-muted/50 transition-all" asChild>
              <Link href="/dashboard/patients">مدیریت بیماران</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl border-border/40 bg-card/50 hover:bg-muted/50 transition-all" asChild>
              <Link href="/dashboard/services">مدیریت خدمات</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl border-border/40 bg-card/50 hover:bg-muted/50 transition-all" asChild>
              <Link href="/dashboard/settings">تنظیمات</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}