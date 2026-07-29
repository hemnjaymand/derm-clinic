import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export type UploadResult =
  | { success: true; url: string; key: string }
  | { success: false; error: string };

interface StorageProvider {
  upload(params: {
    buffer: Buffer;
    fileName: string;
    contentType: string;
    folder: string;
  }): Promise<UploadResult>;
  delete(key: string): Promise<{ success: boolean }>;
}

class S3CompatibleStorage implements StorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: "default",
      endpoint: env.STORAGE_ENDPOINT!,
      credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY!,
        secretAccessKey: env.STORAGE_SECRET_KEY!,
      },
      forcePathStyle: true,
    });
  }

  async upload({ buffer, fileName, contentType, folder }: {
    buffer: Buffer; fileName: string; contentType: string; folder: string;
  }): Promise<UploadResult> {
    try {
      const key = `${folder}/${Date.now()}-${sanitizeFileName(fileName)}`;
      await this.client.send(
        new PutObjectCommand({
          Bucket: env.STORAGE_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ACL: "public-read",
        })
      );
      const url = `${env.STORAGE_ENDPOINT}/${env.STORAGE_BUCKET_NAME}/${key}`;
      return { success: true, url, key };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "خطا در آپلود فایل" };
    }
  }

  async delete(key: string): Promise<{ success: boolean }> {
    try {
      await this.client.send(new DeleteObjectCommand({ Bucket: env.STORAGE_BUCKET_NAME!, Key: key }));
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}

/**
 * از Service Role Key استفاده می‌کند (نه Publishable/Anon Key) چون این کد فقط در سرور
 * (Route Handler) اجرا می‌شود و نیازی به Session کاربر یا Cookie ندارد؛
 * Service Role به RLS پایبند نیست، پس Upload همیشه کار می‌کند حتی اگر Bucket Policy محدود باشد.
 */
class SupabaseStorageProvider implements StorageProvider {
  private client = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

  async upload({ buffer, fileName, contentType, folder }: {
    buffer: Buffer; fileName: string; contentType: string; folder: string;
  }): Promise<UploadResult> {
    try {
      const key = `${folder}/${Date.now()}-${sanitizeFileName(fileName)}`;
      const bucket = env.STORAGE_BUCKET_NAME!;

      const { error } = await this.client.storage.from(bucket).upload(key, buffer, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data } = this.client.storage.from(bucket).getPublicUrl(key);
      return { success: true, url: data.publicUrl, key };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "خطا در آپلود فایل به Supabase",
      };
    }
  }

  async delete(key: string): Promise<{ success: boolean }> {
    try {
      await this.client.storage.from(env.STORAGE_BUCKET_NAME!).remove([key]);
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

export function extractKeyFromUrl(url: string): string {
  if (env.STORAGE_PROVIDER === "supabase") {
    const prefix = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${env.STORAGE_BUCKET_NAME}/`;
    return url.replace(prefix, "");
  }
  const prefix = `${env.STORAGE_ENDPOINT}/${env.STORAGE_BUCKET_NAME}/`;
  return url.replace(prefix, "");
}

let instance: StorageProvider | undefined;

export function getStorageProvider(): StorageProvider {
  if (!instance) {
    instance = env.STORAGE_PROVIDER === "supabase" ? new SupabaseStorageProvider() : new S3CompatibleStorage();
  }
  return instance;
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;