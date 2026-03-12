import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Car Valuation",
  description: "Get an instant and accurate valuation of your used car. Know the fair market price before you sell on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
