import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Nxcar - India's trusted platform for buying and selling used cars with verified dealers and transparent pricing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
