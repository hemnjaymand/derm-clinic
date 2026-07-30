import Link from "next/link";
import Image from "next/image";
import { PUBLIC_NAV_ITEMS, PUBLIC_ROUTES } from "@/constants/routes";
import { Button } from "../ui/button";
import { MobileNav, UserNav } from "../layout";
import Logo1 from "../../../public/images/L O G O-new color-01.png";

import { logoutAction } from "@/features/auth/actions/login.action";
import { auth } from "@/lib/auth";

export async function Header() {
  // گرفتن اطلاعات کاربر لاگین شده
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const adminName = session?.user?.name || "کاربر";
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* ===== سمت چپ: لوگو + (در موبایل) دکمه همبرگر ===== */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* دکمه همبرگر (فقط در موبایل) */}
          

          <Link href={PUBLIC_ROUTES.home} className="flex items-center gap-2">
            <Image
              src={Logo1}
              alt="Logo"
              width={32}
              height={32}
              className="h-12 w-12 rounded-full"
            />
          </Link>
        </div>

        {/* ===== وسط: ناوبری اصلی (فقط در دسکتاپ) ===== */}
        <nav className="hidden md:flex items-center gap-6">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ===== سمت راست: دکمه رزرو نوبت + UserNav ===== */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            asChild
            variant="default"
            size="sm"
            className="whitespace-nowrap"
          >
            <Link href={PUBLIC_ROUTES.appointment}>رزرو نوبت</Link>
          </Button>
          <UserNav
            adminName={adminName}
            isAuthenticated={isAuthenticated}
            logoutAction={logoutAction}
          />
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
