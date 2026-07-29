// src/lib/storage/local-storage.ts
import fs from "fs/promises";
import path from "path";
import { StorageProvider } from "./types";

export class LocalStorage implements StorageProvider {
  private basePath: string;

  constructor() {
    this.basePath = path.join(process.cwd(), "public/uploads");
    fs.mkdir(this.basePath, { recursive: true });
  }

  // متد جدید upload با امضای مورد نظر
  async upload({
    buffer,
    fileName,
    folder,
  }: {
    buffer: Buffer;
    fileName: string;
    contentType?: string;
    folder: string;
  }): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const ext = path.extname(fileName);
      const baseName = path.basename(fileName, ext);
      const safeName = `${baseName}-${Date.now()}${ext}`;
      const filePath = `${folder}/${safeName}`;
      const fullPath = path.join(this.basePath, filePath);

      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, buffer);

      const url = `/uploads/${filePath}`;
      return { success: true, url };
    } catch (error) {
      console.error("LocalStorage upload error:", error);
      return { success: false, error: "خطا در ذخیره فایل" };
    }
  }

  // متدهای قدیمی (در صورت نیاز)
  async uploadFile(
    file: File,
    filePath: string,
  ): Promise<{ url: string; key: string }> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fullPath = path.join(this.basePath, filePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, buffer);
    return { url: `/uploads/${filePath}`, key: filePath };
  }

  async deleteFile(key: string): Promise<void> {
    const fullPath = path.join(this.basePath, key);
    await fs.unlink(fullPath).catch(() => {});
  }

  getFileUrl(key: string): string {
    return `/uploads/${key}`;
  }
}
