import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Favorite Cars",
  description: "View and manage your saved favorite used cars on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
