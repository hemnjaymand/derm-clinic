// src/lib/storage.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getStorageProvider,
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
} from "@/lib/storage";

export async function POST(request: Request) {
  try {
    // ۱. بررسی احراز هویت
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "احراز هویت لازم است" },
        { status: 401 },
      );
    }

    // ۲. دریافت داده‌های فرم
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "misc";

    // ۳. اعتبارسنجی فایل
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "فایلی ارسال نشده است" },
        { status: 400 },
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      const maxSizeMB = Math.round(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024));
      return NextResponse.json(
        { error: `حجم فایل نباید بیشتر از ${maxSizeMB} مگابایت باشد.` },
        { status: 400 },
      );
    }

    // ۴. تبدیل به Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ۵. آپلود با استفاده از Storage Provider
    const storage = getStorageProvider();
    const result = await storage.upload({
      buffer,
      fileName: file.name,
      contentType: file.type,
      folder,
    });

    // ۶. بررسی نتیجه آپلود
    if (!result.success) {
      console.error("Upload failed:", result.error);
      return NextResponse.json(
        { error: result.error || "خطا در آپلود فایل" },
        { status: 500 },
      );
    }

    // ۷. بازگشت آدرس فایل
    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    console.error("Unexpected error in upload API:", error);
    return NextResponse.json(
      { error: "خطای داخلی سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
