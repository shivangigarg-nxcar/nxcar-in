import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Used Car",
  description: "Sell your used car at the best price. Free inspection, instant valuation, and quick sale on NxCar.",
  openGraph: {
    title: "Sell Used Car",
    description: "Sell your used car at the best price. Free inspection, instant valuation, and quick sale on NxCar.",
  },
  twitter: {
    title: "Sell Used Car",
    description: "Sell your used car at the best price. Free inspection, instant valuation, and quick sale on NxCar.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
