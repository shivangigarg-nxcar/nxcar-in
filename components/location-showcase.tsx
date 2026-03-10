"use client";

import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@components/ui/carousel";
import { Card } from "@components/ui/card";
import { MapPin, Clock, Navigation } from "lucide-react";
import { Button } from "@components/ui/button";

interface ExperienceCenter {
  id: string;
  title: string;
  city: string;
  address: string;
  mapUrl: string;
  image: string;
  timings: string;
}

const EXPERIENCE_CENTERS: ExperienceCenter[] = [
  {
    id: "gurgaon-sector49",
    title: "Nxcar - Sector 49, Sohna Road, Gurugram",
    city: "Gurgaon",
    address: "Shop no. 18, 1st Floor, Ninex City Centre Mall, Sector-49, Sohna Road, Gurgaon, Haryana - 122018",
    mapUrl: "https://maps.app.goo.gl/4tH2GdGooh3LrdSe9",
    image: "https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/Static_App_Content/FranchiseImages/Nxcar-Sector49-Gurgaon.png",
    timings: "10:00 AM - 08:00 PM",
  },
  {
    id: "gurgaon-sector52",
    title: "Nxcar - Sector 52, Indira Colony, Gurugram",
    city: "Gurgaon",
    address: "166P, next to Veriezon Hospital, Indira Colony 1, Sector 52, Gurugram, Haryana 122003",
    mapUrl: "https://maps.app.goo.gl/CjPpduwY56Zi2Uet9",
    image: "https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/Static_App_Content/FranchiseImages/Nxcar-Sector52-Gurgaon.png",
    timings: "10:00 AM - 08:00 PM",
  },
  {
    id: "gurgaon-sector102",
    title: "Nxcar - Sector 102, Dwarka Expwy, Gurugram",
    city: "Gurgaon",
    address: "Shop No. 6, Ground Floor, Opp. Imperial Heritage School, 75 Mtrs Road, Near Shyam Chowk, Sector 102, Gurugram, Haryana - 122505",
    mapUrl: "https://maps.app.goo.gl/nNPG5NxqVfzsqaSWA",
    image: "https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/Static_App_Content/FranchiseImages/Nxcar-Sector102-Gurgoan.png",
    timings: "10:00 AM - 08:00 PM",
  },
  {
    id: "delhi-preetvihar",
    title: "Nxcar - Preet Vihar, New Delhi",
    city: "Delhi",
    address: "Vardhaman Tower, G21 & 22, Preet Vihar Rd, C Block, Preet Vihar, New Delhi, Delhi 110092",
    mapUrl: "https://maps.app.goo.gl/H3mYm9YRQNc6WraL8",
    image: "https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/Static_App_Content/FranchiseImages/Nxcar-PreetVihar-NewDelhi.png",
    timings: "10:00 AM - 08:00 PM",
  },
  {
    id: "delhi-nsp",
    title: "Nxcar - NSP, New Delhi",
    city: "Delhi",
    address: "Shop No G-5, RG Trade Tower, Netaji Subhash Place, Pitampura, New Delhi, Delhi 110034",
    mapUrl: "https://maps.app.goo.gl/QCeZojweGtxuaGHp9",
    image: "https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/Static_App_Content/FranchiseImages/Nxcar-NSP-NewDelhi.png",
    timings: "10:00 AM - 08:00 PM",
  },
  {
    id: "ghaziabad-sector14",
    title: "Nxcar - Sector 14, Ghaziabad",
    city: "Ghaziabad",
    address: "14A/637, Block A, Sector 14, Vasundhara, Ghaziabad, Uttar Pradesh 201012",
    mapUrl: "https://www.google.com/maps/dir//14A%2F637%2C+Block+A%2C+Sector+14%2C+Vasundhara%2C+Ghaziabad%2C+Uttar+Pradesh+201012",
    image: "https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/Static_App_Content/FranchiseImages/Nxcar-Sector14-Ghaziabad.png",
    timings: "10:00 AM - 08:00 PM",
  },
  {
    id: "bathinda-gtbnagar",
    title: "Nxcar - GTB Nagar, Bathinda",
    city: "Bathinda",
    address: "100 Feet Rd, opp. National Bakery, Bathinda, Punjab 151001",
    mapUrl: "https://maps.app.goo.gl/SC9EuUHcoPpTFCNE9",
    image: "https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/Static_App_Content/FranchiseImages/Nxcar-GTBNagar-Bhatinda.png",
    timings: "10:00 AM - 08:00 PM",
  },
  {
    id: "mohali-sector88",
    title: "Nxcar - Sector 88, Mohali",
    city: "Mohali",
    address: "Plot No. 3012, opposite Park, Sector 88, Sahibzada Ajit Singh Nagar, Punjab 140308",
    mapUrl: "https://maps.app.goo.gl/nmFupDcKu5wEoKbZ6",
    image: "https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/Static_App_Content/FranchiseImages/Nxcar-Sector88-Mohali.png",
    timings: "10:00 AM - 08:00 PM",
  },
];

