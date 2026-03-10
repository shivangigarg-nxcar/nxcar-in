'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";

export default function OTP() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(30);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("otp_phone");
    if (!storedPhone) {
      router.push("/login");
      return;
    }
    setPhone(storedPhone);
  }, [router]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }

  async function handleVerify() {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid OTP. Please try again.");
        return;
      }
      sessionStorage.removeItem("otp_phone");
      router.push("/otp-is-submitted");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCountdown > 0) return;
    setResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }
      setResendCountdown(30);
      setOtp(["", "", "", ""]);
      inputRefs[0].current?.focus();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  }

  if (!phone) {
    return (
      <div className="min-h-screen bg-[#0A0E14] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col" data-testid="otp-page">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-3" data-testid="text-verify-heading">
            Verify OTP
          </h1>
          <p className="text-slate-400 text-lg mb-10" data-testid="text-verify-subtitle">
            Enter the 4-digit code sent to{" "}
            <span className="text-white font-medium">+91 {phone}</span>
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                data-testid={`input-otp-${index}`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4" data-testid="text-error">
              {error}
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 4}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-verify-otp"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="flex items-center justify-center gap-4 text-sm">
            {resendCountdown > 0 ? (
              <span className="text-slate-500" data-testid="text-resend-countdown">
                Resend OTP in {resendCountdown}s
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                data-testid="button-resend-otp"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            )}
            <span className="text-slate-600">|</span>
            <button
              onClick={() => {
                sessionStorage.removeItem("otp_phone");
                router.push("/login");
              }}
              className="text-slate-400 hover:text-white font-medium transition-colors"
              data-testid="link-change-number"
            >
              Change Number
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
