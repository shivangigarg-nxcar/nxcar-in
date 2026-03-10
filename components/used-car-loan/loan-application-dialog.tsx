"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { useToast } from "@hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface LoanApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoanApplicationDialog({ open, onOpenChange }: LoanApplicationDialogProps) {
  const { toast } = useToast();
  const [loanName, setLoanName] = useState("");
  const [loanPhone, setLoanPhone] = useState("");
  const [loanType, setLoanType] = useState("");
  const [loanIncome, setLoanIncome] = useState("");
  const [loanPancard, setLoanPancard] = useState("");
  const [loanExistingEmi, setLoanExistingEmi] = useState("");
  const [loanSubmitting, setLoanSubmitting] = useState(false);
  const [panError, setPanError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const validatePan = (value: string) => {
    if (!value) {
      setPanError("");
      return false;
    }
    if (!PAN_REGEX.test(value)) {
      setPanError("Please enter a correct PAN number (e.g., ABCDE1234F)");
      return false;
    }
    setPanError("");
    return true;
  };

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSendOtp = async () => {
    if (!validatePhone(loanPhone)) return;
    setOtpSending(true);
    try {
      const response = await fetch('/api/nxcar/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: loanPhone }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        toast({ title: "OTP Sent", description: "A verification code has been sent to your mobile number." });
      } else {
        toast({ title: "Failed to send OTP", description: data.error || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to send OTP", description: "Please try again.", variant: "destructive" });
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      toast({ title: "Invalid OTP", description: "Please enter the complete OTP.", variant: "destructive" });
      return;
    }
    setOtpVerifying(true);
    try {
      const response = await fetch('/api/nxcar/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: loanPhone, otp }),
      });
      const data = await response.json();
      if (response.ok && data.verified) {
        setOtpVerified(true);
        toast({ title: "Mobile Verified", description: "Your mobile number has been verified successfully." });
      } else {
        toast({ title: "Invalid OTP", description: data.error || "Please enter the correct OTP.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Verification Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePan(loanPancard)) return;
    if (!validatePhone(loanPhone)) return;
    if (!otpVerified) {
      toast({ title: "Verify Mobile Number", description: "Please verify your mobile number with OTP before submitting.", variant: "destructive" });
      return;
    }

    setLoanSubmitting(true);
    try {
      const response = await fetch('/api/nxcar/loan-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: loanName,
          mobile: loanPhone,
          loan_type: loanType || "",
          salary: loanIncome || "0",
          pancard: loanPancard,
          existing_emi: loanExistingEmi || "0",
        }),
      });
      const data = await response.json();
      if (!response.ok || data.message?.includes("violated")) {
        toast({ title: "Submission Failed", description: data.message || "Please try again.", variant: "destructive" });
        return;
      }
      const leadInfo = data.lead_id ? ` (Ref: #${data.lead_id})` : "";
      toast({ title: "Application Submitted!" + leadInfo, description: data.message || "Our loan team will contact you within 24 hours." });
      onOpenChange(false);
      setLoanName("");
      setLoanPhone("");
      setLoanType("");
      setLoanIncome("");
      setLoanPancard("");
      setLoanExistingEmi("");
      setOtpSent(false);
      setOtp("");
      setOtpVerified(false);
    } catch {
      toast({ title: "Submission Failed", description: "Please try again or call us directly.", variant: "destructive" });
    } finally {
      setLoanSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Car Loan</DialogTitle>
          <DialogDescription>Fill in your details and our team will get back to you.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLoanSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loan-name">Full Name</Label>
            <Input
              id="loan-name"
              type="text"
              required
              placeholder="Enter your full name"
              value={loanName}
              onChange={(e) => setLoanName(e.target.value)}
              data-testid="input-loan-name"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="text-name-hint">Enter name as per your PAN Card</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan-phone">Mobile Number</Label>
            <div className="flex gap-2">
              <Input
                id="loan-phone"
                type="tel"
                required
                placeholder="Enter 10-digit mobile number"
                value={loanPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setLoanPhone(val);
                  setPhoneError("");
                  if (otpVerified || otpSent) {
                    setOtpSent(false);
                    setOtpVerified(false);
                    setOtp("");
                  }
                }}
                disabled={otpVerified}
                className={`flex-1 ${phoneError ? "border-red-500" : ""} ${otpVerified ? "bg-green-50 dark:bg-green-900/20 border-green-500" : ""}`}
                data-testid="input-loan-phone"
              />
              {!otpVerified && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                  disabled={otpSending || loanPhone.length !== 10}
                  className="shrink-0 text-sm"
                  data-testid="button-send-otp"
                >
                  {otpSending ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                </Button>
              )}
              {otpVerified && (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 shrink-0" data-testid="text-phone-verified">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>
            {phoneError && <p className="text-xs text-red-500" data-testid="text-phone-error">{phoneError}</p>}
            {otpSent && !otpVerified && (
              <div className="flex gap-2 mt-2">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="flex-1"
                  data-testid="input-otp"
                />
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpVerifying || otp.length < 4}
                  className="shrink-0 bg-teal-600 hover:bg-teal-700"
                  data-testid="button-verify-otp"
                >
                  {otpVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan-type">Loan Type</Label>
            <Select value={loanType} onValueChange={setLoanType}>
              <SelectTrigger data-testid="select-loan-type">
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refinance">Refinance</SelectItem>
                <SelectItem value="pre-owned-purchase">Pre Owned Car Purchase</SelectItem>
                <SelectItem value="balance-transfer-topup">Balance Transfer & Top Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan-income">Monthly Income (₹)</Label>
            <Input
              id="loan-income"
              type="text"
              required
              placeholder="e.g., 50000"
              value={loanIncome}
              onChange={(e) => setLoanIncome(e.target.value.replace(/\D/g, ""))}
              data-testid="input-loan-income"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan-pancard">PAN Card Number</Label>
            <Input
              id="loan-pancard"
              type="text"
              required
              placeholder="e.g., ABCDE1234F"
              value={loanPancard}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().slice(0, 10);
                setLoanPancard(val);
                if (panError) validatePan(val);
              }}
              onBlur={() => { if (loanPancard) validatePan(loanPancard); }}
              className={panError ? "border-red-500" : ""}
              data-testid="input-loan-pancard"
            />
            {panError && <p className="text-xs text-red-500" data-testid="text-pan-error">{panError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan-emi">Existing Monthly EMI (₹)</Label>
            <Input
              id="loan-emi"
              type="text"
              placeholder="e.g., 5000 (enter 0 if none)"
              value={loanExistingEmi}
              onChange={(e) => setLoanExistingEmi(e.target.value.replace(/\D/g, ""))}
              data-testid="input-loan-emi"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loanSubmitting || !otpVerified} data-testid="button-loan-submit">
            {loanSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
