import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('userId', token.sub as string)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/api/gameid', '/api/pda', '/api/game', '/api/bid', '/api/dashboard', '/api/dashboard/profile'],
};
 