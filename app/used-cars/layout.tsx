import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Used Cars in India",
  description: "Browse and buy verified used cars across India. Best prices, inspected cars, and easy financing options on NxCar.",
  openGraph: {
    title: "Buy Used Cars in India",
    description: "Browse and buy verified used cars across India. Best prices, inspected cars, and easy financing options on NxCar.",
  },
  twitter: {
    title: "Buy Used Cars in India",
    description: "Browse and buy verified used cars across India. Best prices, inspected cars, and easy financing options on NxCar.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
