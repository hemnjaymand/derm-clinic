import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fa" dir="rtl" className="font-sans">
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
