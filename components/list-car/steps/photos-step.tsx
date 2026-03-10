"use client";

import { Camera, X, Loader2 } from "lucide-react";

interface PhotosStepProps {
  uploadedImages: string[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: (index: number) => void;
  isUploading: boolean;
}

export function PhotosStep({ uploadedImages, handleImageUpload, removeImage, isUploading }: PhotosStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {uploadedImages.map((imagePath, index) => (
          <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
            <img
              src={`/api/objects/${imagePath}`}
              alt={`Car photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {uploadedImages.length < 10 && (
          <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-background/30">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <>
                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-muted-foreground text-sm">Add Photo</span>
              </>
            )}
          </label>
        )}
      </div>
      <p className="text-center text-muted-foreground text-sm">
        Add up to 10 photos • {uploadedImages.length}/10 uploaded
      </p>
    </div>
  );
}
