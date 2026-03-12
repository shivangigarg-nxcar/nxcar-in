'use client';

interface CityHeroProps {
  cityName: string;
  citySlug: string;
  totalListings: number;
  selectedMakes?: string[];
  selectedModels?: string[];
}

export function CityHero({ cityName, citySlug, totalListings, selectedMakes = [], selectedModels = [] }: CityHeroProps) {
  const city = cityName || citySlug;
  const count = totalListings > 0 ? totalListings.toLocaleString("en-IN") : "";

  let titleMiddle = "Used Cars";
  if (selectedMakes.length === 1 && selectedModels.length === 1) {
    titleMiddle = `Used ${selectedMakes[0]} ${selectedModels[0]} Cars`;
  } else if (selectedMakes.length === 1) {
    titleMiddle = `Used ${selectedMakes[0]} Cars`;
  }

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold" data-testid="text-page-title">
        {count ? `${count} ` : ""}{titleMiddle} in {city}
      </h1>
    </div>
  );
}
