/**
 * hooks/useCloudinaryUpload.ts — Hook for Cloudinary Image Uploads
 *
 * Provides methods to upload images directly to Cloudinary using a signed token.
 * Images are uploaded client-side to Cloudinary without going through our server.
 *
 * Usage:
 *   const { uploadImage, isUploading, uploadProgress } = useCloudinaryUpload();
 *   const url = await uploadImage(file);
 */

import { useState } from "react";

interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  folder: string;
  apiKey: string;
}

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getUploadSignature = async (): Promise<UploadSignature> => {
    const response = await fetch("/api/farmer/upload-signature");
    if (!response.ok) {
      throw new Error("Failed to get upload signature");
    }
    return response.json();
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate file
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw new Error("Only JPEG, PNG, and WebP images are allowed");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      // Get upload signature from our backend
      const signature = await getUploadSignature();

      // Create form data for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature.signature);
      formData.append("timestamp", signature.timestamp.toString());
      formData.append("api_key", signature.apiKey);
      formData.append("folder", signature.folder);

      // Upload directly to Cloudinary
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      return new Promise((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setUploadProgress(100);
            setIsUploading(false);
            resolve(response.secure_url);
          } else {
            const errorMsg = `Upload failed with status ${xhr.status}`;
            setError(errorMsg);
            setIsUploading(false);
            reject(new Error(errorMsg));
          }
        });

        xhr.addEventListener("error", () => {
          const errorMsg = "Upload failed due to network error";
          setError(errorMsg);
          setIsUploading(false);
          reject(new Error(errorMsg));
        });

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`
        );
        xhr.send(formData);
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown upload error";
      setError(errorMsg);
      setIsUploading(false);
      throw err;
    }
  };

  const uploadMultiple = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      urls.push(url);
    }
    return urls;
  };

  return {
    uploadImage,
    uploadMultiple,
    isUploading,
    uploadProgress,
    error,
  };
}
