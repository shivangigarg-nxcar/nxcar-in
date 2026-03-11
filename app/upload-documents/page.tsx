'use client';

import { useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Upload, CheckCircle2, X, FileText, Image as ImageIcon,
  ArrowLeft, Loader2, CreditCard, Shield, Car, IdCard, Banknote
} from "lucide-react";
import { useToast } from "@hooks/use-toast";

interface DocSlot {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  file: File | null;
  preview: string | null;
  confirmed: boolean;
  uploading: boolean;
  uploaded: boolean;
}

const INITIAL_SLOTS: Omit<DocSlot, "file" | "preview" | "confirmed" | "uploading" | "uploaded">[] = [
  { id: "rc_front", label: "RC (Registration Certificate)", sublabel: "Front Side", icon: <Car className="w-5 h-5" /> },
  { id: "rc_back", label: "RC (Registration Certificate)", sublabel: "Back Side", icon: <Car className="w-5 h-5" /> },
  { id: "insurance", label: "Insurance Policy", icon: <Shield className="w-5 h-5" /> },
  { id: "pan_card", label: "PAN Card", icon: <IdCard className="w-5 h-5" /> },
  { id: "aadhaar_front", label: "Aadhaar Card", sublabel: "Front Side", icon: <IdCard className="w-5 h-5" /> },
  { id: "aadhaar_back", label: "Aadhaar Card", sublabel: "Back Side", icon: <IdCard className="w-5 h-5" /> },
];

