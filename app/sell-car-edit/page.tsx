'use client';

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { useToast } from "@hooks/use-toast";
import { useUpload } from "@hooks/use-upload";
import { updateCarListing, deleteCarListing } from "@lib/api";
import {
  Car, Loader2, ArrowLeft, Trash2, Save, AlertTriangle
} from "lucide-react";
import { CarDetailsSection } from "@components/sell-car-edit/car-details-section";
import { PhotosSection } from "@components/sell-car-edit/photos-section";
import { RcDetailsSection } from "@components/sell-car-edit/rc-details-section";
import { InsuranceSection } from "@components/sell-car-edit/insurance-section";
import { OtherDocsSection } from "@components/sell-car-edit/other-docs-section";
import { SellerInfoSection } from "@components/sell-car-edit/seller-info-section";
import { DeleteDialog } from "@components/sell-car-edit/delete-dialog";

export default function SellCarEdit() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
        </div>
      </div>
    }>
      <SellCarEditContent />
    </Suspense>
  );
}

function SellCarEditContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicle_id");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    carDetails: true,
    photos: false,
    rcDetails: false,
    insurance: false,
    otherDocs: false,
    seller: false,
  });

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    brand: "",
    model: "",
    variant: "",
    year: 0,
    fuelType: "",
    transmission: "",
    kilometers: 0,
    color: "",
    ownerCount: 1,
    location: "",
    state: "",
    rtoCode: "",
    expectedPrice: 0,
    description: "",
    rcStatus: "",
    engineNumber: "",
    chassisNumber: "",
    rcDocumentUrl: "",
    insuranceValid: false,
    insuranceDocumentUrl: "",
    otherDocumentUrls: [] as string[],
    hideNumberPlate: false,
    removeWatermark: false,
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      if (uploadedImages.length < 5) {
        setUploadedImages(prev => [...prev, response.objectPath]);
      }
    },
    onError: (error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const { uploadFile: uploadRcDoc, isUploading: isUploadingRc } = useUpload({
    onSuccess: (response) => {
      setFormData(prev => ({ ...prev, rcDocumentUrl: response.objectPath }));
      toast({ title: "RC Document uploaded" });
    },
    onError: (error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const { uploadFile: uploadInsuranceDoc, isUploading: isUploadingInsurance } = useUpload({
    onSuccess: (response) => {
      setFormData(prev => ({ ...prev, insuranceDocumentUrl: response.objectPath }));
      toast({ title: "Insurance Document uploaded" });
    },
    onError: (error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const { uploadFile: uploadOtherDoc, isUploading: isUploadingOther } = useUpload({
    onSuccess: (response) => {
      setFormData(prev => ({
        ...prev,
        otherDocumentUrls: [...prev.otherDocumentUrls, response.objectPath],
      }));
      toast({ title: "Document uploaded" });
    },
    onError: (error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ["car-listing", vehicleId],
    queryFn: async () => {
      const res = await fetch(`/api/car-listings/${vehicleId}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!vehicleId,
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        vehicleNumber: listing.vehicleNumber || "",
        brand: listing.brand || "",
        model: listing.model || "",
        variant: listing.variant || "",
        year: listing.year || 0,
        fuelType: listing.fuelType || "",
        transmission: listing.transmission || "",
        kilometers: listing.kilometers || 0,
        color: listing.color || "",
        ownerCount: listing.ownerCount || 1,
        location: listing.location || "",
        state: listing.state || "",
        rtoCode: listing.rtoCode || "",
        expectedPrice: listing.expectedPrice || 0,
        description: listing.description || "",
        rcStatus: listing.rcStatus || "",
        engineNumber: listing.engineNumber || "",
        chassisNumber: listing.chassisNumber || "",
        rcDocumentUrl: listing.rcDocumentUrl || "",
        insuranceValid: listing.insuranceValid || false,
        insuranceDocumentUrl: listing.insuranceDocumentUrl || "",
        otherDocumentUrls: listing.otherDocumentUrls || [],
        hideNumberPlate: listing.hideNumberPlate || false,
        removeWatermark: listing.removeWatermark || false,
        sellerName: listing.sellerName || "",
        sellerPhone: listing.sellerPhone || "",
        sellerEmail: listing.sellerEmail || "",
      });
      setUploadedImages(listing.imageUrls || []);
    }
  }, [listing]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 5 - uploadedImages.length;
    if (remaining <= 0) {
      toast({ title: "Max 5 images allowed", variant: "destructive" });
      return;
    }
    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.type.startsWith('image/')) {
        await uploadFile(file);
      }
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRcDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadRcDoc(file);
    e.target.value = '';
  };

  const handleInsuranceDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadInsuranceDoc(file);
    e.target.value = '';
  };

  const handleOtherDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadOtherDoc(file);
    e.target.value = '';
  };

  const removeOtherDoc = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherDocumentUrls: prev.otherDocumentUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.brand || !formData.model || !formData.sellerName || !formData.sellerPhone) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateCarListing(parseInt(vehicleId!), {
        brand: formData.brand,
        model: formData.model,
        variant: formData.variant,
        year: formData.year,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        kilometers: formData.kilometers,
        color: formData.color,
        ownerCount: formData.ownerCount,
        location: formData.location,
        state: formData.state,
        rtoCode: formData.rtoCode,
        expectedPrice: formData.expectedPrice,
        description: formData.description,
        imageUrls: uploadedImages,
        rcStatus: formData.rcStatus,
        engineNumber: formData.engineNumber,
        chassisNumber: formData.chassisNumber,
        rcDocumentUrl: formData.rcDocumentUrl,
        insuranceValid: formData.insuranceValid,
        insuranceDocumentUrl: formData.insuranceDocumentUrl,
        otherDocumentUrls: formData.otherDocumentUrls,
        hideNumberPlate: formData.hideNumberPlate,
        removeWatermark: formData.removeWatermark,
        sellerName: formData.sellerName,
        sellerPhone: formData.sellerPhone,
        sellerEmail: formData.sellerEmail,
      });
      toast({ title: "Listing Updated!", description: "Your changes have been saved." });
      router.push("/my-cars");
    } catch (error) {
      toast({ title: "Update Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    try {
      await deleteCarListing(parseInt(vehicleId!));
      toast({ title: "Listing deleted" });
      router.push("/my-cars");
    } catch (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return "";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="sell-car-edit-page">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin" data-testid="loading-spinner" />
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen bg-background" data-testid="sell-car-edit-page">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <AlertTriangle className="w-16 h-16 text-yellow-500" />
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-not-found">Listing not found</h2>
          <p className="text-muted-foreground">The car listing you&apos;re looking for doesn&apos;t exist.</p>
          <Button
            onClick={() => router.push("/my-cars")}
            variant="outline"
            className="border-teal-500/50 text-teal-500 hover:bg-teal-500/10"
            data-testid="link-back-my-cars"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Cars
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="sell-car-edit-page">
      <Navbar />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
              <Car className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-teal-500 font-medium">Edit Listing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2" data-testid="text-page-title">
              Edit Your <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Car Listing</span>
            </h1>
            <p className="text-muted-foreground text-lg" data-testid="text-page-subtitle">
              Update your car details, photos, and documents
            </p>
            {formData.vehicleNumber && (
              <Badge variant="outline" className="mt-3 border-teal-500/30 text-teal-500">
                {formData.vehicleNumber}
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      <main className="relative z-10 max-w-3xl mx-auto px-4 pb-20 space-y-4" data-testid="edit-form">

        <CarDetailsSection
          formData={formData}
          updateField={updateField}
          formatPrice={formatPrice}
        />

        <PhotosSection
          isOpen={openSections.photos}
          onToggle={() => toggleSection("photos")}
          uploadedImages={uploadedImages}
          isUploading={isUploading}
          hideNumberPlate={formData.hideNumberPlate}
          removeWatermark={formData.removeWatermark}
          updateField={updateField}
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
        />

        <RcDetailsSection
          isOpen={openSections.rcDetails}
          onToggle={() => toggleSection("rcDetails")}
          formData={formData}
          updateField={updateField}
          isUploadingRc={isUploadingRc}
          onRcDocUpload={handleRcDocUpload}
        />

        <InsuranceSection
          isOpen={openSections.insurance}
          onToggle={() => toggleSection("insurance")}
          insuranceValid={formData.insuranceValid}
          insuranceDocumentUrl={formData.insuranceDocumentUrl}
          updateField={updateField}
          isUploadingInsurance={isUploadingInsurance}
          onInsuranceDocUpload={handleInsuranceDocUpload}
        />

        <OtherDocsSection
          isOpen={openSections.otherDocs}
          onToggle={() => toggleSection("otherDocs")}
          otherDocumentUrls={formData.otherDocumentUrls}
          isUploadingOther={isUploadingOther}
          onOtherDocUpload={handleOtherDocUpload}
          onRemoveOtherDoc={removeOtherDoc}
        />

        <SellerInfoSection
          isOpen={openSections.seller}
          onToggle={() => toggleSection("seller")}
          formData={formData}
          updateField={updateField}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl h-12"
            data-testid="button-update-listing"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? "Updating..." : "Update Listing"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400 py-3 rounded-xl h-12"
            data-testid="button-delete-listing"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Listing
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/my-cars")}
            className="text-muted-foreground hover:text-teal-500"
            data-testid="link-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Cars
          </Button>
        </motion.div>
      </main>

      {showDeleteDialog && (
        <DeleteDialog
          brand={formData.brand}
          model={formData.model}
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
        />
      )}

      <Footer />
    </div>
  );
}
