"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  return (
    <div
      className={cn("flex gap-1", className)}
      onMouseLeave={handleMouseLeave}
      data-testid="star-rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          whileHover={readonly ? {} : { scale: 1.15 }}
          whileTap={readonly ? {} : { scale: 0.95 }}
          className={cn(
            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
          data-testid={`star-${star}`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors duration-150",
              star <= displayValue
                ? "fill-[#0EA9B2] text-[#0EA9B2]"
                : "fill-transparent text-slate-500"
            )}
          />
        </motion.button>
      ))}
    </div>
  );
}