export default function UploadDocumentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const vehicleId = searchParams.get("vehicle_id") || "";

  const [slots, setSlots] = useState<DocSlot[]>(
    INITIAL_SLOTS.map(s => ({ ...s, file: null, preview: null, confirmed: false, uploading: false, uploaded: false }))
  );
  const [paymentMode, setPaymentMode] = useState<"bank" | "cheque">("bank");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [chequeFile, setChequeFile] = useState<File | null>(null);
  const [chequePreview, setChequePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const chequeInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback((slotId: string, file: File) => {
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setSlots(prev => prev.map(s =>
      s.id === slotId ? { ...s, file, preview, confirmed: false, uploaded: false } : s
    ));
  }, []);

  const handleConfirm = useCallback((slotId: string) => {
    setSlots(prev => prev.map(s =>
      s.id === slotId ? { ...s, confirmed: true } : s
    ));
  }, []);

  const handleRemove = useCallback((slotId: string) => {
    setSlots(prev => prev.map(s =>
      s.id === slotId ? { ...s, file: null, preview: null, confirmed: false, uploaded: false } : s
    ));
    const input = fileInputRefs.current[slotId];
    if (input) input.value = "";
  }, []);

  const handleChequeSelect = useCallback((file: File) => {
    setChequeFile(file);
    setChequePreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  }, []);

  const handleSubmitAll = async () => {
    if (!vehicleId) {
      toast({ title: "Error", description: "Vehicle ID is missing.", variant: "destructive" });
      return;
    }

    const confirmedSlots = slots.filter(s => s.confirmed && s.file);
    const hasCheque = paymentMode === "cheque" && chequeFile;
    const hasBank = paymentMode === "bank" && bankAccount && bankIfsc;

    if (confirmedSlots.length === 0 && !hasCheque && !hasBank) {
      toast({ title: "No documents", description: "Please add at least one document to upload.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("vehicle_id", vehicleId);

      for (const slot of confirmedSlots) {
        if (slot.file) {
          formData.append("file", slot.file, `${slot.id}_${slot.file.name}`);
        }
      }

      if (paymentMode === "cheque" && chequeFile) {
        formData.append("file", chequeFile, `cancelled_cheque_${chequeFile.name}`);
      }

      if (paymentMode === "bank" && bankAccount) {
        formData.append("bank_account", bankAccount);
        formData.append("bank_ifsc", bankIfsc);
        formData.append("bank_name", bankName);
      }

      const res = await fetch("/api/nxcar/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      setSlots(prev => prev.map(s => s.confirmed ? { ...s, uploaded: true, uploading: false } : s));
      setSubmitted(true);
      toast({ title: "Documents Uploaded", description: "Your documents have been submitted successfully." });
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!vehicleId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-lg font-bold text-foreground mb-1">No Vehicle Selected</h2>
          <p className="text-sm text-muted-foreground mb-4">Please book an inspection first to upload documents.</p>
          <Button onClick={() => router.push("/my-cars")} data-testid="button-go-my-cars">Go to My Cars</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2" data-testid="text-upload-success">Documents Uploaded!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your documents have been submitted successfully. We'll review them and get back to you shortly.
          </p>
          <Button onClick={() => router.push("/my-cars")} className="w-full rounded-xl h-12" data-testid="button-back-my-cars">
            Go to My Cars
          </Button>
        </div>
      </div>
    );
  }

  const confirmedCount = slots.filter(s => s.confirmed).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-muted" data-testid="button-back">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground" data-testid="text-page-title">Upload Documents</h1>
            <p className="text-[11px] text-muted-foreground">{confirmedCount} of {slots.length} documents ready</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
          <p className="text-xs text-primary font-medium">Upload your documents to speed up the selling process. You can upload images or PDFs.</p>
        </div>

        {slots.map(slot => (
          <div
            key={slot.id}
            className={`rounded-2xl border-2 transition-all ${
              slot.uploaded ? "border-green-500/50 bg-green-500/5"
                : slot.confirmed ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card"
            } p-4`}
            data-testid={`card-doc-${slot.id}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                slot.uploaded ? "bg-green-500/10 text-green-500"
                  : slot.confirmed ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}>
                {slot.uploaded ? <CheckCircle2 className="w-5 h-5" /> : slot.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{slot.label}</p>
                {slot.sublabel && <p className="text-xs text-muted-foreground">{slot.sublabel}</p>}
              </div>
              {slot.uploaded && (
                <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">Done</span>
              )}
            </div>

            {!slot.file && !slot.uploaded && (
              <>
                <input
                  ref={el => { fileInputRefs.current[slot.id] = el; }}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(slot.id, f);
                  }}
                  data-testid={`input-file-${slot.id}`}
                />
                <button
                  onClick={() => fileInputRefs.current[slot.id]?.click()}
                  className="w-full border-2 border-dashed border-border rounded-xl py-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  data-testid={`button-upload-${slot.id}`}
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Tap to upload image or PDF</span>
                </button>
              </>
            )}

            {slot.file && !slot.uploaded && (
              <div className="space-y-3">
                {slot.preview ? (
                  <div className="relative rounded-xl overflow-hidden bg-muted">
                    <img src={slot.preview} alt={slot.label} className="w-full h-40 object-contain" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground truncate flex-1">{slot.file.name}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  {!slot.confirmed ? (
                    <>
                      <Button
                        onClick={() => handleConfirm(slot.id)}
                        className="flex-1 h-10 rounded-xl text-sm bg-primary hover:bg-primary/90 text-white gap-1.5"
                        data-testid={`button-confirm-${slot.id}`}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Confirm
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRemove(slot.id)}
                        className="h-10 rounded-xl text-sm px-3"
                        data-testid={`button-remove-${slot.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-1.5 text-sm text-primary font-medium flex-1">
                        <CheckCircle2 className="w-4 h-4" /> Confirmed
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(slot.id)}
                        className="text-xs text-muted-foreground"
                        data-testid={`button-change-${slot.id}`}
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className={`rounded-2xl border-2 border-border bg-card p-4`} data-testid="card-doc-payment">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Payment Details</p>
              <p className="text-xs text-muted-foreground">Bank account or cancelled cheque</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPaymentMode("bank")}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                paymentMode === "bank"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground"
              }`}
              data-testid="button-payment-bank"
            >
              <CreditCard className="w-3.5 h-3.5 mx-auto mb-1" />
              Bank Account
            </button>
            <button
              onClick={() => setPaymentMode("cheque")}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                paymentMode === "cheque"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground"
              }`}
              data-testid="button-payment-cheque"
            >
              <ImageIcon className="w-3.5 h-3.5 mx-auto mb-1" />
              Cancelled Cheque
            </button>
          </div>

          {paymentMode === "bank" && (
            <div className="space-y-3">
              <Input
                placeholder="Account Number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                className="h-11 rounded-xl"
                data-testid="input-bank-account"
              />
              <Input
                placeholder="IFSC Code"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase().slice(0, 11))}
                className="h-11 rounded-xl"
                data-testid="input-bank-ifsc"
              />
              <Input
                placeholder="Account Holder Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="h-11 rounded-xl"
                data-testid="input-bank-name"
              />
            </div>
          )}

          {paymentMode === "cheque" && (
            <div>
              {!chequeFile ? (
                <>
                  <input
                    ref={chequeInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleChequeSelect(f);
                    }}
                    data-testid="input-file-cheque"
                  />
                  <button
                    onClick={() => chequeInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-xl py-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    data-testid="button-upload-cheque"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload cancelled cheque image</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  {chequePreview ? (
                    <div className="rounded-xl overflow-hidden bg-muted">
                      <img src={chequePreview} alt="Cancelled cheque" className="w-full h-40 object-contain" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground truncate flex-1">{chequeFile.name}</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setChequeFile(null);
                      setChequePreview(null);
                      if (chequeInputRef.current) chequeInputRef.current.value = "";
                    }}
                    className="w-full h-10 rounded-xl text-sm"
                    data-testid="button-remove-cheque"
                  >
                    <X className="w-4 h-4 mr-1.5" /> Remove
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-2 pb-8">
          <Button
            onClick={handleSubmitAll}
            disabled={submitting}
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50"
            data-testid="button-submit-documents"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Uploading Documents...</>
            ) : (
              <><Upload className="w-5 h-5 mr-2" /> Submit All Documents ({confirmedCount})</>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            You can upload remaining documents later from My Cars
          </p>
        </div>
      </div>
    </div>
  );
}
