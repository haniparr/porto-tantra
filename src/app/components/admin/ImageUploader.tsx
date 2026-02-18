"use client";

import { useState } from "react";

interface ImageUploaderProps {
  currentImage?: string;
  onUpload: (url: string) => void;
}

export default function ImageUploader({
  currentImage,
  onUpload,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        onUpload(data.url);
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
      {currentImage && (
        <div className="mt-2">
          <img
            src={currentImage}
            alt="Preview"
            className="max-w-xs rounded-lg border border-gray-300"
          />
        </div>
      )}
    </div>
  );
}
