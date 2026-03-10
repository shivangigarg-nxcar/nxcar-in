'use client';

import { Input } from "@components/ui/input";
import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by make, model...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative" data-testid="search-bar">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 h-11 text-base focus:ring-2 focus:ring-primary/20 rounded-md"
        data-testid="input-search"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
          data-testid="button-clear-search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
