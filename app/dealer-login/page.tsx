'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Phone, ShieldCheck, Store, TrendingUp, Users } from "lucide-react";

const benefits = [
  { icon: Store, text: "Manage your dealership" },
  { icon: TrendingUp, text: "Track leads & sales" },
  { icon: Users, text: "Connect with buyers" },
  { icon: ShieldCheck, text: "Verified dealer badge" },
];

export default function DealerLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    setError("");
  }

  function handleOtpChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    setError("");
  }

  async function handleSendOtp() {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    if (!/^[6-9]/.test(phone)) {
      setError("Phone number must start with 6, 7, 8, or 9");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/nxcar/dealer-login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }
      setStep("otp");
      setSuccess("OTP sent successfully to +91 " + phone);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/nxcar/dealer-login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, otp, is_dealer: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid OTP. Please try again.");
        return;
      }
      const token = data.access_token || data.data?.access_token || data.token;
      if (token) {
        localStorage.setItem("dealer_access_token", token);
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      }
      if (data.user_id || data.data?.user_id || data.id) {
        localStorage.setItem("nxcar_user_id", String(data.user_id || data.data?.user_id || data.id));
      }
      const roleId = data.role_id || data.data?.role_id || "2";
      localStorage.setItem("nxcar_role_id", String(roleId));
      document.cookie = `role_id=${String(roleId)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dealers");
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col" data-testid="dealer-login-page">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-3" data-testid="text-dealer-welcome">
            Dealer Login
          </h1>
          <p className="text-slate-400 text-lg mb-10" data-testid="text-dealer-subtitle">
            {step === "phone"
              ? "Sign in with your registered dealer mobile number"
              : "Enter the OTP sent to your phone"}
          </p>

          {step === "phone" ? (
            <>
              <div className="mb-4">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="text-white font-medium px-4 py-3 bg-white/5 border-r border-white/10 select-none" data-testid="text-dealer-country-code">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendOtp();
                    }}
                    className="flex-1 bg-transparent text-white text-lg px-4 py-3 outline-none placeholder:text-slate-500"
                    maxLength={10}
                    data-testid="input-dealer-phone"
                  />
                  <Phone className="w-5 h-5 text-slate-400 mr-4" />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length !== 10}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-dealer-send-otp"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          ) : (
            <>
              <div className="mb-2 text-left">
                <p className="text-slate-400 text-sm mb-2">
                  OTP sent to +91 {phone}{" "}
                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-primary hover:underline ml-1"
                    data-testid="button-dealer-change-number"
                  >
                    Change
                  </button>
                </p>
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerifyOtp();
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-lg px-4 py-3 outline-none placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary text-center tracking-[0.5em]"
                  maxLength={6}
                  autoFocus
                  data-testid="input-dealer-otp"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 4}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-dealer-verify-otp"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Verifying...
                  </span>
                ) : (
                  "Verify & Login"
                )}
              </button>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="text-primary hover:underline text-sm disabled:opacity-50"
                data-testid="button-dealer-resend-otp"
              >
                Resend OTP
              </button>
            </>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-4" data-testid="text-dealer-error">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-sm mt-4" data-testid="text-dealer-success">
              {success}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 mb-10">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-3 text-left bg-white/5 rounded-lg p-4"
                data-testid={`dealer-benefit-${b.text.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <b.icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-slate-300 text-sm">{b.text}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-sm" data-testid="text-dealer-hint">
            Use your registered dealer mobile number to login
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
