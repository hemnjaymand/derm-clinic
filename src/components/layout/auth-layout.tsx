interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Drem Clinic</h1>
          <p className="text-sm text-muted-foreground">ورود / ثبت‌نام</p>
        </div>
        {children}
      </div>
    </div>
  )
}