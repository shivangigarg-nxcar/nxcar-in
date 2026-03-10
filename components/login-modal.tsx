"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import { Phone } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resending, setResending] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const resetState = useCallback(() => {
    setStep("phone");
    setPhone("");
    setOtp(["", "", "", ""]);
    setLoading(false);
    setError("");
    setResendCountdown(0);
    setResending(false);
    setLoginId("");
    setIsConsentChecked(false);
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

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
      if (data.login_id) {
        setLoginId(data.login_id);
      }
      setStep("otp");
      setResendCountdown(30);
      setOtp(["", "", "", ""]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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

    if (!isConsentChecked) {
      setError("Please accept the terms to proceed");
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
      if (data.token) {
        const authState = {
          isLoggedIn: true,
          token: data.token,
          user_id: data.user?.id || null,
          nxcar_user_id: data.user?.nxcar_user_id || null,
          mobile: phone,
          username: data.user?.username || null,
          role_id: data.user?.role_id || null,
          loginTime: Date.now(),
        };
        localStorage.setItem('authState', JSON.stringify(authState));
        if (data.user?.nxcar_user_id) {
          localStorage.setItem('nxcar_user_id', String(data.user.nxcar_user_id));
        }
        if (data.user?.role_id) {
          localStorage.setItem('nxcar_role_id', String(data.user.role_id));
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onOpenChange(false);
      onSuccess?.();
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
        body: JSON.stringify({ phone, login_id: loginId }),
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

  function handleChangeNumber() {
    setStep("phone");
    setOtp(["", "", "", ""]);
    setError("");
    setResendCountdown(0);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-background border-border w-[calc(100vw-2rem)] sm:w-full max-w-md p-4 sm:p-6"
        data-testid="login-modal"
      >
        {step === "phone" ? (
          <>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground text-center">
              Sign in to Nxcar
            </DialogTitle>
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              Enter your phone number to continue
            </p>

            <div className="mt-2">
              <div className="flex items-center bg-muted/50 border border-border rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <span className="text-foreground font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-muted border-r border-border select-none text-sm sm:text-base">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendOtp();
                  }}
                  className="flex-1 bg-transparent text-foreground text-base sm:text-lg px-3 sm:px-4 py-2.5 sm:py-3 outline-none placeholder:text-muted-foreground min-w-0"
                  maxLength={10}
                  data-testid="modal-input-phone"
                />
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mr-3 sm:mr-4 shrink-0" />
              </div>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs sm:text-sm text-center" role="alert" aria-live="polite" data-testid="modal-text-error">
                {error}
              </p>
            )}

            <button
              onClick={handleSendOtp}
              disabled={loading || phone.length !== 10}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="modal-button-send-otp"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>

            <p className="text-muted-foreground text-xs text-center">
              We'll send a one-time password to verify your number
            </p>
          </>
        ) : (
          <>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground text-center">
              Verify OTP
            </DialogTitle>
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              Enter the 4-digit code sent to{" "}
              <span className="text-foreground font-medium">+91 {phone}</span>
            </p>

            <div className="flex justify-center gap-2 sm:gap-3 mt-2">
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
                  className="w-11 h-11 sm:w-14 sm:h-14 text-center text-lg sm:text-2xl font-bold bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  aria-label={`OTP digit ${index + 1}`}
                  data-testid={`modal-input-otp-${index}`}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs sm:text-sm text-center" role="alert" aria-live="polite" data-testid="modal-text-error">
                {error}
              </p>
            )}

            <div className="flex items-start gap-2 sm:gap-3">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={isConsentChecked}
                onChange={(e) => { setIsConsentChecked(e.target.checked); setError(""); }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-muted/50 text-primary focus:ring-primary"
                data-testid="modal-checkbox-consent"
              />
              <label htmlFor="consent-checkbox" className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                I acknowledge that I have read, understood, and agree to our{" "}
                <a href="https://www.nxcar.in/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium" data-testid="link-privacy-policy">Privacy Policy</a> and{" "}
                <a href="https://www.nxcar.in/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium" data-testid="link-terms-of-use">Terms of Use</a>.
              </label>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || otp.join("").length !== 4 || !isConsentChecked}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="modal-button-verify-otp"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-sm">
              {resendCountdown > 0 ? (
                <span className="text-muted-foreground" data-testid="modal-text-resend-countdown">
                  Resend OTP in {resendCountdown}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  data-testid="modal-button-resend-otp"
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              )}
              <span className="text-border">|</span>
              <button
                onClick={handleChangeNumber}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                data-testid="modal-link-change-number"
              >
                Change Number
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
