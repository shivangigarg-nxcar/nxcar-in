'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DealerImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  if (!images.length) return null;

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-xl group"
      data-testid="dealer-image-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((url, i) => (
          <div key={i} className="min-w-full h-full flex-shrink-0 bg-slate-100 dark:bg-white/5">
            <img src={url} alt={`Dealer ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            data-testid="button-slider-prev"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            data-testid="button-slider-next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-white w-5" : "bg-white/50"}`}
                data-testid={`dot-slider-${i}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function DealerGalleryScroller({ images, onImageClick }: { images: string[]; onImageClick: (url: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!images.length) return null;

  return (
    <div className="md:hidden relative group" data-testid="dealer-gallery-scroller">
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {images.map((url, i) => (
          <div
            key={i}
            className="snap-start flex-shrink-0 w-[75vw] rounded-xl overflow-hidden cursor-pointer border border-border hover:opacity-90 transition-opacity"
            onClick={() => onImageClick(url)}
            data-testid={`img-dealer-gallery-mobile-${i}`}
          >
            <img src={url} alt={`Dealership ${i + 1}`} className="w-full h-48 object-contain bg-slate-100 dark:bg-white/5" loading="lazy" />
          </div>
        ))}
      </div>
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white shadow-lg z-10"
          data-testid="button-gallery-scroll-left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white shadow-lg z-10"
          data-testid="button-gallery-scroll-right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
