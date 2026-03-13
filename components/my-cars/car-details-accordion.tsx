'use client';

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, Loader2, Pencil, CheckCircle2, FileText, Plus, X, Eye, Upload, ImagePlus } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useToast } from "@hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  testId: string;
}

function AccordionSection({ title, isOpen, onToggle, children, testId }: AccordionSectionProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden" data-testid={testId}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
        data-testid={`${testId}-toggle`}
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-border bg-card">
          {children}
        </div>
      )}
    </div>
  );
}

interface EditableField {
  key: string;
  label: string;
  value: string;
  type?: "text" | "number" | "select";
  options?: string[];
}

function EditCarDetailsSection({ car }: { car: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const vehicleId = car.vehicle_id || car.id;
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const fields: EditableField[] = [
    { key: "vehicle_no", label: "Registration Number", value: car.vehicle_no || "" },
    { key: "make", label: "Brand", value: car.make || car.brandName || "" },
    { key: "model", label: "Model", value: car.model || car.modelName || "" },
    { key: "variant", label: "Variant", value: car.variant || "" },
    { key: "year", label: "Year", value: car.year || "" },
    { key: "color", label: "Color", value: car.color || "" },
    { key: "fuel_type", label: "Fuel Type", value: car.fuel_type || car.fule_type || car.fuelType || "" },
    { key: "transmission", label: "Transmission", value: car.transmission || "" },
    { key: "mileage", label: "KMs Driven", value: car.mileage || car.kilometers || "", type: "number" },
    { key: "ownership", label: "Ownership", value: car.ownership || "" },
    { key: "expected_selling_price", label: "Expected Price", value: car.expected_selling_price || car.price || "", type: "number" },
    { key: "location_name", label: "Location", value: car.location_name || car.city_name || "" },
    { key: "rto_code", label: "RTO Code", value: car.rto_code || (car.state_code && car.rto_number ? `${car.state_code}${car.rto_number}` : "") },
    { key: "rto_location", label: "RTO Location", value: car.rto_location || "" },
    { key: "seats", label: "Seats", value: car.seats || "" },
  ];

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data: Record<string, string> = {};
    fields.forEach(f => { data[f.key] = f.value; });
    return data;
  });

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageRemove = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (imageFiles.length > 0) {
        const imgForm = new FormData();
        imgForm.append("vehicle_id", vehicleId);
        imageFiles.forEach(file => {
          imgForm.append("file", file, file.name);
        });
        const imgRes = await fetch("/api/nxcar/image-upload", {
          method: "POST",
          body: imgForm,
        });
        if (!imgRes.ok) {
          const imgErr = await imgRes.json().catch(() => ({}));
          throw new Error(imgErr.error || "Image upload failed");
        }
      }

      const payload: Record<string, string> = {
        vehicle_id: vehicleId,
      };
      if (car.make_id) payload.make_id = car.make_id;
      if (car.model_id) payload.model_id = car.model_id;
      if (car.variant_id) payload.variant_id = car.variant_id;
      if (car.created_by) payload.created_by = car.created_by;

      Object.entries(formData).forEach(([key, val]) => {
        payload[key] = val;
      });

      const res = await fetch("/api/nxcar/edit-mycar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update car details");
      }

      if (imageFiles.length > 0) {
        await fetch("/api/nxcar/process-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicle_id: vehicleId, type: "both" }),
        });
      }

      toast({ title: "Updated", description: "Car details updated successfully." });
      setEditing(false);
      setImageFiles([]);
      setImagePreviews([]);
      queryClient.invalidateQueries({ queryKey: ["mycars-sell"] });
      queryClient.invalidateQueries({ queryKey: ["mycars-sell-ads"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {!editing ? (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {fields.map(f => (
              <div key={f.key}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{f.label}</p>
                <p className="text-sm text-foreground font-medium" data-testid={`text-detail-${f.key}-${vehicleId}`}>{formData[f.key] || "—"}</p>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setEditing(true)}
            variant="outline"
            size="sm"
            className="mt-2 text-xs font-semibold gap-1.5"
            data-testid={`button-start-edit-${vehicleId}`}
          >
            <Pencil className="h-3 w-3" /> Edit Details
          </Button>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{f.label}</label>
                <Input
                  type={f.type || "text"}
                  value={formData[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  className="h-8 text-sm"
                  data-testid={`input-edit-${f.key}-${vehicleId}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Add Photos</p>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageAdd}
              data-testid={`input-car-images-${vehicleId}`}
            />
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                  <img src={preview} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleImageRemove(i)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
                    data-testid={`button-remove-image-${i}-${vehicleId}`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => imageInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                data-testid={`button-add-images-${vehicleId}`}
              >
                <ImagePlus className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="text-xs font-semibold bg-primary hover:bg-primary/90"
              data-testid={`button-save-edit-${vehicleId}`}
            >
              {saving ? <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Saving...</> : "Save Changes"}
            </Button>
            <Button
              onClick={() => {
                setEditing(false);
                setImageFiles([]);
                setImagePreviews([]);
                const resetData: Record<string, string> = {};
                fields.forEach(f => { resetData[f.key] = f.value; });
                setFormData(resetData);
              }}
              variant="ghost"
              size="sm"
              className="text-xs"
              data-testid={`button-cancel-edit-${vehicleId}`}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function StatusSection({ car }: { car: any }) {
  const isActive = car.is_active === "1";
  const vehicleId = car.vehicle_id || car.id;

  return (
    <div className="flex items-center gap-3" data-testid={`status-section-${vehicleId}`}>
      <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
      <span className={`text-sm font-semibold ${isActive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

interface UploadBox {
  file: File | null;
  preview: string | null;
}

function UploadDocumentsSection({ car }: { car: any }) {
  const { toast } = useToast();
  const vehicleId = car.vehicle_id || car.id;
  const createdBy = car.created_by || "";
  const [loading, setLoading] = useState(true);
  const [existingDocs, setExistingDocs] = useState<any>(null);
  const [hasExistingDocs, setHasExistingDocs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [rcFront, setRcFront] = useState<UploadBox>({ file: null, preview: null });
  const [rcBack, setRcBack] = useState<UploadBox>({ file: null, preview: null });
  const [insurance, setInsurance] = useState<UploadBox>({ file: null, preview: null });
  const [panCard, setPanCard] = useState<UploadBox>({ file: null, preview: null });
  const [bankDetails, setBankDetails] = useState<UploadBox>({ file: null, preview: null });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const params = new URLSearchParams();
        params.append("vehicle_id", vehicleId);
        if (createdBy) params.append("created_by", createdBy);

        const res = await fetch(`/api/nxcar/sellform-documents-fetch?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const docs = data?.data || data;
          if (docs && typeof docs === 'object') {
            const hasAny = !!(docs.rc_copy || docs.rc_copy_back || docs.insurance_policy_copy || docs.pan_card || docs.cheque_or_bank_details);
            setHasExistingDocs(hasAny);
            if (hasAny) setExistingDocs(docs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [vehicleId, createdBy]);

  const handleFileChange = (field: string, file: File, setter: (v: UploadBox) => void) => {
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setter({ file, preview });
  };

  const handleRemove = (field: string, setter: (v: UploadBox) => void) => {
    setter({ file: null, preview: null });
  };

  const triggerUpload = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  const handleSubmit = async () => {
    const hasAnyFile = rcFront.file || rcBack.file || insurance.file || panCard.file || bankDetails.file;
    if (!hasAnyFile) {
      toast({ title: "No Documents", description: "Please select at least one document to upload.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("vehicle_id", vehicleId);
      if (rcFront.file) formData.append("rc_copy", rcFront.file);
      if (rcBack.file) formData.append("rc_copy_back", rcBack.file);
      if (insurance.file) formData.append("insurance_policy_copy", insurance.file);
      if (panCard.file) formData.append("pan_card", panCard.file);
      if (bankDetails.file) formData.append("cheque_or_bank_details", bankDetails.file);

      const res = await fetch("/api/nxcar/sellform-documents-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      setSubmitted(true);
      setHasExistingDocs(true);
      toast({ title: "Documents Uploaded", description: "Your documents have been submitted successfully." });
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Documents Uploaded Successfully</p>
      </div>
    );
  }

  if (hasExistingDocs && existingDocs) {
    const docFields = [
      { key: "rc_copy", label: "RC Copy (Front)" },
      { key: "rc_copy_back", label: "RC Copy (Back)" },
      { key: "insurance_policy_copy", label: "Insurance Policy" },
      { key: "pan_card", label: "PAN Card" },
      { key: "cheque_or_bank_details", label: "Bank Details / Cheque" },
    ];

    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground mb-2">Documents have already been uploaded for this vehicle.</p>
        <div className="grid grid-cols-2 gap-3">
          {docFields.map(df => {
            const docUrl = existingDocs[df.key];
            if (!docUrl) return null;
            return (
              <div key={df.key} className="border border-border rounded-lg p-2" data-testid={`doc-view-${df.key}-${vehicleId}`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{df.label}</p>
                {typeof docUrl === "string" && (docUrl.endsWith(".jpg") || docUrl.endsWith(".png") || docUrl.endsWith(".jpeg") || docUrl.endsWith(".webp") || docUrl.includes("image")) ? (
                  <img src={docUrl} alt={df.label} className="w-full h-20 object-contain rounded" />
                ) : (
                  <a href={typeof docUrl === "string" ? docUrl : "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <Eye className="h-3 w-3" /> View Document
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Upload your documents for verification.</p>
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">RC Copy</p>
        <div className="grid grid-cols-2 gap-2">
          <MiniUploadArea id="rc_copy" label="Front" box={rcFront} fileInputRefs={fileInputRefs}
            onFileChange={(f) => handleFileChange("rc_copy", f, setRcFront)}
            onRemove={() => handleRemove("rc_copy", setRcFront)}
            onTrigger={() => triggerUpload("rc_copy")}
          />
          <MiniUploadArea id="rc_copy_back" label="Back" box={rcBack} fileInputRefs={fileInputRefs}
            onFileChange={(f) => handleFileChange("rc_copy_back", f, setRcBack)}
            onRemove={() => handleRemove("rc_copy_back", setRcBack)}
            onTrigger={() => triggerUpload("rc_copy_back")}
          />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">Insurance Policy</p>
        <MiniUploadArea id="insurance_policy_copy" label="" box={insurance} fileInputRefs={fileInputRefs}
          onFileChange={(f) => handleFileChange("insurance_policy_copy", f, setInsurance)}
          onRemove={() => handleRemove("insurance_policy_copy", setInsurance)}
          onTrigger={() => triggerUpload("insurance_policy_copy")}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">PAN Card</p>
        <MiniUploadArea id="pan_card" label="" box={panCard} fileInputRefs={fileInputRefs}
          onFileChange={(f) => handleFileChange("pan_card", f, setPanCard)}
          onRemove={() => handleRemove("pan_card", setPanCard)}
          onTrigger={() => triggerUpload("pan_card")}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">Bank Details / Cancelled Cheque</p>
        <MiniUploadArea id="cheque_or_bank_details" label="" box={bankDetails} fileInputRefs={fileInputRefs}
          onFileChange={(f) => handleFileChange("cheque_or_bank_details", f, setBankDetails)}
          onRemove={() => handleRemove("cheque_or_bank_details", setBankDetails)}
          onTrigger={() => triggerUpload("cheque_or_bank_details")}
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={submitting}
        size="sm"
        className="w-full text-xs font-semibold bg-primary hover:bg-primary/90"
        data-testid={`button-submit-docs-${vehicleId}`}
      >
        {submitting ? <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading...</> : "Submit Documents"}
      </Button>
    </div>
  );
}

function MiniUploadArea({ id, label, box, fileInputRefs, onFileChange, onRemove, onTrigger }: {
  id: string;
  label: string;
  box: UploadBox;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  onTrigger: () => void;
}) {
  return (
    <div data-testid={`mini-upload-${id}`}>
      <input
        ref={(el) => { fileInputRefs.current[id] = el; }}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
        }}
        data-testid={`input-mini-file-${id}`}
      />
      {!box.file ? (
        <button
          onClick={onTrigger}
          className="w-full bg-muted rounded-lg py-5 flex flex-col items-center gap-1 hover:bg-muted/70 transition-all cursor-pointer border border-dashed border-border"
          data-testid={`button-mini-upload-${id}`}
        >
          <Upload className="w-4 h-4 text-muted-foreground" />
          {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
        </button>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-muted border border-border">
          {box.preview ? (
            <img src={box.preview} alt={label || id} className="w-full h-16 object-contain" />
          ) : (
            <div className="flex items-center gap-2 px-3 py-3 justify-center">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-[10px] text-foreground truncate max-w-[80px]">{box.file.name}</span>
            </div>
          )}
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
            data-testid={`button-mini-remove-${id}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function CarDetailsAccordion({ car }: { car: any }) {
  const vehicleId = car.vehicle_id || car.id;
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (section: string) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  return (
    <div
      className="space-y-2 mt-1"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      data-testid={`all-details-${vehicleId}`}
    >
      <p className="text-xs font-bold text-foreground uppercase tracking-wider px-1">All Details</p>
      <AccordionSection
        title="Edit Car Details"
        isOpen={openSection === "edit"}
        onToggle={() => toggle("edit")}
        testId={`accordion-edit-${vehicleId}`}
      >
        <EditCarDetailsSection car={car} />
      </AccordionSection>

      <AccordionSection
        title="Status"
        isOpen={openSection === "status"}
        onToggle={() => toggle("status")}
        testId={`accordion-status-${vehicleId}`}
      >
        <StatusSection car={car} />
      </AccordionSection>

      <AccordionSection
        title="Upload Documents"
        isOpen={openSection === "documents"}
        onToggle={() => toggle("documents")}
        testId={`accordion-documents-${vehicleId}`}
      >
        <UploadDocumentsSection car={car} />
      </AccordionSection>
    </div>
  );
}
