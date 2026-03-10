"use client";

import { useState } from "react";

interface UseImageUploadParams {
  maxImages?: number;
  toast: (opts: { title: string; variant?: "destructive" | "default" }) => void;
}

export function useImageUpload({ maxImages = 5, toast }: UseImageUploadParams) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = maxImages - pendingFiles.length;
    if (remaining <= 0) { toast({ title: `Max ${maxImages} images`, variant: "destructive" }); return; }
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.type.startsWith("image/")) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    }
    setPendingFiles((prev) => [...prev, ...newFiles]);
    setUploadedImages((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const url = prev[index];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToNxcar = async (vehicleId: string, expectedPrice: number) => {
    if (pendingFiles.length === 0) return;
    try {
      setIsUploading(true);
      const formPayload = new FormData();
      formPayload.append("vehicle_id", vehicleId);
      const priceVal = expectedPrice ? Number(expectedPrice).toLocaleString('en-IN') : "0";
      formPayload.append("price", priceVal);
      for (const file of pendingFiles) {
        formPayload.append("file", file);
      }
      const res = await fetch("/api/nxcar/image-upload", { method: "POST", body: formPayload });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Image upload failed:", errData);
      }
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetImages = () => {
    setUploadedImages([]);
    setPendingFiles([]);
  };

  return {
    uploadedImages,
    setUploadedImages,
    pendingFiles,
    isUploading,
    handleImageUpload,
    removeImage,
    uploadImagesToNxcar,
    resetImages,
  };
}
