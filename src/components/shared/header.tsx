import Link from "next/link";
import Image from "next/image";
import { PUBLIC_NAV_ITEMS, PUBLIC_ROUTES } from "@/constants/routes";
import { Button } from "../ui/button";
import { MobileNav, UserNav } from "../layout";
import Logo1 from "../../../public/images/logo/L O G O-new color-01.png";

import { logoutAction } from "@/features/auth/actions/login.action";
import { auth } from "@/lib/auth";

export async function Header() {
  // گرفتن اطلاعات جلسه کاربر
  const session = await auth();
  const user = session?.user;
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* ===== سمت راست (در RTL): لوگو ===== */}
        <div className="flex items-center gap-3">
          <Link 
            href={PUBLIC_ROUTES.home} 
            className="flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/20 shadow-sm">
              <Image
                src={Logo1}
                alt="Logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
          </Link>
        </div>

        {/* ===== وسط: ناوبری اصلی (فقط دسکتاپ) ===== */}
        <nav className="hidden md:flex items-center gap-8">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ===== سمت چپ (در RTL): دکمه رزرو + پروفایل کاربر + منوی موبایل ===== */}
        <div className="flex items-center gap-2.5 md:gap-4">
          <Button
            asChild
            variant="default"
            size="sm"
            className="rounded-full px-5 font-medium shadow-md shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30"
          >
            <Link href={PUBLIC_ROUTES.appointment}>رزرو نوبت</Link>
          </Button>

          {/*  پاس دادن کامل شیء user جهت بررسی نقش ADMIN در دراپ‌داون */}
          <UserNav
         
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