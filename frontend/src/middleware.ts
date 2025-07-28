import { NextResponse, NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-api-key', process.env.API_KEY as string);
  headers.set('x-url', request.nextUrl.pathname as string);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: '/api/:route*',
};
