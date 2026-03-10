"use client";

const heroStyles = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.hero-animate { animation: fadeInUp 0.8s ease-out both; }
.hero-animate-delay-1 { animation: fadeIn 0.6s ease-out 0.2s both; }
.hero-animate-delay-2 { animation: fadeInUp 0.6s ease-out 0.3s both; }
.hero-animate-delay-3 { animation: fadeIn 0.5s ease-out 0.5s both; }
`;

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Zap, Banknote, Trophy, Shield, FileCheck, AlertTriangle, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const CAR_NUMBER_REGEX = /^(?:[A-Z]{2}\s?[0-9]{1,2}\s?[A-Z]{1,3}\s?[0-9]{1,4}|[0-9]{2}\s?BH\s?[0-9]{4}\s?[A-Z]{2})$/;

export function Hero() {
  const [carNumber, setCarNumber] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = carNumber.trim().toUpperCase();
    if (!trimmed) {
      setAlertMessage("Please enter your car number.");
      return;
    }
    if (!CAR_NUMBER_REGEX.test(trimmed)) {
      setAlertMessage("Please enter a valid car number plate.\nExample: MH 02 AB 1234 or 22 BH 1234 AA");
      return;
    }
    setAlertMessage("");
    setIsNavigating(true);
    router.push(`/sell-used-car?carNumber=${encodeURIComponent(trimmed)}`);
  };

  const features = useMemo(() => [
    { icon: Zap, label: "Sell in 2 Hours", bgColor: "bg-gradient-to-br from-teal-500 to-cyan-600", iconColor: "text-white" },
    { icon: Banknote, label: "Immediate Payment", bgColor: "bg-gradient-to-br from-slate-500 to-slate-600", iconColor: "text-white" },
    { icon: Trophy, label: "Best Price", bgColor: "bg-gradient-to-br from-blue-500 to-blue-600", iconColor: "text-white" },
    { icon: Shield, label: "Secure Transfer", bgColor: "bg-gradient-to-br from-slate-400 to-slate-500", iconColor: "text-white" },
    { icon: FileCheck, label: "Legal Indemnity", bgColor: "bg-gradient-to-br from-teal-400 to-teal-600", iconColor: "text-white" },
  ], []);

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-background">
      <style dangerouslySetInnerHTML={{ __html: heroStyles }} />

      {alertMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setAlertMessage("")} data-testid="overlay-car-number-alert">
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-[90%] mx-4 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()} data-testid="dialog-car-number-alert">
            <button onClick={() => setAlertMessage("")} className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" data-testid="button-close-alert">
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Invalid Car Number</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-line">{alertMessage}</p>
              </div>
              <button onClick={() => setAlertMessage("")} className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors" data-testid="button-alert-ok">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-0">
        <picture>
          <source
            srcSet="/images/hero-car-mobile.webp 640w, /images/hero-car-tablet.webp 1024w, /images/hero-car-desktop.webp 1920w"
            sizes="100vw"
            type="image/webp"
          />
          <img
            src="/images/hero-car.png"
            alt="Premium SUV on scenic road"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-[75%_center] sm:object-[center_20%]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent md:w-[60%]" />
      </div>

      <div className="relative z-10 h-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[85vh] items-center">
          <div
            className="hero-animate w-full max-w-xl space-y-6 pt-24 pb-12"
          >
            <div 
              className="hero-animate-delay-1 inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-1.5 backdrop-blur-sm border border-primary/30"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-semibold text-sm">India's Trusted Car Platform</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Sell Your Car
              <br />
              <span className="text-primary">At Best Price</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 max-w-sm sm:max-w-md leading-relaxed font-medium">
              Get <span className="text-primary font-bold">instant valuation</span>, <span className="text-primary font-bold">immediate payment</span>, and <span className="font-bold">hassle-free RC transfer</span>. 
              Join <span className="text-primary font-black">50,000+</span> happy customers who upgraded their ride with Nxcar.
            </p>

            <form onSubmit={handleSubmit} aria-label="Car valuation form" className="space-y-4">
              <div 
                className="hero-animate-delay-2 flex flex-col sm:flex-row gap-3 max-w-lg"
              >
                <div className="relative p-[2px] bg-rose-700 rounded-xl shadow-lg w-full sm:w-[60%]">
                  <Input
                    data-testid="input-car-number"
                    value={carNumber}
                    onChange={(e) => setCarNumber(e.target.value)}
                    placeholder="Enter Car Number (MH 02 AB 1234)"
                    className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-0 text-foreground placeholder:text-slate-500 dark:placeholder:text-slate-400 font-mono tracking-wider uppercase w-full text-sm sm:text-xl font-bold rounded-[10px] focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
                <Button 
                  data-testid="button-check-price"
                  type="submit"
                  disabled={isNavigating}
                  aria-label="Get car price"
                  size="lg" 
                  className="h-14 sm:h-16 bg-primary hover:bg-primary/90 text-white font-black uppercase px-4 sm:px-8 text-sm sm:text-lg transition-all hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 whitespace-nowrap rounded-xl w-full sm:w-[40%]"
                >
                  {isNavigating ? <span role="status" aria-live="polite">...</span> : "Get Price"}
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                ✓ Free valuation &nbsp;•&nbsp; ✓ No obligation &nbsp;•&nbsp; ✓ Takes 30 seconds
              </p>
            </form>

            <div className="flex flex-wrap gap-2 pt-3">
              {features.map(({ icon: Icon, label, bgColor, iconColor }) => (
                <div 
                  key={label} 
                  className="hero-animate-delay-3 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/10"
                >
                  <div className={`w-6 h-6 shrink-0 rounded-md ${bgColor} flex items-center justify-center`}>
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} strokeWidth={2.5} />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
