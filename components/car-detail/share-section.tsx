"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Share2, MessageCircle, Mail, Copy, ClipboardCheck } from "lucide-react";

function formatPriceNoSymbol(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString("en-IN");
}

interface ShareSectionProps {
  car: {
    year: number;
    make: string;
    model: string;
    variant?: string;
    price: number;
  };
}

export function ShareSection({ car }: ShareSectionProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const sharePath = typeof window !== "undefined" ? window.location.pathname : "";
  const shareUrl = `https://nx.nxcar.ai${sharePath}`;
  const shareText = `Check out this ${car.year} ${car.make} ${car.model} on NxCar!\n${shareUrl}`;

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2000);
        }).catch(() => {
          fallbackCopy(shareUrl);
        });
      } else {
        fallbackCopy(shareUrl);
      }
    } catch {
      fallbackCopy(shareUrl);
    }
  };

  const fallbackCopy = (text: string) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="border-t pt-3" data-testid="section-share">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Share2 className="h-3.5 w-3.5" /> Share This Car
      </p>
      <div className="flex gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="button-share-whatsapp"
        >
          <Button variant="outline" size="icon" className="h-9 w-9 border-green-500/30 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(`Check out this ${car.year} ${car.make} ${car.model} on NxCar`)}&body=${encodeURIComponent(`I found this great car on NxCar!\n\n${car.year} ${car.make} ${car.model} ${car.variant || ""}\nPrice: ₹${formatPriceNoSymbol(car.price)}\n\n${shareUrl}`)}`}
          data-testid="button-share-email"
        >
          <Button variant="outline" size="icon" className="h-9 w-9 border-blue-500/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10">
            <Mail className="h-4 w-4" />
          </Button>
        </a>
        <Button
          variant="outline"
          size="icon"
          className={`h-9 w-9 ${linkCopied ? "border-green-500/50 text-green-600 bg-green-50 dark:bg-green-500/10" : "border-slate-500/30 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-500/10"}`}
          data-testid="button-share-copy"
          onClick={handleCopy}
        >
          {linkCopied ? <ClipboardCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
