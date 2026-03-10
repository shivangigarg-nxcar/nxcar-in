import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // Seed cars
  const carData = [
    {
      name: "Maruti Swift ZXi+",
      brand: "Maruti",
      model: "Swift ZXi+",
      year: 2020,
      price: 650000,
      fuelType: "Petrol",
      transmission: "Manual",
      kilometers: 35000,
      location: "Delhi",
      imageUrl: "/images/car-hatchback.png",
      isFeatured: true
    },
    {
      name: "Hyundai Creta SX",
      brand: "Hyundai",
      model: "Creta SX",
      year: 2021,
      price: 1280000,
      fuelType: "Diesel",
      transmission: "Automatic",
      kilometers: 25000,
      location: "Mumbai",
      imageUrl: "/images/car-suv.png",
      isFeatured: true
    },
    {
      name: "Honda City ZX",
      brand: "Honda",
      model: "City ZX",
      year: 2019,
      price: 925000,
      fuelType: "Petrol",
      transmission: "Manual",
      kilometers: 42000,
      location: "Bangalore",
      imageUrl: "/images/car-sedan.png",
      isFeatured: false
    }
  ];

  for (const car of carData) {
    await storage.createCar(car);
  }

  // Seed testimonials
  const testimonialData = [
    {
      name: "Rahul S.",
      location: "Delhi",
      imageUrl: "/images/delivery-moment.png",
      testimonialText: "Sold my Swift in 2 hrs! Unbeatable price.",
      carSoldOrBought: "Sold Swift",
      rating: 5
    },
    {
      name: "Amit V.",
      location: "Bangalore",
      imageUrl: "/images/loan-happy.png",
      testimonialText: "Loan approved in 24hrs. Hassle-free.",
      carSoldOrBought: "Bought Creta",
      rating: 5
    },
    {
      name: "Sneha G.",
      location: "Mumbai",
      imageUrl: "/images/sell-car-couple.png",
      testimonialText: "Nxcar handled RC transfer perfectly.",
      carSoldOrBought: "Sold City",
      rating: 5
    }
  ];

  for (const testimonial of testimonialData) {
    await storage.createTestimonial(testimonial);
  }

  // Seed dealer cities
  const cityData = [
    { name: "Delhi", region: "North", dealerCount: 124 },
    { name: "Mumbai", region: "West", dealerCount: 98 },
    { name: "Bangalore", region: "South", dealerCount: 86 },
    { name: "Chennai", region: "South", dealerCount: 65 },
    { name: "Hyderabad", region: "South", dealerCount: 72 },
    { name: "Pune", region: "West", dealerCount: 54 },
    { name: "Kolkata", region: "East", dealerCount: 45 },
    { name: "Ahmedabad", region: "West", dealerCount: 58 },
    { name: "Jaipur", region: "North", dealerCount: 32 },
    { name: "Lucknow", region: "North", dealerCount: 28 },
    { name: "Chandigarh", region: "North", dealerCount: 36 },
    { name: "Indore", region: "Central", dealerCount: 24 }
  ];

  for (const city of cityData) {
    await storage.createDealerCity(city);
  }

  // Seed Nxcar locations
  const locationData = [
    { city: "Delhi", location: "South Extension", imageUrl: "/images/store-delhi.png" },
    { city: "Mumbai", location: "Andheri West", imageUrl: "/images/store-mumbai.png" },
    { city: "Bangalore", location: "Indiranagar", imageUrl: "/images/store-bangalore.png" },
    { city: "Chennai", location: "Anna Nagar", imageUrl: "/images/store-chennai.png" },
    { city: "Hyderabad", location: "Jubilee Hills", imageUrl: "/images/store-hyderabad.png" },
    { city: "Gurgaon", location: "Cyber City", imageUrl: "/images/store-delhi.png" },
    { city: "Pune", location: "Koregaon Park", imageUrl: "/images/store-mumbai.png" },
    { city: "Noida", location: "Sector 18", imageUrl: "/images/store-delhi.png" },
    { city: "Kolkata", location: "Salt Lake", imageUrl: "/images/store-chennai.png" },
    { city: "Ahmedabad", location: "SG Highway", imageUrl: "/images/store-mumbai.png" },
    { city: "Jaipur", location: "Vaishali Nagar", imageUrl: "/images/store-delhi.png" },
    { city: "Chandigarh", location: "Sector 17", imageUrl: "/images/store-bangalore.png" }
  ];

  for (const location of locationData) {
    await storage.createNxcarLocation(location);
  }

  // Seed marketing banners
  const bannerData = [
    {
      title: "Used Car Loans from 25+ Partners",
      subtitle: "Starting at 8.5% p.a.",
      description: "Get instant approval with minimal documentation. Compare rates from India's top lenders.",
      ctaText: "Apply Now",
      ctaLink: "/loans",
      position: "loan",
      isActive: true,
      priority: 10
    },
    {
      title: "Sell Your Car in 2 Hours",
      subtitle: "Best Price Guaranteed",
      description: "Get instant valuation and same-day payment. No paperwork hassle.",
      ctaText: "Get Free Valuation",
      ctaLink: "/sell-used-car",
      position: "homepage",
      isActive: true,
      priority: 5
    }
  ];

  for (const banner of bannerData) {
    await storage.createMarketingBanner(banner);
  }

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
