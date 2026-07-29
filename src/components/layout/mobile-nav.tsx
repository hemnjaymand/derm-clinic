"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// جایگزین کردن DashboardNav با MainNav
import { MainNav } from "./main-nav"; 

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" dir="rtl" className="w-72">
        <div className="mb-6 mt-4 flex items-center justify-end px-2">
          <span className="text-lg font-bold">Dr.Aso Clinic</span>
        </div>
        
        {/* استفاده از کامپوننت هوشمندی که نوشتیم */}
        <MainNav onItemClick={() => setOpen(false)} />
        
      </SheetContent>
    </Sheet>
  );
}