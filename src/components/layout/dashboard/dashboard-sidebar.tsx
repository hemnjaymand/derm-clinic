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
  type LucideIcon,
} from "lucide-react";
import { DASHBOARD_NAV_ITEMS } from "@/constants/routes";
import { cn } from "@/lib/utils";


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
};

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-l bg-muted/20 md:block">
      <div className="p-4">
        <span className="text-lg font-bold">Drem Clinic</span>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}