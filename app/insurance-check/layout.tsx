import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Car Insurance Status",
  description: "Verify car insurance status online. Check insurance validity and details before buying a used car on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
