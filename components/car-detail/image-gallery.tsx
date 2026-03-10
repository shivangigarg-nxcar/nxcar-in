"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Camera, Car } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  currentImage: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onSelectImage: (idx: number) => void;
  altText: string;
}

export const ImageGallery = React.memo(function ImageGallery({ images, currentImage, onPrevImage, onNextImage, onSelectImage, altText }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div
        className="aspect-[7/5] rounded-md border flex items-center justify-center bg-muted"
        data-testid="no-images"
      >
        <div className="text-center text-muted-foreground">
          <Car className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="relative aspect-[7/5] rounded-md border overflow-hidden bg-muted"
        data-testid="image-gallery"
      >
        <img
          src={images[currentImage]}
          alt={altText}
          className="w-full h-full object-cover"
          data-testid="img-car-main"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition"
              aria-label="Previous image"
              data-testid="button-prev-image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={onNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition"
              aria-label="Next image"
              data-testid="button-next-image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div
          className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs flex items-center gap-1"
          data-testid="text-image-counter"
        >
          <Camera className="h-3 w-3" />
          {currentImage + 1}/{images.length}
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex p-2.5 gap-2 overflow-x-auto bg-muted/30 rounded-md">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelectImage(idx)}
              className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition ${
                currentImage === idx
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/30"
              }`}
              data-testid={`button-thumbnail-${idx}`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
