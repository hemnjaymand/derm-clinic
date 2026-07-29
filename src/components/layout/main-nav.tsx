"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Stethoscope,
  Image as ImageIcon,
  Newspaper,
  Clock,
  CalendarOff,
  Settings,
  Home,
  Info,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS, PUBLIC_NAV_ITEMS } from "@/constants/routes";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Stethoscope,
  Image: ImageIcon,
  Newspaper,
  Clock,
  CalendarOff,
  Settings,
  Home,
  Info,
  Phone,
};

interface MainNavProps {
  className?: string;
  onItemClick?: () => void; // اضافه شده برای بسته شدن منو در موبایل
}

export function MainNav({ className, onItemClick }: MainNavProps) {
  const pathname = usePathname();

  // تشخیص اینکه کاربر در دشبورد است یا سایت عمومی
  const isDashboard = pathname.startsWith("/dashboard");

  // انتخاب لیست منو بر اساس مکان کاربر
  const items = isDashboard ? DASHBOARD_NAV_ITEMS : PUBLIC_NAV_ITEMS;

  return (
    <nav className={cn("flex flex-col gap-1", className)} dir="rtl">
      {items.map((item) => {
        const Icon = ICONS[item.icon] || (isDashboard ? LayoutDashboard : Home);

        const isActive =
          item.href === "/dashboard" || item.href === "/"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick} // فراخوانی تابع هنگام کلیک روی لینک
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}