"use client";

import { useTransition } from "react";
import Link from "next/link";
import { LogOut, LogIn, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserNavProps {
  adminName?: string | null;
  isAuthenticated: boolean;
  // نوع تابع به Promise تغییر کرد تا با سرور اکشن هماهنگ شود
  logoutAction: () => Promise<void>; 
}

export function UserNav({ adminName, isAuthenticated, logoutAction }: UserNavProps) {
  // استفاده از useTransition برای مدیریت وضعیت لودینگ خروج
  const [isPending, startTransition] = useTransition();

  const initials = adminName ? adminName.slice(0, 1).toUpperCase() : "";

  // تابع هندل کردن کلیک خروج
  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-auto items-center gap-3 px-2 py-1.5 hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary"
        >
          <Avatar className="h-9 w-9 border border-border shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {isAuthenticated && adminName ? initials : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          
          {isAuthenticated && adminName && (
            <div className="hidden flex-col items-start sm:flex text-right">
              <span className="text-sm font-medium text-foreground leading-none">
                {adminName}
              </span>
              <span className="text-xs text-muted-foreground mt-1.5">
                مدیر سیستم
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" >
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-foreground leading-none">
                  {adminName}
                </p>
                <p className="text-xs text-muted-foreground leading-none">
                  خوش آمدید
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              disabled={isPending}
              onClick={handleLogout}
              className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive data-disabled:opacity-50"
            >
              {/* اگر در حال خروج بودیم آیکون لودینگ بچرخد، در غیر این صورت آیکون خروج */}
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span className="font-medium">
                {isPending ? "در حال خروج..." : "خروج از حساب"}
              </span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link 
              href="/login" 
              className="cursor-pointer gap-2 focus:bg-primary/10 focus:text-primary font-medium"
            >
              <LogIn className="h-4 w-4" />
              <span>ورود به حساب کاربری</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}