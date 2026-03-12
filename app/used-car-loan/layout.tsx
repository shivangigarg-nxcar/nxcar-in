import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Used Car Loan - Low Interest Rates",
  description: "Get the best used car loan with low interest rates from 25+ banking partners. Quick approval and easy documentation on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
