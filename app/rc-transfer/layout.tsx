import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RC Transfer Service",
  description: "Quick and hassle-free RC transfer service for used car ownership transition. Doorstep documentation assistance on Nxcar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
