import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about buying, selling, and financing used cars on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
