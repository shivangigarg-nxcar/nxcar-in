import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Vehicle Challan Online",
  description: "Check pending traffic challans for any vehicle online. Verify challan status before buying a used car on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
