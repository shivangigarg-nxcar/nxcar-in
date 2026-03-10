'use client';

import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteDialogProps {
  brand: string;
  model: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ brand, model, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" data-testid="delete-dialog">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-md mx-4 w-full shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Delete Listing?</h3>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-foreground/80 mb-6">
          Are you sure you want to delete your listing for{" "}
          <span className="font-semibold text-foreground">
            {brand} {model}
          </span>
          ?
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            data-testid="button-cancel-delete"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            data-testid="button-confirm-delete"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
