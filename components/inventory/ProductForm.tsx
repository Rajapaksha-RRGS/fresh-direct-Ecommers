/**
 * components/inventory/ProductForm.tsx — Add New Product with Image Upload
 *
 * Form for farmers to add new products with:
 *  - Product details (name, category, description, price, quantity)
 *  - Multiple image uploads to Cloudinary
 *  - Real-time validation
 *  - Verification status check (disable if PENDING)
 */

"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle2, Loader2, PlusCircle, X } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmerProducts } from "@/hooks/useFarmerProducts";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

const T = {
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  success: "#3E7B27",
  textDark: "#1A3020",
  textMid: "#3D5C42",
  textLight: "#6B8F6E",
  bg: "#F0F7F0",
} as const;

const CATEGORIES = ["vegetables", "fruits", "herbs", "grains", "other"];

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  unit: string;
  basePrice: string;
  stockQty: string;
  images: string[];
  tags: string;
}

export default function ProductForm() {
  const { profile, isLoading: profileLoading } = useFarmerProfile();
  const { addProduct, isLoading: productLoading } = useFarmerProducts();
  const { uploadMultiple, isUploading, uploadProgress, error: uploadError } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    description: "",
    unit: "kg",
    basePrice: "",
    stockQty: "",
    images: [],
    tags: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPending = profile?.status === "PENDING";
  const isFormDisabled = isPending || profileLoading;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 images
      setError(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.category) {
      setError("Category is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!formData.basePrice || Number(formData.basePrice) <= 0) {
      setError("Base price must be greater than 0");
      return;
    }

    if (!formData.stockQty || Number(formData.stockQty) < 0) {
      setError("Stock quantity is required");
      return;
    }

    if (selectedFiles.length === 0 && formData.images.length === 0) {
      setError("At least one image is required");
      return;
    }

    try {
      // Upload new images if any
      let uploadedUrls = [...formData.images];
      if (selectedFiles.length > 0) {
        uploadedUrls = await uploadMultiple(selectedFiles);
      }

      // Create product
      await addProduct({
        name: formData.name.trim(),
        category: formData.category as any,
        description: formData.description.trim(),
        unit: formData.unit,
        basePrice: Number(formData.basePrice),
        stockQty: Number(formData.stockQty),
        images: uploadedUrls,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      setSubmitted(true);
      setSelectedFiles([]);
      setFormData({
        name: "",
        category: "",
        description: "",
        unit: "kg",
        basePrice: "",
        stockQty: "",
        images: [],
        tags: "",
      });

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  };

  const inputBase =
    "w-full rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-200 outline-none min-h-[48px] placeholder:font-normal";

  const disabledClasses = isFormDisabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 ${disabledClasses}`}
      style={{
        background: T.cardBg,
        border: `1.5px solid ${T.border}`,
        boxShadow: "0 4px 24px rgba(26,48,32,0.08)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: `${T.success}12` }}
        >
          <PlusCircle className="w-5 h-5" style={{ color: T.success }} />
        </div>
        <div>
          <h2 className="font-extrabold text-base" style={{ color: T.textDark }}>
            Add New Product
          </h2>
          <p className="text-xs" style={{ color: T.textLight }}>
            {isPending ? "Account pending approval" : "List your produce on the marketplace"}
          </p>
        </div>
      </div>

      {/* Verification Warning */}
      {isPending && !profileLoading && (
        <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
          Your account is pending verification. You cannot add products yet. Please wait for admin approval.
        </div>
      )}

      {submitted ? (
        <div
          className="rounded-2xl px-6 py-8 text-center"
          style={{
            background: `${T.success}10`,
            border: `2px solid ${T.success}30`,
          }}
        >
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: T.success }} />
          <p className="font-extrabold text-lg" style={{ color: T.textDark }}>
            Product Added Successfully!
          </p>
          <p className="text-sm mt-1" style={{ color: T.textLight }}>
            {formData.name} is now pending admin approval
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              {error}
            </div>
          )}

          {uploadError && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              Upload error: {uploadError}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Product Name <span style={{ color: T.success }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Fresh Tomatoes"
              disabled={isFormDisabled}
              className={inputBase}
              style={{
                background: T.bg,
                border: `2px solid ${formData.name ? T.success : T.border}`,
                color: T.textDark,
                boxShadow: formData.name ? `0 0 0 3px ${T.success}15` : "none",
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Category <span style={{ color: T.success }}>*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              className={inputBase}
              style={{
                background: T.bg,
                border: `2px solid ${formData.category ? T.success : T.border}`,
                color: T.textDark,
                boxShadow: formData.category ? `0 0 0 3px ${T.success}15` : "none",
              }}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Description <span style={{ color: T.success }}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product quality, harvest method, etc."
              disabled={isFormDisabled}
              className={`${inputBase} resize-none`}
              rows={4}
              style={{
                background: T.bg,
                border: `2px solid ${formData.description ? T.success : T.border}`,
                color: T.textDark,
                boxShadow: formData.description ? `0 0 0 3px ${T.success}15` : "none",
              }}
            />
          </div>

          {/* Unit & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
                Unit <span style={{ color: T.success }}>*</span>
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                placeholder="e.g., kg"
                disabled={isFormDisabled}
                className={inputBase}
                style={{
                  background: T.bg,
                  border: `2px solid ${T.border}`,
                  color: T.textDark,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
                Base Price (Rs.) <span style={{ color: T.success }}>*</span>
              </label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                placeholder="e.g., 150"
                disabled={isFormDisabled}
                min="0"
                step="0.01"
                className={inputBase}
                style={{
                  background: T.bg,
                  border: `2px solid ${formData.basePrice ? T.success : T.border}`,
                  color: T.textDark,
                  boxShadow: formData.basePrice ? `0 0 0 3px ${T.success}15` : "none",
                }}
              />
            </div>
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Available Quantity <span style={{ color: T.success }}>*</span>
            </label>
            <input
              type="number"
              name="stockQty"
              value={formData.stockQty}
              onChange={handleInputChange}
              placeholder="e.g., 100"
              disabled={isFormDisabled}
              min="0"
              step="0.1"
              className={inputBase}
              style={{
                background: T.bg,
                border: `2px solid ${formData.stockQty ? T.success : T.border}`,
                color: T.textDark,
                boxShadow: formData.stockQty ? `0 0 0 3px ${T.success}15` : "none",
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Tags{" "}
              <span className="font-normal text-xs" style={{ color: T.textLight }}>
                (comma separated, optional)
              </span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., organic, fresh, local"
              disabled={isFormDisabled}
              className={inputBase}
              style={{
                background: T.bg,
                border: `2px solid ${T.border}`,
                color: T.textDark,
              }}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Product Images <span style={{ color: T.success }}>*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isFormDisabled || isUploading}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isFormDisabled || isUploading}
              className="w-full rounded-2xl p-6 border-2 border-dashed transition-all duration-200"
              style={{
                borderColor: T.border,
                background: `${T.success}08`,
                cursor: isFormDisabled || isUploading ? "not-allowed" : "pointer",
                opacity: isFormDisabled || isUploading ? 0.5 : 1,
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6" style={{ color: T.success }} />
                <div className="text-sm font-semibold" style={{ color: T.textDark }}>
                  {isUploading
                    ? `Uploading... ${Math.round(uploadProgress)}%`
                    : `Click to upload or drag images (${selectedFiles.length}/5)`}
                </div>
                <div className="text-xs" style={{ color: T.textLight }}>
                  PNG, JPG, WebP up to 10MB each
                </div>
              </div>
            </button>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden bg-gray-100"
                    style={{ aspectRatio: "1" }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFormDisabled || isUploading || productLoading}
            className="w-full rounded-2xl font-extrabold text-base text-white flex items-center justify-center gap-3 transition-all duration-300 min-h-[56px] mt-6 hover:-translate-y-0.5 disabled:translate-y-0"
            style={{
              background:
                isFormDisabled || isUploading || productLoading
                  ? T.textLight
                  : `linear-gradient(135deg, ${T.success}, #2C6020)`,
              cursor:
                isFormDisabled || isUploading || productLoading ? "not-allowed" : "pointer",
              boxShadow:
                isFormDisabled || isUploading || productLoading
                  ? "none"
                  : `0 8px 24px ${T.success}50`,
            }}
          >
            {isUploading || productLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isUploading ? "Uploading..." : "Creating Product..."}
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Add Product
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
