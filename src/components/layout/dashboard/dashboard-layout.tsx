'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Image,
  FileText,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

const navItems = [
  { href: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'نوبت‌ها', icon: Calendar },
  { href: '/dashboard/patients', label: 'بیماران', icon: Users },
  { href: '/dashboard/services', label: 'خدمات', icon: Stethoscope },
  { href: '/dashboard/gallery', label: 'گالری', icon: Image },
  { href: '/dashboard/blog', label: 'بلاگ', icon: FileText },
  { href: '/dashboard/working-hours', label: 'ساعات کاری', icon: Clock },
  { href: '/dashboard/settings', label: 'تنظیمات', icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* نوار کناری (دسکتاپ) */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            Drem Clinic
          </Link>
        </div>
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
        </div>
      </aside>

      {/* هدر موبایل و منوی همبرگری */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            Drem Clinic
          </Link>
        </header>

        {/* منوی موبایل (overlay) */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsMobileOpen(false)}
            />
            <aside className="relative flex w-72 flex-col bg-background shadow-lg">
              <div className="flex h-16 items-center justify-between border-b px-6">
                <span className="text-xl font-bold text-primary">Drem Clinic</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 px-4 py-4">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </ScrollArea>
              <div className="border-t p-4">
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                  <LogOut className="h-4 w-4" />
                  خروج
                </Button>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}