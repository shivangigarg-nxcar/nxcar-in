'use client';

import { useState } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { useToast } from "@hooks/use-toast";
import { ChallanSearchForm } from "@components/challan-check/challan-search-form";
import { ChallanResults } from "@components/challan-check/challan-results";
import { ChallanGuide } from "@components/challan-check/challan-guide";

export default function ChallanCheck() {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [challans, setChallans] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!vehicleNumber.trim()) {
      toast({ title: "Please enter your vehicle number", variant: "destructive" });
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      toast({ title: "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/nxcar/dealer-login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phoneNumber.trim() }),
      });
      const data = await res.json();
      if (data.status === true || data.success) {
        setOtpSent(true);
        toast({ title: "OTP sent to +91 " + phoneNumber.trim() });
      } else {
        toast({ title: "Error", description: data.message || "Failed to send OTP", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast({ title: "Please enter a valid OTP", variant: "destructive" });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/nxcar/dealer-login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phoneNumber.trim(), otp }),
      });
      const data = await res.json();
      const token = data.access_token || data.data?.access_token || data.token;
      if (token) {
        const userId = data.user_id || data.data?.user_id || data.id;
        if (userId) {
          localStorage.setItem("nxcar_user_id", String(userId));
        }
        setVerified(true);
        setOtpSent(false);
        setOtp("");
        toast({ title: "Verified! Checking challans..." });
        await submitChallanCheck(token, userId ? String(userId) : undefined);
      } else {
        toast({ title: "Error", description: data.message || "Invalid OTP", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to verify OTP", variant: "destructive" });
    } finally {
      setOtpLoading(false);
    }
  };

  const submitChallanCheck = async (authToken: string, userIdOverride?: string) => {
    setLoading(true);
    setSearched(false);
    setChallans([]);
    try {
      const userId = userIdOverride || (typeof window !== "undefined" ? localStorage.getItem("nxcar_user_id") || "" : "");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken) {
        headers["x-auth-token"] = authToken;
      }
      const res = await fetch("/api/nxcar/challan-check", {
        method: "POST",
        headers,
        body: JSON.stringify({
          vehicle_number: vehicleNumber.replace(/\s/g, "").trim(),
          phone_number: phoneNumber.trim(),
          ...(userId ? { user_id: userId } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.message === "Authentication failed") {
        toast({ title: "Error", description: data.message || "Failed to fetch challan data", variant: "destructive" });
        return;
      }
      setChallans(Array.isArray(data.data) ? data.data : (Array.isArray(data.challans) ? data.challans : []));
      setSearched(true);
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-14">
        <ChallanSearchForm
          vehicleNumber={vehicleNumber}
          setVehicleNumber={setVehicleNumber}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          loading={loading}
          otpSent={otpSent}
          otp={otp}
          setOtp={setOtp}
          otpLoading={otpLoading}
          verified={verified}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />
        {searched && <ChallanResults challans={challans} />}
        <ChallanGuide />
      </main>
      <Footer />
    </div>
  );
}
