'use client';

interface CarJsonLdProps {
  make: string;
  model: string;
  year: number;
  price: number;
  kilometersDriven: number;
  fuelType: string;
  transmission: string;
  city: string;
  image?: string;
  vehicleId: string;
  variant?: string;
  color?: string;
}

export function CarJsonLd({
  make, model, year, price, kilometersDriven, fuelType,
  transmission, city, image, vehicleId, variant, color,
}: CarJsonLdProps) {
  const name = `${year} ${make} ${model}${variant ? ` ${variant}` : ""}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": name,
    "brand": { "@type": "Brand", "name": make },
    "model": model,
    "vehicleModelDate": String(year),
    "itemCondition": "https://schema.org/UsedCondition",
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": kilometersDriven,
      "unitCode": "KMT",
    },
    "fuelType": fuelType,
    "vehicleTransmission": transmission,
    ...(color ? { "color": color } : {}),
    ...(image ? { "image": image } : {}),
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "INR",
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": "https://schema.org/InStock",
      "url": `https://nxcar.in/used-cars/${city.toLowerCase().replace(/ /g, "-")}/${make.toLowerCase()}-${model.toLowerCase()}-${vehicleId}`,
      "seller": {
        "@type": "Organization",
        "name": "Nxcar",
        "url": "https://nxcar.in",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface DealerJsonLdProps {
  name: string;
  address: string;
  rating?: string;
  reviewCount?: number;
  phone?: string;
  image?: string;
  url: string;
}

export function DealerJsonLd({
  name, address, rating, reviewCount, phone, image, url,
}: DealerJsonLdProps) {
  const ratingNum = rating ? parseFloat(rating) : 0;
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressCountry": "IN",
    },
    "url": `https://nxcar.in${url}`,
    ...(phone ? { "telephone": `+91${phone}` } : {}),
    ...(image ? { "image": image } : {}),
  };

  if (ratingNum >= 3 && reviewCount && reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingNum.toFixed(1),
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": `https://nxcar.in${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
