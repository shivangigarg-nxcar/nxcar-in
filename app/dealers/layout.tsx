import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Used Car Dealer Network",
  description: "Access India's most exclusive network of premium pre-owned car dealerships. All dealers verified for quality and customer satisfaction.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
