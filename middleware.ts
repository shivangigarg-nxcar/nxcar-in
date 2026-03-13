import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function slugify(str: string): string {
  return decodeURIComponent(str)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const nonWwwHost = host.replace(/^www\./, '').replace(/:\d+$/, '');
    const redirectUrl = `https://${nonWwwHost}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  const { pathname } = request.nextUrl;

  const oldMatch = pathname.match(/^\/used-cars?-in\/(.+)/);
  if (oldMatch) {
    const segments = oldMatch[1].split('/').filter(Boolean);

    const lastSegment = segments[segments.length - 1];
    if (segments.length >= 2 && /^\d+$/.test(lastSegment)) {
      const city = slugify(segments[0]);
      const id = lastSegment;
      const middleParts = segments.slice(1, -1).map(slugify).filter(Boolean);
      const carSlug = middleParts.length > 0
        ? `${middleParts.join('-')}-${id}`
        : id;
      const url = request.nextUrl.clone();
      url.pathname = `/used-cars/${city}/${carSlug}`;
      return NextResponse.redirect(url, 301);
    }

    const city = slugify(segments[0]);
    const url = request.nextUrl.clone();
    url.pathname = `/used-cars/${city}`;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
