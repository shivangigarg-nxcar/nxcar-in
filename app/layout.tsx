import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading', display: 'swap', weight: ['500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: { default: 'Nxcar - Buy & Sell Used Cars | Best Price Guaranteed', template: '%s | Nxcar' },
  description: 'India\'s most trusted platform for buying and selling used cars. Get instant valuation, verified dealers, same-day payment, and used car loans from 25+ banking partners.',
  keywords: ['used cars', 'sell car', 'buy used car', 'second hand car', 'car valuation', 'used car loan', 'nxcar'],
  authors: [{ name: 'Nxcar' }],
  openGraph: {
    title: 'Nxcar - Buy & Sell Used Cars',
    description: 'India\'s most trusted platform for buying and selling used cars.',
    type: 'website',
    siteName: 'Nxcar',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: 'Nxcar - Buy & Sell Used Cars' },
  alternates: { canonical: 'https://nxcar.in' },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://nxcar.in'),
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.nxcar.in" />
        <link rel="dns-prefetch" href="https://api.nxcar.in" />
        <link rel="preconnect" href="https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com" />
        <link 
          rel="preload" 
          as="image" 
          href="/images/hero-car-desktop.webp"
          fetchPriority="high"
          imageSrcSet="/images/hero-car-mobile.webp 640w, /images/hero-car-tablet.webp 1024w, /images/hero-car-desktop.webp 1920w"
          imageSizes="100vw"
          type="image/webp"
        />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} min-h-screen bg-background text-foreground antialiased overflow-x-hidden`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
