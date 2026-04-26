/**
 * lib/utils/imageUpload.ts — Cloudinary Image Upload Utility
 *
 * Handles server-side validation and client-side upload signatures.
 * For client-side direct uploads to Cloudinary without hitting the server first.
 */

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_FOLDER = "fresh-direct/products";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates file size and type for image uploads
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validMimes = ["image/jpeg", "image/png", "image/webp"];

  if (!validMimes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  return { valid: true };
}

/**
 * Generates a signature for client-side Cloudinary uploads.
 * This allows the frontend to upload directly to Cloudinary without hitting our backend for each file.
 *
 * Usage:
 *   1. Frontend calls GET /api/farmer/upload-signature
 *   2. Gets back { signature, timestamp, cloudName, folder, apiKey }
 *   3. Frontend uses these to upload directly to Cloudinary
 */
export function generateUploadSignature() {
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      folder: CLOUDINARY_FOLDER,
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    folder: CLOUDINARY_FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
  };
}

/**
 * Server-side image upload (fallback if client upload fails)
 * Accepts FormData with 'file' field and uploads to Cloudinary.
 */
export async function uploadImageToCloudinary(
  file: File
): Promise<{ url: string; publicId: string }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          resource_type: "auto",
          quality: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(bytes);
    });

    return {
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    };
  } catch (error) {
    throw new Error(
      `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Deletes an image from Cloudinary by public ID
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(
      `Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
