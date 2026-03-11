'use client';

import { usePathname } from 'next/navigation';

export function CanonicalTag() {
  const pathname = usePathname();
  const canonical = `https://nxcar.in${pathname === '/' ? '' : pathname}`;

  return <link rel="canonical" href={canonical} />;
}
