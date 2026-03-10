"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { StarRating } from "./star-rating";
import { apiRequest } from "@lib/queryClient";
import { Check, Loader2 } from "lucide-react";

interface CarReviewFormProps {
  carId: number;
  onSuccess?: () => void;
  className?: string;
}

export function CarReviewForm({ carId, onSuccess, className }: CarReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { rating: number; reviewText?: string; reviewerName?: string }) => {
      const res = await apiRequest("POST", `/api/cars/${carId}/reviews`, data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: [`/api/cars/${carId}/reviews`] });
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    mutation.mutate({
      rating,
      reviewText: reviewText.trim() || undefined,
      reviewerName: reviewerName.trim() || undefined,
    });
  };

  const resetForm = () => {
    setRating(0);
    setReviewText("");
    setReviewerName("");
    setSubmitted(false);
  };

  return (
    <Card className={`bg-[#0D1117] border-white/10 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-white">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-[#0EA9B2]" />
              </motion.div>
              <h3 className="text-white font-semibold mb-2">Thank you for your review!</h3>
              <p className="text-slate-400 text-sm mb-4">Your feedback helps others make informed decisions.</p>
              <Button
                variant="outline"
                onClick={resetForm}
                data-testid="button-write-another"
              >
                Write another review
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-slate-300">Your Rating *</Label>
                <StarRating value={rating} onChange={setRating} size="lg" />
                {rating === 0 && mutation.isError && (
                  <p className="text-red-400 text-xs">Please select a rating</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewerName" className="text-slate-300">
                  Your Name (optional)
                </Label>
                <Input
                  id="reviewerName"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Anonymous"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  data-testid="input-reviewer-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewText" className="text-slate-300">
                  Your Review (optional)
                </Label>
                <Textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this car..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                  data-testid="textarea-review"
                />
              </div>

              {mutation.isError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  Failed to submit review. Please try again.
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={rating === 0 || mutation.isPending}
                className="w-full bg-[#0EA9B2] hover:bg-[#0EA9B2]/90 text-white border-none"
                data-testid="button-submit-review"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
