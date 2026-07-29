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

interface DashboardNavProps {
  variant?: "horizontal" | "vertical";
  onItemClick?: () => void;
}

export function DashboardNav({
  variant = "horizontal",
  onItemClick,
}: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        variant === "horizontal"
          ? "flex-row items-center gap-1"
          : "flex-col gap-1",
        "flex",
      )}
    >
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
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? variant === "horizontal"
                  ? "text-primary"
                  : "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {variant === "vertical" && <Icon className="h-4 w-4 shrink-0" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
