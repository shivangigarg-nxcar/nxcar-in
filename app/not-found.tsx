import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Nxcar",
  description: "The page you're looking for doesn't exist. Return to Nxcar homepage.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#0A0E14]">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-xl">
        <div className="flex mb-4 gap-2 items-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-404-title">404 Page Not Found</h1>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-slate-400" data-testid="text-404-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
          data-testid="link-go-home"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
