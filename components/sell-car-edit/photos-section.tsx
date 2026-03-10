'use client';

import { CollapsibleSection } from "./collapsible-section";
import { Switch } from "@components/ui/switch";
import { Camera, X, Eye, Loader2 } from "lucide-react";

function resolveImageUrl(path: string): string {
  if (!path) return "/images/car-sedan.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/") || path.startsWith("objects/")) return `/api${path.startsWith('/') ? '' : '/'}${path}`;
  if (path.startsWith("/replit-objstore")) {
    const match = path.match(/\/replit-objstore[^/]*\/\.private\/(.*)/);
    if (match) return `/api/objects/${match[1]}`;
  }
  return "/images/car-sedan.png";
}

interface PhotosSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  uploadedImages: string[];
  isUploading: boolean;
  hideNumberPlate: boolean;
  removeWatermark: boolean;
  updateField: (field: string, value: any) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function PhotosSection({
  isOpen,
  onToggle,
  uploadedImages,
  isUploading,
  hideNumberPlate,
  removeWatermark,
  updateField,
  onImageUpload,
  onRemoveImage,
}: PhotosSectionProps) {
  return (
    <CollapsibleSection
      title="Car Photos"
      icon={<Camera className="w-5 h-5 text-teal-500" />}
      isOpen={isOpen}
      onToggle={onToggle}
      testId="photos"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {uploadedImages.map((img, index) => (
            <div
              key={index}
              className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border/50 bg-muted/30"
              data-testid={`image-card-${index}`}
            >
              <img
                src={resolveImageUrl(img)}
                alt={`Car photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                data-testid={`button-remove-image-${index}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {uploadedImages.length < 5 && (
            <label
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-colors"
              data-testid="button-upload-image"
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                className="hidden"
                disabled={isUploading}
                data-testid="input-image-upload"
              />
            </label>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {uploadedImages.length}/5 photos uploaded
        </p>

        <div className="space-y-3 pt-2 border-t border-border/30">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-teal-500" />
              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="hide-number-plate-toggle">Hide Number Plate</label>
                <p className="text-xs text-muted-foreground">Blur the number plate in your car photos for privacy</p>
              </div>
            </div>
            <Switch
              id="hide-number-plate-toggle"
              checked={hideNumberPlate}
              onCheckedChange={(checked) => updateField("hideNumberPlate", checked)}
              data-testid="switch-hide-number-plate"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
            <div className="flex items-center gap-3">
              <X className="w-4 h-4 text-teal-500" />
              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="remove-watermark-toggle">Remove Watermark</label>
                <p className="text-xs text-muted-foreground">Remove any existing watermarks from your car photos</p>
              </div>
            </div>
            <Switch
              id="remove-watermark-toggle"
              checked={removeWatermark}
              onCheckedChange={(checked) => updateField("removeWatermark", checked)}
              data-testid="switch-remove-watermark"
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
