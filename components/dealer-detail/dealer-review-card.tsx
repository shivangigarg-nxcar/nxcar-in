'use client';

import { useState } from "react";
import { Star } from "lucide-react";

export interface DealerReview {
  name: string;
  review: string;
  rating: string;
  image: string;
  location: string;
}

function getFirstChar(name: string): string {
  return (name || "?").charAt(0).toUpperCase();
}

export function DealerReviewCard({ review }: { review: DealerReview }) {
  const [expanded, setExpanded] = useState(false);
  const words = review.review.split(" ");
  const isLong = words.length > 30;
  const displayText = expanded ? review.review : words.slice(0, 30).join(" ") + (isLong ? "..." : "");

  return (
    <div className="min-w-[280px] sm:min-w-[320px] bg-card rounded-xl p-4 shadow-sm border border-border flex-shrink-0 snap-start">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
          {getFirstChar(review.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-sm font-medium text-amber-500">{review.rating}</span>
            <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
        &ldquo;{displayText}&rdquo;
        {isLong && (
          <button onClick={() => setExpanded(!expanded)} className="text-primary text-xs ml-1 hover:underline" data-testid="button-read-more">
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">{review.name} {review.location}</span>
      </div>
    </div>
  );
}
