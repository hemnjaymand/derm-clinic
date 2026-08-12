// import type { NextApiRequest, NextApiResponse } from "next";

// import formidable, {
//   type Fields,
//   type Files,
//   type File as FormidableFile,
// } from "formidable";

// import fs from "node:fs/promises";

// import { auth } from "@/lib/auth";

// import {
//   getStorageProvider,
//   ALLOWED_IMAGE_TYPES,
//   MAX_UPLOAD_SIZE_BYTES,
// } from "@/lib/storage";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// type SuccessResponse = {
//   success: true;
//   url: string;
//   key: string;
// };

// type ErrorResponse = {
//   success?: false;
//   error: string;
// };

// type ResponseData = SuccessResponse | ErrorResponse;

// /**
//  * Parse multipart/form-data request.
//  */
// function parseForm(req: NextApiRequest): Promise<{
//   file: FormidableFile;
//   folder: string;
// }> {
//   return new Promise((resolve, reject) => {
//     const form = formidable({
//       multiples: false,
//       maxFiles: 1,
//       maxFileSize: MAX_UPLOAD_SIZE_BYTES,
//       keepExtensions: true,
//     });

//     form.parse(req, (error: Error | null, fields: Fields, files: Files) => {
//       if (error) {
//         reject(error);
//         return;
//       }

//       const rawFile = files.file;

//       const uploadedFile = Array.isArray(rawFile) ? rawFile[0] : rawFile;

//       if (!uploadedFile) {
//         reject(new Error("فایلی ارسال نشده است"));
//         return;
//       }

//       const rawFolder = fields.folder;

//       const folderValue = Array.isArray(rawFolder) ? rawFolder[0] : rawFolder;

//       const folder =
//         typeof folderValue === "string" && folderValue.trim().length > 0
//           ? folderValue.trim()
//           : "services/icons";

//       resolve({
//         file: uploadedFile,
//         folder,
//       });
//     });
//   });
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>,
// ) {
//   /**
//    * فقط POST مجاز است.
//    */
//   if (req.method !== "POST") {
//     res.setHeader("Allow", "POST");

//     return res.status(405).json({
//       success: false,
//       error: "Method Not Allowed",
//     });
//   }

//   try {
//     /**
//      * Authentication
//      */
//     const session = await auth();

//     if (!session?.user) {
//       return res.status(401).json({
//         success: false,
//         error: "احراز هویت لازم است",
//       });
//     }

//     /**
//      * Parse multipart form
//      */
//     const { file, folder } = await parseForm(req);

//     /**
//      * Content type
//      */
//     const contentType = file.mimetype ?? "";

//     if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
//       return res.status(400).json({
//         success: false,
//         error:
//           `فرمت فایل مجاز نیست. ` +
//           `فرمت‌های مجاز: ` +
//           `${ALLOWED_IMAGE_TYPES.join(", ")}`,
//       });
//     }

//     /**
//      * File size
//      */
//     if (typeof file.size === "number" && file.size > MAX_UPLOAD_SIZE_BYTES) {
//       const maxSizeMB = MAX_UPLOAD_SIZE_BYTES / (1024 * 1024);

//       return res.status(400).json({
//         success: false,
//         error: `حجم فایل نباید بیشتر از ` + `${maxSizeMB} مگابایت باشد.`,
//       });
//     }

//     /**
//      * Read temporary file
//      */
//     const buffer = await fs.readFile(file.filepath);

//     /**
//      * Storage provider
//      */
//     const storage = getStorageProvider();

//     /**
//      * Upload to Storage
//      */
//     const result = await storage.upload({
//       buffer,

//       fileName: file.originalFilename ?? "service-icon",

//       contentType,

//       folder,
//     });

//     /**
//      * Storage error
//      */
//     if (!result.success) {
//       console.error("[SERVICE ICON STORAGE ERROR]", result.error);

//       return res.status(500).json({
//         success: false,
//         error: result.error ?? "خطا در آپلود فایل",
//       });
//     }

//     /**
//      * Cleanup formidable temp file
//      */
//     try {
//       await fs.unlink(file.filepath);
//     } catch (cleanupError) {
//       console.warn("[SERVICE ICON CLEANUP WARNING]", cleanupError);
//     }

//     /**
//      * Success
//      */
//     return res.status(200).json({
//       success: true,
//       url: result.url,
//       key: result.key,
//     });
//   } catch (error) {
//     console.error("[SERVICE ICON API ERROR]", error);

//     /**
//      * Formidable file-size error
//      */
//     if (
//       error &&
//       typeof error === "object" &&
//       "code" in error &&
//       error.code === "LIMIT_FILE_SIZE"
//     ) {
//       const maxSizeMB = MAX_UPLOAD_SIZE_BYTES / (1024 * 1024);

//       return res.status(400).json({
//         success: false,
//         error: `حجم فایل نباید بیشتر از ` + `${maxSizeMB} مگابایت باشد.`,
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       error: error instanceof Error ? error.message : "خطای داخلی سرور",
//     });
//   }
// }


import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStorageProvider, ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE_BYTES } from "@/lib/storage";

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

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${ALLOWED_IMAGE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      const maxSizeMB = Math.round(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024));
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