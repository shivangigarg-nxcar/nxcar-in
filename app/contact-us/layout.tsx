import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Nxcar for buying, selling, or financing used cars. Reach our support team for any queries.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
