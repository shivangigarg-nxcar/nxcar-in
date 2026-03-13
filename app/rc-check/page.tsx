'use client';

import { useState } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { useToast } from "@hooks/use-toast";
import { RcSearchForm } from "@components/rc-check/rc-search-form";
import { RcDetailView } from "@components/rc-check/rc-detail-view";
import { RcInfoSections } from "@components/rc-check/rc-info-sections";

export default function RCCheck() {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
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
        toast({ title: "Verified! Checking RC details..." });
        await submitRcCheck(token);
      } else {
        toast({ title: "Error", description: data.message || "Invalid OTP", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to verify OTP", variant: "destructive" });
    } finally {
      setOtpLoading(false);
    }
  };

  const submitRcCheck = async (authToken: string) => {
    setLoading(true);
    setSearched(false);
    setVehicleData(null);
    try {
      const crmRes = await fetch("/api/nxcar/rc-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authToken,
        },
        body: JSON.stringify({
          phone_number: phoneNumber.trim(),
          vehicle_number: vehicleNumber.replace(/\s/g, "").trim(),
        }),
      });

      if (!crmRes.ok) {
        const crmData = await crmRes.json();
        toast({ title: "Error", description: crmData.message || "Failed to submit RC query", variant: "destructive" });
        return;
      }

      const lookupRes = await fetch(`/api/vehicle-lookup/${encodeURIComponent(vehicleNumber.replace(/\s/g, "").trim())}`);
      const lookupData = await lookupRes.json();

      if (!lookupRes.ok) {
        throw new Error(lookupData.error || "Failed to fetch vehicle details");
      }
      setVehicleData(lookupData);
      setSearched(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to fetch vehicle details", variant: "destructive" });
      setVehicleData(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-14">
        <RcSearchForm
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
        {searched && <RcDetailView vehicleData={vehicleData} />}
        <RcInfoSections />
      </main>
      <Footer />
    </div>
  );
}
