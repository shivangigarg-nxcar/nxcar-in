'use client';

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, Loader2, Pencil, CheckCircle2, FileText, Plus, X, Eye, Upload, ImagePlus } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
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

interface DropdownOption {
  id: string | number;
  name: string;
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

  const [existingImages, setExistingImages] = useState<{ image_id: string; image_url: string; is_primary: string }[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const [makes, setMakes] = useState<DropdownOption[]>([]);
  const [models, setModels] = useState<DropdownOption[]>([]);
  const [variants, setVariants] = useState<DropdownOption[]>([]);
  const [cities, setCities] = useState<DropdownOption[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const fields: EditableField[] = [
    { key: "make", label: "Brand", value: car.make || car.brandName || "", type: "select" },
    { key: "model", label: "Model", value: car.model || car.modelName || "", type: "select" },
    { key: "variant", label: "Variant", value: car.variant || "", type: "select" },
    { key: "year", label: "Year", value: car.year || "" },
    { key: "color", label: "Color", value: car.color || "" },
    { key: "fuel_type", label: "Fuel Type", value: car.fuel_type || car.fule_type || car.fuelType || "", type: "select", options: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] },
    { key: "transmission", label: "Transmission", value: car.transmission || "", type: "select", options: ["Manual", "Automatic"] },
    { key: "mileage", label: "KMs Driven", value: car.mileage || car.kilometers || "", type: "number" },
    { key: "ownership", label: "Ownership", value: car.ownership || "", type: "select", options: ["1", "2", "3", "4", "5"] },
    { key: "expected_selling_price", label: "Expected Price", value: car.expected_selling_price || car.price || "", type: "number" },
    { key: "location_name", label: "Location", value: car.location_name || car.city_name || "", type: "select" },
    { key: "rto_code", label: "RTO Code", value: car.rto_code || (car.state_code && car.rto_number ? `${car.state_code}${car.rto_number}` : "") },
    { key: "rto_location", label: "RTO Location", value: car.rto_location || "" },
    { key: "seats", label: "Seats", value: car.seats || "" },
  ];

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data: Record<string, string> = {};
    fields.forEach(f => { data[f.key] = f.value; });
    data["make_id"] = car.make_id || "";
    data["model_id"] = car.model_id || "";
    data["variant_id"] = car.variant_id || "";
    data["location"] = car.location || "";
    return data;
  });

  const fetchMakes = useCallback(async () => {
    setLoadingMakes(true);
    try {
      const res = await fetch("/api/nxcar/makes");
      if (res.ok) {
        const data = await res.json();
        setMakes(data.map((m: any) => ({ id: m.id, name: m.make_name })));
      }
    } catch (e) {} finally { setLoadingMakes(false); }
  }, []);

  const fetchModels = useCallback(async (makeId: string) => {
    if (!makeId) { setModels([]); return; }
    setLoadingModels(true);
    try {
      const res = await fetch(`/api/nxcar/models?make_id=${makeId}`);
      if (res.ok) {
        const data = await res.json();
        setModels(data.map((m: any) => ({ id: m.id, name: m.model_name })));
      }
    } catch (e) {} finally { setLoadingModels(false); }
  }, []);

  const fetchVariants = useCallback(async (modelId: string, fuelType: string) => {
    if (!modelId || !fuelType) { setVariants([]); return; }
    setLoadingVariants(true);
    try {
      const res = await fetch(`/api/nxcar/variants?model_id=${modelId}&fuel_type=${fuelType}`);
      if (res.ok) {
        const data = await res.json();
        setVariants(data.map((v: any) => ({ id: v.id, name: v.variant_name })));
      }
    } catch (e) {} finally { setLoadingVariants(false); }
  }, []);

  const fetchCities = useCallback(async () => {
    setLoadingCities(true);
    try {
      const res = await fetch("/api/nxcar/cities");
      if (res.ok) {
        const data = await res.json();
        setCities(data.map((c: any) => ({ id: c.city_id, name: c.city_name })));
      }
    } catch (e) {} finally { setLoadingCities(false); }
  }, []);

  const fetchExistingImages = useCallback(async () => {
    setLoadingImages(true);
    try {
      const res = await fetch(`/api/nxcar/get-images?vehicle_id=${vehicleId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.images && Array.isArray(data.images)) {
          setExistingImages(data.images);
        }
      }
    } catch (e) {} finally { setLoadingImages(false); }
  }, [vehicleId]);

  const startEditing = useCallback(() => {
    setEditing(true);
    fetchMakes();
    fetchModels(formData.make_id);
    fetchVariants(formData.model_id, formData.fuel_type);
    fetchCities();
    fetchExistingImages();
  }, [fetchMakes, fetchModels, fetchVariants, fetchCities, fetchExistingImages, formData.make_id, formData.model_id, formData.fuel_type]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleMakeChange = (makeName: string) => {
    const selected = makes.find(m => m.name === makeName);
    setFormData(prev => ({
      ...prev,
      make: makeName,
      make_id: selected ? String(selected.id) : prev.make_id,
      model: "",
      model_id: "",
      variant: "",
      variant_id: "",
    }));
    setModels([]);
    setVariants([]);
    if (selected) fetchModels(String(selected.id));
  };

  const handleModelChange = (modelName: string) => {
    const selected = models.find(m => m.name === modelName);
    setFormData(prev => ({
      ...prev,
      model: modelName,
      model_id: selected ? String(selected.id) : prev.model_id,
      variant: "",
      variant_id: "",
    }));
    setVariants([]);
    if (selected) fetchVariants(String(selected.id), formData.fuel_type);
  };

  const handleVariantChange = (variantName: string) => {
    const selected = variants.find(v => v.name === variantName);
    setFormData(prev => ({
      ...prev,
      variant: variantName,
      variant_id: selected ? String(selected.id) : prev.variant_id,
    }));
  };

  const handleFuelTypeChange = (fuelType: string) => {
    setFormData(prev => ({ ...prev, fuel_type: fuelType, variant: "", variant_id: "" }));
    setVariants([]);
    if (formData.model_id) fetchVariants(formData.model_id, fuelType);
  };

  const handleLocationChange = (cityName: string) => {
    const selected = cities.find(c => c.name === cityName);
    setFormData(prev => ({
      ...prev,
      location_name: cityName,
      location: selected ? String(selected.id) : prev.location,
    }));
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

      const payload: Record<string, any> = { ...car };

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

  const renderField = (f: EditableField) => {
    if (f.key === "make") {
      return (
        <Select value={formData.make} onValueChange={handleMakeChange} data-testid={`select-edit-make-${vehicleId}`}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select Brand" />
          </SelectTrigger>
          <SelectContent>
            {loadingMakes ? (
              <div className="flex items-center justify-center py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : makes.length > 0 ? makes.map(m => (
              <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
            )) : (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">No brands found</div>
            )}
          </SelectContent>
        </Select>
      );
    }
    if (f.key === "model") {
      return (
        <Select value={formData.model} onValueChange={handleModelChange} data-testid={`select-edit-model-${vehicleId}`}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {loadingModels ? (
              <div className="flex items-center justify-center py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : models.length > 0 ? models.map(m => (
              <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
            )) : (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">Select a brand first</div>
            )}
          </SelectContent>
        </Select>
      );
    }
    if (f.key === "variant") {
      return (
        <Select value={formData.variant} onValueChange={handleVariantChange} data-testid={`select-edit-variant-${vehicleId}`}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select Variant" />
          </SelectTrigger>
          <SelectContent>
            {loadingVariants ? (
              <div className="flex items-center justify-center py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : variants.length > 0 ? variants.map(v => (
              <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>
            )) : (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">Select a model first</div>
            )}
          </SelectContent>
        </Select>
      );
    }
    if (f.key === "location_name") {
      return (
        <Select value={formData.location_name} onValueChange={handleLocationChange} data-testid={`select-edit-location-${vehicleId}`}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            {loadingCities ? (
              <div className="flex items-center justify-center py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : cities.length > 0 ? cities.map(c => (
              <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
            )) : (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">No cities found</div>
            )}
          </SelectContent>
        </Select>
      );
    }
    if (f.key === "fuel_type") {
      return (
        <Select value={formData.fuel_type} onValueChange={handleFuelTypeChange} data-testid={`select-edit-fuel_type-${vehicleId}`}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            {(f.options || []).map(opt => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    if (f.options) {
      return (
        <Select value={formData[f.key]} onValueChange={(val) => handleChange(f.key, val)} data-testid={`select-edit-${f.key}-${vehicleId}`}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder={`Select ${f.label}`} />
          </SelectTrigger>
          <SelectContent>
            {f.options.map(opt => (
              <SelectItem key={opt} value={opt}>{f.key === "ownership" ? `${opt}${opt === "1" ? "st" : opt === "2" ? "nd" : opt === "3" ? "rd" : "th"} Owner` : opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return (
      <Input
        type={f.type || "text"}
        value={formData[f.key]}
        onChange={e => handleChange(f.key, e.target.value)}
        className="h-8 text-sm"
        data-testid={`input-edit-${f.key}-${vehicleId}`}
      />
    );
  };

  return (
    <div className="space-y-3">
      {!editing ? (
        <>
          <div className="flex justify-end -mt-1 mb-1">
            <Button
              onClick={startEditing}
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5"
              data-testid={`button-start-edit-${vehicleId}`}
            >
              <Pencil className="h-3 w-3" /> Edit Details
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {fields.map(f => (
              <div key={f.key}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{f.label}</p>
                <p className="text-sm text-foreground font-medium" data-testid={`text-detail-${f.key}-${vehicleId}`}>{formData[f.key] || "—"}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{f.label}</label>
                {renderField(f)}
              </div>
            ))}
          </div>

          <div className="mt-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Photos</p>
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
              {loadingImages && (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Loading...</span>
                </div>
              )}
              {existingImages.map((img) => (
                <div key={img.image_id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border" data-testid={`existing-img-${img.image_id}`}>
                  <img src={img.image_url} alt="Car" className="w-full h-full object-cover" />
                  {img.is_primary === "1" && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[7px] text-white text-center py-0.5">Primary</span>
                  )}
                </div>
              ))}
              {imagePreviews.map((preview, i) => (
                <div key={`new-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-green-500/50">
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
                resetData["make_id"] = car.make_id || "";
                resetData["model_id"] = car.model_id || "";
                resetData["variant_id"] = car.variant_id || "";
                resetData["location"] = car.location || "";
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
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [rcFront, setRcFront] = useState<UploadBox>({ file: null, preview: null });
  const [rcBack, setRcBack] = useState<UploadBox>({ file: null, preview: null });
  const [insurance, setInsurance] = useState<UploadBox>({ file: null, preview: null });
  const [panCard, setPanCard] = useState<UploadBox>({ file: null, preview: null });
  const [bankDetails, setBankDetails] = useState<UploadBox>({ file: null, preview: null });

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("vehicle_id", vehicleId);
      if (createdBy) params.append("created_by", createdBy);

      const res = await fetch(`/api/nxcar/sellform-documents-fetch?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        console.log("Documents fetch response:", JSON.stringify(data));
        
        let docs: any = null;
        if (data?.data && typeof data.data === 'object') {
          if (Array.isArray(data.data) && data.data.length > 0) {
            docs = data.data[0];
          } else if (!Array.isArray(data.data)) {
            docs = data.data;
          }
        } else if (data?.documents && typeof data.documents === 'object') {
          if (Array.isArray(data.documents) && data.documents.length > 0) {
            docs = data.documents[0];
          } else if (!Array.isArray(data.documents)) {
            docs = data.documents;
          }
        } else if (data?.result && typeof data.result === 'object') {
          if (Array.isArray(data.result) && data.result.length > 0) {
            docs = data.result[0];
          } else if (!Array.isArray(data.result)) {
            docs = data.result;
          }
        } else if (Array.isArray(data) && data.length > 0) {
          docs = data[0];
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          const docKeys = ['rc_copy', 'rc_copy_back', 'insurance_policy_copy', 'pan_card', 'cheque_or_bank_details'];
          const hasDocKey = docKeys.some(k => k in data);
          if (hasDocKey) {
            docs = data;
          } else {
            const values = Object.values(data);
            if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
              const nested = values[0] as any;
              if (docKeys.some(k => k in nested)) {
                docs = nested;
              }
            }
          }
        }

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
  }, [vehicleId, createdBy]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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

      toast({ title: "Documents Uploaded", description: "Your documents have been submitted successfully." });
      await fetchDocuments();
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
      onClick={(e) => { e.stopPropagation(); }}
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
