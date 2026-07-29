import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold">
          ورود به پنل مدیریت
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}