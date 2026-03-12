import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Cars Dashboard",
  description: "Manage your car listings, track inspection status, and view offers on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
