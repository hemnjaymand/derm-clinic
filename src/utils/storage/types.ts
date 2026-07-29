// src/lib/storage/types.ts
export interface StorageProvider {
  // متد جدید برای سازگاری با Route Handler شما
  upload(params: {
    buffer: Buffer;
    fileName: string;
    contentType: string;
    folder: string;
  }): Promise<{ success: boolean; url?: string; error?: string }>;

  // متدهای قبلی (اختیاری)
  uploadFile(file: File, filePath: string): Promise<{ url: string; key: string }>;
  deleteFile(key: string): Promise<void>;
  getFileUrl(key: string): string;
}