export function LocationShowcase() {
  return (
    <section className="py-12 sm:py-24 bg-white dark:bg-[#0e151c] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 via-transparent to-gray-100/40 dark:from-slate-900/25 dark:via-transparent dark:to-teal-950/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/5 dark:bg-teal-500/15 rounded-full blur-[100px]"></div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">
              Experience <span className="text-primary">Centers</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl">
              Visit our premium experience centers for personalized car selling & buying assistance.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-primary font-mono text-sm tracking-widest border border-primary/30 px-3 py-1 bg-primary/10 rounded">
              {EXPERIENCE_CENTERS.length} LOCATIONS ACTIVE
            </span>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {EXPERIENCE_CENTERS.map((center) => (
              <CarouselItem key={center.id} className="basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4" data-testid={`card-center-${center.id}`}>
                <Card className="border-0 bg-white dark:bg-card rounded-xl overflow-hidden group relative hover:ring-1 hover:ring-primary/50 transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={center.image} 
                      alt={center.title}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/store-delhi.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/70 group-hover:to-black/50" />

                    <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full transition-all duration-300 hidden sm:block sm:group-hover:opacity-0 sm:group-hover:translate-y-2">
                      <h3 className="font-heading font-bold text-white text-lg leading-tight mb-1">{center.title.replace("Nxcar - ", "")}</h3>
                      <div className="flex items-center text-xs text-white/70 mt-1.5">
                        <Clock className="w-3 h-3 mr-1.5 shrink-0" />
                        <span>{center.timings}</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 hidden sm:flex flex-col items-center justify-center p-4 text-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <h3 className="font-heading font-bold text-white text-base leading-tight mb-3">{center.title.replace("Nxcar - ", "")}</h3>
                      <div className="flex items-start text-white/90 mb-4 text-left">
                        <MapPin className="w-4 h-4 mr-2 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs leading-relaxed line-clamp-3">{center.address}</span>
                      </div>
                      <a
                        href={center.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        data-testid={`button-direction-${center.id}`}
                      >
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs h-8 px-4">
                          <Navigation className="mr-1.5 h-3.5 w-3.5" /> Get Directions
                        </Button>
                      </a>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:hidden">
                      <h3 className="font-heading font-bold text-white text-sm leading-tight mb-1">{center.title.replace("Nxcar - ", "")}</h3>
                      <div className="flex items-start text-white/80 mb-2">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary shrink-0 mt-0.5" />
                        <span className="text-[10px] leading-relaxed line-clamp-2">{center.address}</span>
                      </div>
                      <a
                        href={center.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        data-testid={`button-direction-mobile-${center.id}`}
                      >
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white text-[10px] h-7 px-3">
                          <Navigation className="mr-1 h-3 w-3" /> Get Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex gap-2 justify-end mt-6">
            <CarouselPrevious className="static translate-y-0 bg-white dark:bg-card border-slate-200 dark:border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-colors h-10 w-10 text-slate-700 dark:text-white" />
            <CarouselNext className="static translate-y-0 bg-white dark:bg-card border-slate-200 dark:border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-colors h-10 w-10 text-slate-700 dark:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
