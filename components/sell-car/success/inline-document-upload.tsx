"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Upload,
  Plus,
  X,
  FileText,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@hooks/use-toast";

interface InlineDocumentUploadProps {
  vehicleId: string;
  onBack: () => void;
  onDone: () => void;
}

interface UploadBox {
  id: string;
  file: File | null;
  preview: string | null;
}

export function InlineDocumentUpload({ vehicleId, onBack, onDone }: InlineDocumentUploadProps) {
  const { toast } = useToast();
  const [rcFront, setRcFront] = useState<UploadBox>({ id: "rc_front", file: null, preview: null });
  const [rcBack, setRcBack] = useState<UploadBox>({ id: "rc_back", file: null, preview: null });
  const [insurance, setInsurance] = useState<UploadBox>({ id: "insurance", file: null, preview: null });
  const [panCard, setPanCard] = useState<UploadBox>({ id: "pan_card", file: null, preview: null });
  const [bankDetails, setBankDetails] = useState<UploadBox>({ id: "bank_details", file: null, preview: null });
  const [cancelledCheque, setCancelledCheque] = useState<UploadBox>({ id: "cancelled_cheque", file: null, preview: null });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = useCallback((id: string, file: File, setter: (val: UploadBox) => void) => {
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setter({ id, file, preview });
  }, []);

  const handleRemove = useCallback((id: string, setter: (val: UploadBox) => void) => {
    setter({ id, file: null, preview: null });
    const input = fileInputRefs.current[id];
    if (input) input.value = "";
  }, []);

  const triggerUpload = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  const handleSubmit = async () => {
    if (!vehicleId) {
      toast({ title: "Error", description: "Vehicle ID is missing.", variant: "destructive" });
      return;
    }

    const allBoxes = [rcFront, rcBack, insurance, panCard, bankDetails, cancelledCheque];
    const filesWithData = allBoxes.filter(b => b.file);

    if (filesWithData.length === 0) {
      toast({ title: "No documents", description: "Please add at least one document to upload.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("vehicle_id", vehicleId);

      for (const box of filesWithData) {
        if (box.file) {
          formData.append("file", box.file, `${box.id}_${box.file.name}`);
        }
      }

      const res = await fetch("/api/nxcar/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      setSubmitted(true);
      toast({ title: "Documents Uploaded", description: "Your documents have been submitted successfully." });
      setTimeout(() => onDone(), 2000);
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2" data-testid="text-inline-upload-success">Documents Uploaded!</h2>
        <p className="text-sm text-muted-foreground">Your documents have been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto" data-testid="inline-document-upload">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          data-testid="button-doc-upload-back"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-upload-title">Upload your document</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide your bank details for verification. We'll use this account to securely transfer your payment.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">RC Copy</h3>
          <div className="grid grid-cols-2 gap-3">
            <UploadArea
              id="rc_front"
              label="Front of RC Copy"
              box={rcFront}
              fileInputRefs={fileInputRefs}
              onFileChange={(f) => handleFileChange("rc_front", f, setRcFront)}
              onRemove={() => handleRemove("rc_front", setRcFront)}
              onTrigger={() => triggerUpload("rc_front")}
            />
            <UploadArea
              id="rc_back"
              label="Back of RC Copy"
              box={rcBack}
              fileInputRefs={fileInputRefs}
              onFileChange={(f) => handleFileChange("rc_back", f, setRcBack)}
              onRemove={() => handleRemove("rc_back", setRcBack)}
              onTrigger={() => triggerUpload("rc_back")}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Insurance Policy Copy</h3>
          <UploadArea
            id="insurance"
            label=""
            box={insurance}
            fileInputRefs={fileInputRefs}
            onFileChange={(f) => handleFileChange("insurance", f, setInsurance)}
            onRemove={() => handleRemove("insurance", setInsurance)}
            onTrigger={() => triggerUpload("insurance")}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">PAN Card</h3>
          <UploadArea
            id="pan_card"
            label=""
            box={panCard}
            fileInputRefs={fileInputRefs}
            onFileChange={(f) => handleFileChange("pan_card", f, setPanCard)}
            onRemove={() => handleRemove("pan_card", setPanCard)}
            onTrigger={() => triggerUpload("pan_card")}
          />
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground mb-3">Payment Details</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Bank Account Details</h4>
              <UploadArea
                id="bank_details"
                label=""
                box={bankDetails}
                fileInputRefs={fileInputRefs}
                onFileChange={(f) => handleFileChange("bank_details", f, setBankDetails)}
                onRemove={() => handleRemove("bank_details", setBankDetails)}
                onTrigger={() => triggerUpload("bank_details")}
              />
            </div>

            <div className="text-center">
              <span className="text-sm text-muted-foreground font-medium">OR</span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Cancelled Cheque Copy</h4>
              <UploadArea
                id="cancelled_cheque"
                label=""
                box={cancelledCheque}
                fileInputRefs={fileInputRefs}
                onFileChange={(f) => handleFileChange("cancelled_cheque", f, setCancelledCheque)}
                onRemove={() => handleRemove("cancelled_cheque", setCancelledCheque)}
                onTrigger={() => triggerUpload("cancelled_cheque")}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 pb-8">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold"
            data-testid="button-submit-inline-docs"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface UploadAreaProps {
  id: string;
  label: string;
  box: UploadBox;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  onTrigger: () => void;
}

function UploadArea({ id, label, box, fileInputRefs, onFileChange, onRemove, onTrigger }: UploadAreaProps) {
  return (
    <div data-testid={`upload-area-${id}`}>
      <input
        ref={(el) => { fileInputRefs.current[id] = el; }}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
        }}
        data-testid={`input-file-${id}`}
      />

      {!box.file ? (
        <button
          onClick={onTrigger}
          className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl py-8 sm:py-10 flex flex-col items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          data-testid={`button-upload-${id}`}
        >
          <Plus className="w-6 h-6 text-muted-foreground" />
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </button>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          {box.preview ? (
            <img src={box.preview} alt={label || id} className="w-full h-32 sm:h-40 object-contain" />
          ) : (
            <div className="flex items-center gap-3 px-4 py-6 justify-center">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground truncate">{box.file.name}</span>
            </div>
          )}
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
            data-testid={`button-remove-${id}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
