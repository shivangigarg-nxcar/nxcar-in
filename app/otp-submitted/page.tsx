"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { CheckCircle } from "lucide-react";

export default function OtpSubmitted() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] flex flex-col" data-testid="otp-submitted-page">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" data-testid="icon-success" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3" data-testid="text-success-heading">
            Login Successful!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8" data-testid="text-success-subtitle">
            Welcome to Nxcar. You are now signed in.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
            data-testid="button-go-home"
          >
            Go to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
