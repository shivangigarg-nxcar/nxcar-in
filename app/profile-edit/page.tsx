'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { UserCog, Phone, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@hooks/use-toast";
import { useAuth } from "@hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import LoginModal from "@components/login-modal";

export default function ProfileEdit() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [authLoading, isAuthenticated]);

  const [fullName, setFullName] = useState("");
  const [dealershipName, setDealershipName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  const [phoneChanged, setPhoneChanged] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [loginId, setLoginId] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (user) {
      setFullName(user.firstName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setOriginalPhone(user.phone || "");
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('authState');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.username && !user?.firstName) setFullName(parsed.username);
          if (parsed.mobile && !user?.phone) {
            setPhone(parsed.mobile);
            setOriginalPhone(parsed.mobile);
          }
        } catch {}
      }
    }
  }, [user]);

  useEffect(() => {
    setPhoneChanged(phone !== originalPhone && phone.length > 0);
    if (phone === originalPhone) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp(["", "", "", ""]);
      setOtpError("");
      setLoginId("");
    }
  }, [phone, originalPhone]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  async function handleSendPhoneOtp() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setOtpError("Please enter a valid 10-digit Indian phone number");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.message || "Failed to send OTP");
        return;
      }
      if (data.login_id) setLoginId(data.login_id);
      setOtpSent(true);
      setResendCountdown(30);
      setOtp(["", "", "", ""]);
    } catch {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  }

  async function handleVerifyPhoneOtp() {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setOtpError("Please enter the complete 4-digit OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.message || "Invalid OTP");
        return;
      }
      setOtpVerified(true);
      setOriginalPhone(phone);
      toast({ title: "Phone number verified", description: "Your new phone number has been verified." });
    } catch {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleSave() {
    if (!fullName.trim()) {
      setNameError("Full name is required");
      return;
    }
    setNameError("");

    if (phoneChanged && !otpVerified) {
      setOtpError("Please verify your new phone number first");
      return;
    }

    setSaving(true);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      let nxcarUserIdFromStorage: string | undefined;

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('authState');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.token) {
              headers["Authorization"] = `Bearer ${parsed.token}`;
            }
            if (parsed.nxcar_user_id) {
              nxcarUserIdFromStorage = parsed.nxcar_user_id;
            }
          } catch {}
        }
      }

      const res = await fetch("/api/auth/profile-edit", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          name: fullName.trim(),
          dealership_name: dealershipName.trim() || " ",
          email: email.trim(),
          phone_number: phone,
          ...(nxcarUserIdFromStorage ? { nxcar_user_id: nxcarUserIdFromStorage } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Error", description: data.message || "Failed to update profile", variant: "destructive" });
        return;
      }
      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('authState');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            parsed.username = fullName.trim();
            parsed.mobile = phone;
            if (email.trim()) parsed.email = email.trim();
            localStorage.setItem('authState', JSON.stringify(parsed));
          } catch {}
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    router.back();
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-14 pb-4">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-muted rounded-lg animate-pulse" />
              <div>
                <div className="h-5 w-24 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 w-40 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-6">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-card border border-border rounded-2xl p-8 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <div className="h-12 flex-1 bg-muted rounded-lg animate-pulse" />
                <div className="h-12 flex-1 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <UserCog className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-muted-foreground mb-2">Login to edit your profile</h2>
          <p className="text-muted-foreground mb-6">Sign in to manage your profile details.</p>
        </div>
        <Footer />
        <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="profile-edit-page">
      <Navbar />

      <section className="pt-14 pb-4">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground" data-testid="text-page-title">
                Edit Profile
              </h1>
              <p className="text-xs text-muted-foreground" data-testid="text-page-subtitle">
                Manage your account details
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 relative min-h-[400px]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setNameError(""); }}
                  placeholder="Enter your full name"
                  className={nameError ? "border-red-500 focus:border-red-500" : ""}
                  data-testid="input-full-name"
                />
                {nameError && (
                  <p className="text-red-500 text-xs flex items-center gap-1" data-testid="text-name-error">
                    <AlertCircle className="h-3 w-3" /> {nameError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealershipName" className="text-sm font-medium">
                  Dealership Name
                </Label>
                <Input
                  id="dealershipName"
                  type="text"
                  value={dealershipName}
                  onChange={(e) => setDealershipName(e.target.value)}
                  placeholder="Enter dealership name (if applicable)"
                  data-testid="input-dealership-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Mobile Number
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground px-3 py-2 bg-muted rounded-md border border-border">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(digits);
                      setOtpError("");
                    }}
                    placeholder="Enter your phone number"
                    maxLength={10}
                    data-testid="input-phone"
                  />
                </div>
                {phoneChanged && !otpVerified && (
                  <div className="mt-3 p-4 bg-muted/50 border border-border rounded-xl space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Phone number changed. Please verify with OTP to update.
                    </p>
                    {!otpSent ? (
                      <Button
                        size="sm"
                        onClick={handleSendPhoneOtp}
                        disabled={otpLoading || phone.length !== 10}
                        className="bg-primary hover:bg-primary/90 text-white text-xs"
                        data-testid="button-send-phone-otp"
                      >
                        {otpLoading ? "Sending..." : "Send OTP"}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-center gap-2">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              ref={otpRefs[index]}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className="w-10 h-10 text-center text-lg font-bold bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                              data-testid={`input-phone-otp-${index}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <Button
                            size="sm"
                            onClick={handleVerifyPhoneOtp}
                            disabled={otpLoading || otp.join("").length !== 4}
                            className="bg-primary hover:bg-primary/90 text-white text-xs"
                            data-testid="button-verify-phone-otp"
                          >
                            {otpLoading ? "Verifying..." : "Verify OTP"}
                          </Button>
                          {resendCountdown > 0 ? (
                            <span className="text-xs text-muted-foreground">Resend in {resendCountdown}s</span>
                          ) : (
                            <button
                              onClick={handleSendPhoneOtp}
                              disabled={otpLoading}
                              className="text-xs text-primary hover:text-primary/80 font-medium"
                              data-testid="button-resend-phone-otp"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {otpError && (
                      <p className="text-red-500 text-xs" data-testid="text-phone-otp-error">{otpError}</p>
                    )}
                  </div>
                )}
                {phoneChanged && otpVerified && (
                  <p className="text-green-500 text-xs mt-1" data-testid="text-phone-verified">Phone number verified successfully</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/90 font-bold uppercase tracking-wider h-12 text-sm"
                  data-testid="button-save-changes"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 font-bold uppercase tracking-wider h-12 text-sm"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
