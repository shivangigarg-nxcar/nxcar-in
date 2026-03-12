import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Buying & Selling Tips Blog",
  description: "Expert tips, guides, and news about buying and selling used cars in India from the Nxcar blog.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
