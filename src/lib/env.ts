import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .default("postgresql://postgres:postgres@localhost:5432/postgres"),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters")
    .default("development-auth-secret-32-chars-long-value"),
  CRON_SECRET: z
    .string()
    .min(16, "CRON_SECRET must be at least 16 characters")
    .default("development-cron-secret"),
  SMS_PROVIDER: z.string().min(1).default("kavenegar"),
  SMS_API_KEY: z.string().min(1).default("development-sms-api-key"),
  SMS_SENDER_NUMBER: z.string().min(1).default("10008663"),

  STORAGE_ACCESS_KEY: z.string().min(1).default("development-access-key"),
  STORAGE_SECRET_KEY: z.string().min(1).default("development-secret-key"),
  STORAGE_ENDPOINT: z.string().url().default("https://s3.amazonaws.com"),
  STORAGE_PROVIDER: z.enum(["local", "arvan", "liara", "supabase"]).default("local"),
  STORAGE_BUCKET_NAME: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ متغیرهای محیطی نامعتبر:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables. بررسی فایل .env کنید.");
}

export const env = parsed.data;
