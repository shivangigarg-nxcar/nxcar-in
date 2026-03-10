'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from '@hooks/use-theme';
import { CarComparisonProvider } from '@hooks/use-car-comparison';
import { FavoritesProvider } from '@hooks/use-favorites';
import { TooltipProvider } from '@components/ui/tooltip';
import { Toaster } from '@components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ComparisonBar } from '@components/comparison-bar';
import HeadTags from '../utils/HeadTags';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CarComparisonProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <HeadTags />
              {children}
              <ComparisonBar />
            </TooltipProvider>
          </FavoritesProvider>
        </CarComparisonProvider>
      </ThemeProvider>
      <Toaster />
      <SonnerToaster position="bottom-right" theme="dark" />
    </QueryClientProvider>
  );
}
