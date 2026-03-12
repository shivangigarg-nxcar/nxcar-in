import type { Metadata } from "next";

function formatCityName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityName = formatCityName(city);
  const title = `Sell Used Car in ${cityName}`;
  const description = `Sell your used car in ${cityName} at the best price. Free inspection, instant valuation, and quick sale on NxCar.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
