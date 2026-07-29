import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Drem Clinic - مرکز درمانی",
  description: "سیستم مدیریت کلینیک Drem",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="font-sans">
      <body className="min-h-screen bg-background antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
