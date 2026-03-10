'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Heart, BarChart3, Car, Sparkles, Phone } from "lucide-react";

const benefits = [
  { icon: Heart, text: "Save your favorite cars" },
  { icon: BarChart3, text: "Track your transactions" },
  { icon: Car, text: "List and manage your cars" },
  { icon: Sparkles, text: "Get personalized recommendations" },
];

export default function Login() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          router.push("/");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
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
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }
      sessionStorage.setItem("otp_phone", phone);
      router.push("/otp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E14] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] flex flex-col" data-testid="login-page">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3" data-testid="text-welcome">
            Welcome to Nxcar
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-8 sm:mb-10" data-testid="text-subtitle">
            Sign in with your phone number
          </p>

          <div className="mb-4">
            <div className="flex items-center bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <span className="text-slate-900 dark:text-white font-medium px-4 py-3 bg-slate-200 dark:bg-white/5 border-r border-slate-300 dark:border-white/10 select-none" data-testid="text-country-code">
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
                className="flex-1 bg-transparent text-slate-900 dark:text-white text-lg px-4 py-3 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                maxLength={10}
                data-testid="input-phone"
              />
              <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-4" />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4" data-testid="text-error">
              {error}
            </p>
          )}

          <button
            onClick={handleSendOtp}
            disabled={loading || phone.length !== 10}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-send-otp"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-3 text-left bg-slate-100 dark:bg-white/5 rounded-lg p-4"
                data-testid={`benefit-${b.text.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <b.icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-sm">{b.text}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-sm" data-testid="text-signup-hint">
            We'll send a one-time password to verify your number
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
