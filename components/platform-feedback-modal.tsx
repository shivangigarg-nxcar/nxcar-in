"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { StarRating } from "./star-rating";
import { apiRequest } from "@lib/queryClient";
import { Check, Loader2, Bug, Lightbulb, MessageSquare, AlertTriangle, ThumbsUp } from "lucide-react";

interface PlatformFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const feedbackTypes = [
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Lightbulb },
  { value: "general", label: "General Feedback", icon: MessageSquare },
  { value: "complaint", label: "Complaint", icon: AlertTriangle },
  { value: "praise", label: "Praise", icon: ThumbsUp },
];

export default function PlatformFeedbackModal({ open, onOpenChange }: PlatformFeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: {
      feedbackType: string;
      feedbackText: string;
      rating?: number;
      email?: string;
      name?: string;
      page?: string;
    }) => {
      const res = await apiRequest("POST", "/api/feedback", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!feedbackType) {
      setValidationError("Please select a feedback type");
      return;
    }
    if (!feedbackText.trim()) {
      setValidationError("Please enter your feedback");
      return;
    }

    mutation.mutate({
      feedbackType,
      feedbackText: feedbackText.trim(),
      rating: rating > 0 ? rating : undefined,
      email: email.trim() || undefined,
      name: name.trim() || undefined,
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  const resetForm = () => {
    setFeedbackType("");
    setFeedbackText("");
    setRating(0);
    setEmail("");
    setName("");
    setSubmitted(false);
    setValidationError("");
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setTimeout(resetForm, 300);
    }
    onOpenChange(value);
  };

  const selectedType = feedbackTypes.find((t) => t.value === feedbackType);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-background border-border text-foreground sm:max-w-[480px]"
        data-testid="modal-platform-feedback"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Share Your Feedback</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Help us improve your experience on Nxcar
          </DialogDescription>
        </DialogHeader>

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
                className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="text-foreground font-semibold mb-2">Thank you for your feedback!</h3>
              <p className="text-muted-foreground text-sm mb-6">
                We appreciate you taking the time to help us improve.
              </p>
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                data-testid="button-close-feedback"
              >
                Close
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
                <Label className="text-muted-foreground">Feedback Type *</Label>
                <Select value={feedbackType} onValueChange={setFeedbackType}>
                  <SelectTrigger
                    className="bg-muted/50 border-border text-foreground"
                    data-testid="select-feedback-type"
                  >
                    <SelectValue placeholder="Select type of feedback" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {feedbackTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="text-foreground focus:bg-primary/20 focus:text-foreground"
                        data-testid={`option-feedback-type-${type.value}`}
                      >
                        <span className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedbackText" className="text-muted-foreground">
                  Your Feedback *
                </Label>
                <Textarea
                  id="feedbackText"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    selectedType?.value === "bug"
                      ? "Describe the issue you encountered..."
                      : selectedType?.value === "feature"
                      ? "Describe the feature you'd like to see..."
                      : "Share your thoughts with us..."
                  }
                  rows={4}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground resize-none"
                  data-testid="textarea-feedback"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Overall Platform Experience (optional)</Label>
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-muted-foreground">
                    Name (optional)
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    data-testid="input-feedback-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">
                    Email (optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    data-testid="input-feedback-email"
                  />
                </div>
              </div>

              {(validationError || mutation.isError) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 dark:text-red-400 text-sm"
                >
                  {validationError || "Failed to submit feedback. Please try again."}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                data-testid="button-submit-feedback"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
