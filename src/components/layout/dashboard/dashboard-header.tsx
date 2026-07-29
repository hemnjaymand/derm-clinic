"use client";

import Link from "next/link";
// import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { MobileNav } from "../mobile-nav";
import { UserNav } from "../user-nav";
import { DashboardNav } from "./dashboard-nav";
import { logoutAction } from "@/features/auth/actions/login.action";

interface HeaderProps {
  adminName: string;
}

export function DashboardHeader({ adminName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4 lg:px-6">
      {/* Right side: Logo + Mobile Nav */}
      <div className="flex items-center gap-2 lg:gap-4">
        <MobileNav />
        <Link
          href="/dashboard"
          className="text-lg font-bold text-primary lg:text-xl"
        >
          Dr.Aso Clinic
        </Link>
      </div>

      {/* Center: Horizontal Navigation (lg+) */}
      <div className="hidden lg:flex flex-1 justify-center">
        <DashboardNav />
      </div>

      {/* Left side: Book Appointment + User Nav */}
      <div className="flex items-center gap-2 lg:gap-3 mr-auto">
        {/* <Button variant="outline" size="sm" asChild>
          <Link href="/appointment" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">نوبت‌دهی</span>
          </Link>
        </Button> */}
        <UserNav
          adminName={adminName}
          isAuthenticated={true}
          logoutAction={logoutAction}
        />
      </div>
    </header>
  );
}
