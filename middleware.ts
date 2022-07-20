import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop();

  const slugFetch = await fetch(`${request.nextUrl.origin}/api/url/${slug}`);
  if (slugFetch.status === 404) {
    return NextResponse.redirect(request.nextUrl.origin);
  }
  const data = await slugFetch.json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}

export const config = {
  matcher: ['/:slug'],
};
