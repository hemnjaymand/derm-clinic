
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStorageProvider, ALLOWED_MEDIA_TYPES, getMaxSizeForType } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "احراز هویت لازم است" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "misc";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایلی ارسال نشده است" }, { status: 400 });
    }

    if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${ALLOWED_MEDIA_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const maxSize = getMaxSizeForType(file.type);
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `حجم فایل نباید بیشتر از ${maxSizeMB} مگابایت باشد.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await getStorageProvider().upload({
      buffer,
      fileName: file.name,
      contentType: file.type,
      folder,
    });

    if (!result.success) {
      console.error("[UPLOAD]", result.error);
      return NextResponse.json({ error: result.error ?? "خطا در آپلود فایل" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: result.url, key: result.key });
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}