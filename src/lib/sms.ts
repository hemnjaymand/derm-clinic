
import { env } from "@/lib/env";

export type SendSmsResult =
  | { success: true; providerMessageId: string }
  | { success: false; error: string };

/** Interface مشترک — هر Provider ایرانی باید همین قرارداد رو پیاده کنه */
interface SmsProvider {
  name: string;
  send(phone: string, text: string): Promise<SendSmsResult>;
}

class KavenegarProvider implements SmsProvider {
  name = "kavenegar";

  async send(phone: string, text: string): Promise<SendSmsResult> {
    try {
      const url = `https://api.kavenegar.com/v1/${env.SMS_API_KEY}/sms/send.json`;
      const params = new URLSearchParams({
        receptor: phone,
        sender: env.SMS_SENDER_NUMBER,
        message: text,
      });

      const response = await fetch(`${url}?${params.toString()}`, { method: "POST" });
      const data = await response.json();

      if (!response.ok || data?.return?.status !== 200) {
        return {
          success: false,
          error: data?.return?.message ?? "خطای نامشخص از سرویس پیامک",
        };
      }

      return {
        success: true,
        providerMessageId: String(data.entries?.[0]?.messageid ?? ""),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "خطا در اتصال به سرویس پیامک",
      };
    }
  }
}

// نقطه‌ی تعویض Provider در آینده — فقط همین‌جا و بدون تغییر جای دیگری از پروژه
const PROVIDERS: Record<string, SmsProvider> = {
  kavenegar: new KavenegarProvider(),
};

export function getSmsProvider(): SmsProvider {
  const provider = PROVIDERS[env.SMS_PROVIDER];
  if (!provider) {
    throw new Error(`SMS provider "${env.SMS_PROVIDER}" پشتیبانی نمی‌شود`);
  }
  return provider;
}