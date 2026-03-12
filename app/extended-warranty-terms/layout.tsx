import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extended Warranty Terms",
  description: "Read the terms and conditions for Nxcar's extended warranty plans for used cars.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
