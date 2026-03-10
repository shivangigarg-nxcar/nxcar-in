'use client';

import { useEffect } from 'react';
import { Button } from '@components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-error-title">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6" data-testid="text-error-message">
          We're having trouble loading this page. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} data-testid="button-try-again">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'} data-testid="button-go-home">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
