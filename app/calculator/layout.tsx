import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Used Car Loan EMI Calculator",
  description: "Calculate your used car loan EMI instantly. Compare interest rates and find the best financing options on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
