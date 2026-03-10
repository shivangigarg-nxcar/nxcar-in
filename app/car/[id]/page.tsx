'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CarRedirect() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/used-cars/all/car-${id}`);
    }
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
