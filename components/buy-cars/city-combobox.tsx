'use client';

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { cn } from "@lib/utils";
import { MapPin, Check, ChevronsUpDown } from "lucide-react";
import type { City } from "./filter-types";

export function CityCombobox({
  cities,
  value,
  onValueChange,
  placeholder = "Select a city...",
}: {
  cities: City[];
  value: string;
  onValueChange: (cityId: string, cityName: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedCity = cities.find((c) => c.city_id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal bg-background border-border text-foreground hover:bg-muted"
          data-testid="select-city"
        >
          {selectedCity ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {selectedCity.city_name}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-popover border border-border shadow-xl" align="start">
        <Command className="bg-popover">
          <CommandInput placeholder="Search city..." data-testid="input-city-search" className="text-foreground" />
          <CommandList className="bg-popover">
            <CommandEmpty className="text-muted-foreground">No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.city_id}
                  value={city.city_name}
                  onSelect={() => {
                    onValueChange(city.city_id, city.city_name);
                    setOpen(false);
                  }}
                  data-testid={`option-city-${city.city_id}`}
                  className="text-foreground"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === city.city_id ? "opacity-100" : "opacity-0")} />
                  <span className="flex-1">{city.city_name}</span>
                  <span className="text-xs text-muted-foreground">{city.v_cnt} cars</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
