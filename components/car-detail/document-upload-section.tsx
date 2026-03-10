"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Upload,
  FileText,
  CreditCard,
  Building2,
  X,
  ChevronDown,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { uploadSellformDocuments } from "@lib/api";
import { useToast } from "@hooks/use-toast";

interface DocumentUploadSectionProps {
  vehicleId: string;
  car: { make: string; model: string } | null;
}

export function DocumentUploadSection({ vehicleId, car }: DocumentUploadSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [docsExpanded, setDocsExpanded] = useState(true);

  const [rcFile, setRcFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [chequeFile, setChequeFile] = useState<File | null>(null);
  const [bankDetails, setBankDetails] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cheque">("bank");

  const rcRef = useRef<HTMLInputElement>(null);
  const insuranceRef = useRef<HTMLInputElement>(null);
  const panRef = useRef<HTMLInputElement>(null);
  const chequeRef = useRef<HTMLInputElement>(null);

  const submitMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('vehicle_id', vehicleId);
      if (rcFile) formData.append('rc_copy', rcFile);
      if (insuranceFile) formData.append('insurance_policy_copy', insuranceFile);
      if (panFile) formData.append('pan_card', panFile);
      if (paymentMethod === "cheque" && chequeFile) formData.append('cancelled_cheque_copy', chequeFile);
      if (paymentMethod === "bank" && bankDetails) formData.append('bank_account_detail', bankDetails);
      return uploadSellformDocuments(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mycars-sell"] });
      toast({ title: "Documents Uploaded", description: "Your documents have been submitted successfully." });
      setRcFile(null); setInsuranceFile(null); setPanFile(null); setChequeFile(null);
    },
    onError: (error: Error) => {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    },
  });

  function validateFile(file: File): boolean {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      toast({ title: "Invalid file", description: "Please upload an image (JPG, PNG, WebP) or PDF.", variant: "destructive" });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return false;
    }
    return true;
  }

  function FilePickerField({ label, file, inputRef, onSelect, onClear, fieldName }: {
    label: string; file: File | null; inputRef: React.RefObject<HTMLInputElement | null>;
    onSelect: (f: File) => void; onClear: () => void; fieldName: string;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
        {file ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
            <button type="button" onClick={onClear} className="text-muted-foreground hover:text-foreground" data-testid={`button-clear-${fieldName}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors text-sm text-muted-foreground hover:text-foreground"
            data-testid={`button-upload-${fieldName}`}
          >
            <Upload className="w-4 h-4" />
            Select Image or PDF
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && validateFile(f)) onSelect(f); e.target.value = ""; }} />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Card data-testid="document-upload-section">
        <CardHeader
          className="pb-3 cursor-pointer select-none"
          onClick={() => setDocsExpanded(!docsExpanded)}
          data-testid="button-toggle-docs-section"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold">Upload Documents</h2>
            {car && <span className="text-sm text-muted-foreground ml-2">{car.make} {car.model}</span>}
            <ChevronDown className={`ml-auto h-5 w-5 text-muted-foreground transition-transform duration-200 ${docsExpanded ? 'rotate-180' : ''}`} />
          </div>
        </CardHeader>
        {docsExpanded && (
          <CardContent className="space-y-5">
            <FilePickerField label="RC Copy *" file={rcFile} fieldName="rc" inputRef={rcRef} onSelect={setRcFile} onClear={() => setRcFile(null)} />
            <FilePickerField label="Insurance Policy Copy *" file={insuranceFile} fieldName="insurance" inputRef={insuranceRef} onSelect={setInsuranceFile} onClear={() => setInsuranceFile(null)} />
            <FilePickerField label="PAN Card *" file={panFile} fieldName="pan" inputRef={panRef} onSelect={setPanFile} onClear={() => setPanFile(null)} />

            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Payment Details</span>
                <span className="text-xs text-muted-foreground">(fill any one)</span>
              </div>
              <div className="flex gap-2 mb-4">
                <button type="button" onClick={() => setPaymentMethod("bank")} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${paymentMethod === "bank" ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"}`} data-testid="button-payment-bank">
                  <Building2 className="w-4 h-4" /> Bank Account
                </button>
                <button type="button" onClick={() => setPaymentMethod("cheque")} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${paymentMethod === "cheque" ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"}`} data-testid="button-payment-cheque">
                  <FileText className="w-4 h-4" /> Cancelled Cheque
                </button>
              </div>
              {paymentMethod === "bank" ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bank Account Details</label>
                  <Input placeholder="Account number, IFSC, Bank name" value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} className="rounded-xl" data-testid="input-bank-details" />
                </div>
              ) : (
                <FilePickerField label="Cancelled Cheque Copy" file={chequeFile} fieldName="cheque" inputRef={chequeRef} onSelect={setChequeFile} onClear={() => setChequeFile(null)} />
              )}
            </div>

            <Button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="w-full bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white rounded-xl py-3"
              data-testid="button-save-documents"
            >
              {submitMutation.isPending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>) : "Upload Documents"}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
