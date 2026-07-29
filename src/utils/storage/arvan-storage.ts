// src/lib/storage/arvan-storage.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { StorageProvider } from './types';

export class ArvanStorage implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private endpoint: string;

  constructor() {
    this.endpoint = process.env.ARVAN_ENDPOINT!;
    this.bucket = process.env.ARVAN_BUCKET!;
    const accessKey = process.env.ARVAN_ACCESS_KEY!;
    const secretKey = process.env.ARVAN_SECRET_KEY!;

    this.client = new S3Client({
      endpoint: this.endpoint,
      region: 'us-east-1',
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      forcePathStyle: true,
    });
  }

  // متد جدید upload با امضای مورد نظر
  async upload({
    buffer,
    fileName,
    contentType,
    folder,
  }: {
    buffer: Buffer;
    fileName: string;
    contentType: string;
    folder: string;
  }): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const ext = fileName.split('.').pop();
      const key = `${folder}/${Date.now()}.${ext}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read',
      });

      await this.client.send(command);
      const url = `${this.endpoint}/${this.bucket}/${key}`;
      return { success: true, url };
    } catch (error) {
      console.error('ArvanStorage upload error:', error);
      return { success: false, error: 'خطا در آپلود به آروان' };
    }
  }

  // متدهای قدیمی (در صورت نیاز)
  async uploadFile(file: File, filePath: string): Promise<{ url: string; key: string }> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    });
    await this.client.send(command);
    return { url: `${this.endpoint}/${this.bucket}/${filePath}`, key: filePath };
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
    await this.client.send(command);
  }

  getFileUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${key}`;
  }
}