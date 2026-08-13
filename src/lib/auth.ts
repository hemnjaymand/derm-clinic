// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "../features/auth/schemas/login.schema";
import { prisma } from "./prisma";

// ============================
//  گسترش تایپ‌های NextAuth
// ============================
declare module "next-auth" {
  interface User {
    id: string;
    phone: string;
  }

  interface Session {
    user: {
      id: string;
      phone: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// ============================
//  کانفیگ اصلی
// ============================
export const { handlers, auth, signIn, signOut } = NextAuth({
  // ===== امنیت و کوکی =====
  trustHost: true,

  // ===== دیباگ (فقط در محیط توسعه) =====
  debug: process.env.NODE_ENV === "development",

  // ===== استراتژی نشست =====
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // ۳۰ روز
  },

  // ===== صفحات =====
  pages: {
    signIn: "/login",
    error: "/login", // در صورت خطا به لاگین برگرد
  },

  // ===== ارائه‌دهندگان =====
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // اعتبارسنجی ورودی
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) {
            console.error("❌ خطای اعتبارسنجی ورودی:", parsed.error.flatten());
            return null;
          }

          // جستجوی ادمین در دیتابیس
          const admin = await prisma.admin.findUnique({
            where: { phone: parsed.data.phone },
          });

          if (!admin) {
            console.warn(`⚠️ ادمین با شماره ${parsed.data.phone} یافت نشد`);
            return null;
          }

          // بررسی رمز عبور
          const isValidPassword = await bcrypt.compare(
            parsed.data.password,
            admin.passwordHash,
          );

          if (!isValidPassword) {
            console.warn(
              `⚠️ رمز عبور برای شماره ${parsed.data.phone} اشتباه است`,
            );
            return null;
          }

          // موفقیت
          console.log(`✅ ورود موفق برای ادمین: ${admin.phone}`);
          return {
            id: admin.id,
            name: admin.name,
            phone: admin.phone,
          };
        } catch (error) {
          console.error("❌ خطا در authorize:", error);
          return null;
        }
      },
    }),
  ],

  // ===== کالبک‌ها =====
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },

    // ===== ریدایرکت بعد از لاگین (اختیاری) =====
    async redirect({ url, baseUrl }) {
      // اگر callbackUrl وجود دارد، به آن برو
      if (url.startsWith(baseUrl)) return url;
      // در غیر این صورت به داشبورد برو
      return `${baseUrl}/dashboard`;
    },
  },
});
