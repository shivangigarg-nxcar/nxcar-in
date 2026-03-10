"use client";

import { Card, CardContent } from "@components/ui/card";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "@lib/api";

export function Testimonials() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => getTestimonials(15),
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-100 dark:bg-[#101820] text-slate-900 dark:text-white relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mx-auto mb-2" />
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mx-auto" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-[280px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-800/50">
                <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 bg-slate-100 dark:bg-[#101820] text-slate-900 dark:text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 via-transparent to-slate-200/60 dark:from-slate-800/25 dark:via-transparent dark:to-gray-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-slate-400/10 dark:bg-slate-500/15 rounded-full blur-[100px] -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-400/10 dark:bg-gray-600/15 rounded-full blur-[100px] -ml-20 -mb-20"></div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12" aria-label="Customer testimonials">
          <h2 className="text-3xl font-heading font-black uppercase italic tracking-tight mb-2 text-slate-900 dark:text-white">
            Stories of <span className="text-primary">Joy</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Real experiences from thousands of happy Nxcar families.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((story) => (
              <CarouselItem key={story.id} className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Card className="bg-white/80 dark:bg-card/50 border-slate-200 dark:border-white/5 overflow-hidden h-full hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img 
                      src={story.imageUrl} 
                      alt={story.name}
                      width={320}
                      height={180}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="font-bold text-white text-sm truncate">{story.name}</h3>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[9px] text-slate-300 uppercase tracking-wide">{story.location}</span>
                        <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider">{story.carSoldOrBought}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3 relative">
                    <Quote className="h-4 w-4 text-primary/30 absolute top-2 right-2" />
                    <p className="text-slate-600 dark:text-slate-300 italic text-xs leading-relaxed pr-2">
                      "{story.testimonialText}"
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4 md:-left-12 h-8 w-8 bg-white/90 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-primary hover:border-primary text-slate-700 dark:text-white shadow-md" />
          <CarouselNext className="hidden sm:flex -right-4 md:-right-12 h-8 w-8 bg-white/90 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-primary hover:border-primary text-slate-700 dark:text-white shadow-md" />
        </Carousel>
      </div>
    </section>
  );
}
