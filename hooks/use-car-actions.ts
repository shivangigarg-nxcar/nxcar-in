"use client";

import { useState, useCallback } from "react";
import type { CarDetail } from "@components/car-detail/car-detail-types";

function getUserId(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem("authState");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.nxcar_user_id || parsed.user_id || "";
    } catch {}
  }
  return "";
}

function getNxcarUserId(): string {
  if (typeof window === "undefined") return "";
  const direct = localStorage.getItem("nxcar_user_id");
  if (direct) return direct;
  const stored = localStorage.getItem("authState");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.nxcar_user_id) return String(parsed.nxcar_user_id);
    } catch {}
  }
  return "";
}

export function useCarActions(car: CarDetail | undefined) {
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<{
    predicted_price: string;
    suggested_prices: string[];
    highest_offer: number;
    total_offers: number;
  } | null>(null);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerResult, setOfferResult] = useState<"success" | "error" | null>(null);
  const [offerError, setOfferError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackResult, setCallbackResult] = useState<{
    status: boolean;
    message: string;
    callback_requested: number;
  } | null>(null);
  const [callbackError, setCallbackError] = useState("");

  const handleMakeOfferClick = useCallback(async () => {
    if (!car) return;
    setOfferModalOpen(true);
    setOfferLoading(true);
    setSelectedOffer("");
    setOfferResult(null);
    setOfferError("");
    setPredictionData(null);

    try {
      const res = await fetch("/api/nxcar/prediction-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: car.id,
          prediction_price: car.predictionPrice || String(car.price),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPredictionData(data);
      } else {
        setOfferError(
          "Unable to load price suggestions. You can still enter your offer manually.",
        );
        setPredictionData({
          predicted_price: String(car.price),
          suggested_prices: [],
          highest_offer: 0,
          total_offers: 0,
        });
      }
    } catch {
      setOfferError("Unable to load price suggestions.");
      setPredictionData({
        predicted_price: String(car.price),
        suggested_prices: [],
        highest_offer: 0,
        total_offers: 0,
      });
    } finally {
      setOfferLoading(false);
    }
  }, [car]);

  const handleSubmitOffer = useCallback(async () => {
    if (!car || !selectedOffer) return;
    const userId = getUserId();
    if (!userId) {
      setOfferError("Please log in to make an offer.");
      return;
    }

    setOfferSubmitting(true);
    setOfferError("");

    try {
      const res = await fetch("/api/nxcar/make-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: car.id,
          user_id: userId,
          offer_amount: selectedOffer,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOfferResult("success");
      } else {
        setOfferResult("error");
        setOfferError(
          data.error || "Failed to submit your offer. Please try again.",
        );
      }
    } catch {
      setOfferResult("error");
      setOfferError("Something went wrong. Please try again.");
    } finally {
      setOfferSubmitting(false);
    }
  }, [car, selectedOffer]);

  const submitCallbackRequest = useCallback(async (userId: string) => {
    if (!car) return;
    setCallbackLoading(true);
    setCallbackResult(null);
    setCallbackError("");

    try {
      const res = await fetch("/api/nxcar/request-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          vehicle_id: car.id,
        }),
      });
      const data = await res.json();
      setCallbackResult(data);
    } catch {
      setCallbackError("Something went wrong. Please try again.");
    } finally {
      setCallbackLoading(false);
    }
  }, [car]);

  const handleRequestCallback = useCallback(() => {
    if (!car) return;
    const nxcarUserId = getNxcarUserId();
    if (!nxcarUserId) {
      setShowLoginModal(true);
      return;
    }
    submitCallbackRequest(nxcarUserId);
  }, [car, submitCallbackRequest]);

  const handleOfferModalClose = useCallback((open: boolean) => {
    setOfferModalOpen(open);
    if (!open) {
      setOfferResult(null);
      setOfferError("");
      setSelectedOffer("");
    }
  }, []);

  const handleOfferRetry = useCallback(() => {
    setOfferResult(null);
    setOfferError("");
  }, []);

  const handleCallbackDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setCallbackResult(null);
      setCallbackError("");
    }
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setShowLoginModal(false);
    const nxcarUserId = getNxcarUserId();
    if (nxcarUserId) {
      submitCallbackRequest(nxcarUserId);
    }
  }, [submitCallbackRequest]);

  return {
    offerModalOpen,
    offerLoading,
    predictionData,
    selectedOffer,
    setSelectedOffer,
    offerSubmitting,
    offerResult,
    offerError,
    showLoginModal,
    setShowLoginModal,
    callbackLoading,
    callbackResult,
    callbackError,
    handleMakeOfferClick,
    handleSubmitOffer,
    handleRequestCallback,
    handleOfferModalClose,
    handleOfferRetry,
    handleCallbackDialogClose,
    handleLoginSuccess,
  };
}
