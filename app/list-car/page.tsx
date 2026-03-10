"use client";

import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Store,
} from "lucide-react";
import LoginModal from "@components/login-modal";
import { ListSuccessView } from "@components/list-car/list-success-view";
import { ListSummaryBadges } from "@components/list-car/list-summary-badges";
import { ListSteps } from "@components/list-car/list-steps";
import { STEPS } from "@components/list-car/list-constants";
import { useListCarForm } from "@hooks/use-list-car-form";

export default function ListCarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ListCar />
    </Suspense>
  );
}

function ListCar() {
  const {
    authLoading,
    isAuthenticated,
    isDealer,
    showLoginModal,
    setShowLoginModal,
    pendingSubmitAfterLogin,
    handleLoginSuccess,

    currentStep,
    currentStepIndex,
    progress,
    direction,
    formData,
    updateField,
    vehicleData,
    searchQuery,
    setSearchQuery,
    submittedVehicleId,
    isLookingUp,

    showCityPicker,
    setShowCityPicker,
    citySearchQuery,
    setCitySearchQuery,

    uploadedImages,
    isUploading,
    handleImageUpload,
    removeImage,

    makesLoading,
    filteredMakes,
    selectMake,
    modelsLoading,
    filteredModels,
    selectModel,
    fuelTypes,
    fuelTypesLoading,
    years,
    yearsLoading,
    variantsLoading,
    filteredVariants,
    selectVariant,
    filteredSellCities,
    sellCitiesLoading,

    canProceed,
    handleNext,
    handleBack,
    resetForm,
    sellCarMutation,
  } = useListCarForm();

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:from-[#0a0f14] dark:via-[#0d1318] dark:to-primary/10">
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !isDealer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:from-[#0a0f14] dark:via-[#0d1318] dark:to-primary/10">
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-teal-500/20 flex items-center justify-center">
              <Store className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3" data-testid="text-dealer-only-heading">
              Dealer Access Only
            </h1>
            <p className="text-muted-foreground mb-6">
              This page is exclusively for registered Nxcar dealers. Please log in with your dealer account to list cars directly.
            </p>
            <Button
              onClick={() => window.location.href = "/partner"}
              data-testid="button-dealer-login"
              className="bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white px-8 py-3 rounded-xl"
            >
              Go to Dealer Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:from-[#0a0f14] dark:via-[#0d1318] dark:to-primary/10">
      <Navbar />

      <main className="pt-20 min-h-screen flex flex-col">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        {currentStep !== "success" && (
          <div className="w-full bg-muted/50 h-2 relative z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-teal-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              {currentStep === "success" ? (
                <ListSuccessView
                  formData={formData}
                  submittedVehicleId={submittedVehicleId}
                  uploadedImages={uploadedImages}
                  resetForm={resetForm}
                />
              ) : (
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-cyan-500/20 text-primary text-sm font-semibold mb-4 border border-primary/20"
                    >
                      <Store className="w-4 h-4" />
                      Dealer Listing • Step {currentStepIndex + 1} of {STEPS.length}
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                      {STEPS[currentStepIndex]?.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {STEPS[currentStepIndex]?.subtitle}
                    </p>
                  </div>

                  {currentStep !== "vehicle-number" && (
                    <ListSummaryBadges formData={formData} />
                  )}

                  <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg">
                    <ListSteps
                      currentStep={currentStep}
                      formData={formData}
                      updateField={updateField}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      vehicleData={vehicleData}
                      filteredMakes={filteredMakes}
                      makesLoading={makesLoading}
                      selectMake={selectMake}
                      filteredModels={filteredModels}
                      modelsLoading={modelsLoading}
                      selectModel={selectModel}
                      fuelTypes={fuelTypes}
                      fuelTypesLoading={fuelTypesLoading}
                      years={years}
                      yearsLoading={yearsLoading}
                      filteredVariants={filteredVariants}
                      variantsLoading={variantsLoading}
                      selectVariant={selectVariant}
                      showCityPicker={showCityPicker}
                      setShowCityPicker={setShowCityPicker}
                      citySearchQuery={citySearchQuery}
                      setCitySearchQuery={setCitySearchQuery}
                      filteredSellCities={filteredSellCities}
                      sellCitiesLoading={sellCitiesLoading}
                      uploadedImages={uploadedImages}
                      handleImageUpload={handleImageUpload}
                      removeImage={removeImage}
                      isUploading={isUploading}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    {currentStepIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="h-14 px-6 rounded-xl border-2 border-border text-foreground hover:bg-muted"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed() || isLookingUp || sellCarMutation.isPending}
                      data-testid="button-next-step"
                      className="flex-1 h-14 bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-foreground font-semibold text-lg rounded-xl disabled:opacity-50"
                    >
                      {isLookingUp || sellCarMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : null}
                      {currentStep === "seller-info"
                        ? "List Car Now"
                        : currentStep === "vehicle-number" && formData.vehicleNumber
                          ? "Fetch Details"
                          : "Continue"}
                      {!isLookingUp && !sellCarMutation.isPending && currentStep !== "seller-info" && (
                        <ArrowRight className="w-5 h-5 ml-2" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <LoginModal
        open={showLoginModal}
        onOpenChange={(open) => {
          setShowLoginModal(open);
          if (!open) pendingSubmitAfterLogin.current = false;
        }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
