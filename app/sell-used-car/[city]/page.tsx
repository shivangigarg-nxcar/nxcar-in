"use client";

import { useParams } from "next/navigation";
import SellCarPage from "../page";

const CITY_CONFIG: Record<string, string> = {
  delhi: "Sell Your Car in Delhi in 24 Hours",
  gurgaon: "Sell Your Car in Gurgaon in 24 Hours",
};

export default function SellCarCityPage() {
  const params = useParams();
  const citySlug = (params.city as string) || "";
  const tagline = CITY_CONFIG[citySlug] || null;

  return <SellCarPage cityTagline={tagline} />;
}
