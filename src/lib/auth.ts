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
  trustHost: true,  
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        phone: { label: "شماره موبایل" },
        password: { label: "رمز عبور", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const admin = await prisma.admin.findUnique({
          where: { phone: parsed.data.phone },
        });
        if (!admin) return null;

        const isValidPassword = await bcrypt.compare(
          parsed.data.password,
          admin.passwordHash,
        );
        if (!isValidPassword) return null;

        // برگرداندن شیء با تمام فیلدهای مورد نیاز
        return {
          id: admin.id,
          name: admin.name,
          phone: admin.phone,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    session({ session, token }) {
      // حالا TypeScript می‌داند که این فیلدها وجود دارند
      session.user.id = token.id as string;
      session.user.phone = token.phone as string;
      return session;
    },
  },
});
